const { db_Select, db_Insert } = require("../model/mysqlModel");
dateFormat = require("dateformat");
const admin = require("../config/firebase");
const fs = require("fs");
const path = require('path');


const eodCron = async () => {
  try {
    const today = dateFormat(new Date(), "yyyy-mm-dd");
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

     WriteLogFile(
      `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}] : EOD Scheduler Started\n`
    );

    // FETCH ALL BRANCHES
    let branch_dt = await db_Select(
      "branch_code,opened_date",
      "td_eod_sod",
      null,
      null
    );

     if (branch_dt.suc <= 0 || branch_dt.msg.length === 0) {
      WriteLogFile(
        `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}] : No branch data found\n`
      );
      return;
    }


    for (let dt of branch_dt.msg) {
      // UPDATE CLOSED DATE
      let opened_date = dateFormat(dt.opened_date, "yyyy-mm-dd");

      let table_name = "td_eod_sod",
        fields = `closed_date = '${opened_date}',closed_by = 'System',closed_at = '${datetime}'`,
        values = null,
        whr = `branch_code = '${dt.branch_code}'`,
        flag = 1;
      let eod_data = await db_Insert(table_name, fields, values, whr, flag);

      if (eod_data.suc > 0) {
          WriteLogFile(
            `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}/${dt.branch_code}] : EOD closed successfully\n`
          );
        } else {
          WriteLogFile(
            `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}/${dt.branch_code}] : Failed to close EOD - ${eod_data.msg}\n`
          );
          continue;
        }


      // console.log(`Branch ${dt.branch_code} closed for ${today}`);

      // FETCH ACTIVE USERS OF ALL BRANCHES (APP + WEB)
      let users = await db_Select(
        "emp_id,brn_code,session_id,fcm_token",
        "md_user",
        `brn_code='${dt.branch_code}' AND user_status = 'A'`,
        null
      );

       if (users.suc <= 0 || users.msg.length === 0) {
          WriteLogFile(
            `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}/${dt.branch_code}] : No active users found\n`
          );
          continue;
        }

      // LOGOUT USERS (NULL SESSION)
      for (let user of users.msg) {
        // SEND PUSH TO APP USERS
        if (user.fcm_token) {
          try {
            await admin.messaging().send({
              token: user.fcm_token,
              notification: {
                title: "Logged out by System",
                body: "Daily system reset completed. Please login again.",
              },
              data: {
                type: "EOD_LOGOUT",
              },
            });
            WriteLogFile(
                `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}/${dt.branch_code}/${user.emp_id}] : FCM sent successfully\n`
              );
            // console.log("FCM sent:", response);
          } catch (error) {
            console.log("FCM error:", user.emp_id, error);
             WriteLogFile(
                `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}/${dt.branch_code}/${user.emp_id}] : FCM error - ${error}\n`
              );
          }
        }

        // LOGOUT WEB + APP USERS

        let table_name = "md_user",
          fields = `session_id = NULL, fcm_token = NULL`,
          values = null;
        (whr = `emp_id = '${user.emp_id}'`), (flag = 1);
        var update_user_data = await db_Insert(
          table_name,
          fields,
          values,
          whr,
          flag
        );
         if (update_user_data.suc > 0) {
            WriteLogFile(
              `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}/${dt.branch_code}/${user.emp_id}] : User logged out\n`
            );
          } else {
            WriteLogFile(
              `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}/${dt.branch_code}/${user.emp_id}] : Logout failed - ${update_user_data.msg}\n`
            );
          }
        }

        // WriteLogFile(
        //   `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}/${dt.branch_code}] : EOD & logout completed\n`
        // );
      }

      // console.log(`EOD Process and logout done for barnch ${dt.branch_code}`);

      // console.log(update_user_data,'kiki');

      // console.log(`Logged out all users of branch ${dt.branch_code}`);

    // process.exit(1)
     WriteLogFile(
      `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}] : EOD Scheduler Completed\n`
    );
  } catch (error) {
    WriteLogFile(
      `[${dateFormat(new Date(), "dd-mmm-yy HH:MM:ss")}] : Scheduler Fatal Error - ${error}\n`
    );
            throw error;
    // console.error("EOD Cron Error:", error);
    // process.exit(1)
  }
};

const WriteLogFile = (text) => {
  fs.appendFileSync(path.join(__dirname, "eodScheduler.txt"),text);
};

eodCron().then(() => {
    process.exit(0); // success
  }).catch((err) => {
    console.error("Scheduler failed:", err);
    process.exit(1); // failure
  });
