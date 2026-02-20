const { db_Select, db_Insert } = require("../../../model/mysqlModel");

const express = require("express"),
  dayEndRouter = express.Router(),
  dateFormat = require("dateformat");
const admin = require('../../../config/firebase');  

  // send flag that closed_date = opened_date
  dayEndRouter.post("/fetch_brnwise_end_details", async (req, res) => {
  try{
   var data = req.body;

   var select = "branch_code,DATE_FORMAT(closed_date, '%Y-%m-%d') closed_date,DATE_FORMAT(opened_date, '%Y-%m-%d') opened_date,closed_by,closed_at,opened_by,opened_at",
   table_name = "td_eod_sod",
  //  whr = data.branch_code == '100' ? '' : `branch_code IN (${data.branch_code})`,
   whr = `branch_code IN (${data.branch_code})`,
   order = `ORDER BY  branch_code,closed_date DESC`;
   var day_end_data = await db_Select(select,table_name,whr,order);

    let end_flag = [];

   // Add flag = 'Y' if closed_date = opened_date
    if (day_end_data && Array.isArray(day_end_data.msg)) {
      end_flag = day_end_data.msg.map(row =>
        row.closed_date === row.opened_date ? 'C' : 'O'
      );
    }
   res.send({end_flag: end_flag.join('')});
  }catch(error){
    console.log("error to fetch day end data",error);
    res.send({ error: "Server Error" });
  }
  });

  // fetch all closed branch details for head office
dayEndRouter.post("/fetch_brnwise_end_details_fr_ho", async (req, res) => {
  try{
   var data = req.body;

   if(data.openClose_upto == 'C'){
   var select = "a.branch_code,b.branch_name,DATE_FORMAT(a.closed_date, '%Y-%m-%d') closed_date,DATE_FORMAT(a.opened_date, '%Y-%m-%d') opened_date,a.closed_by,a.closed_at,a.opened_by,a.opened_at",
   table_name = "td_eod_sod a LEFT JOIN md_branch b ON a.branch_code = b.branch_code",
   whr = `a.closed_date = a.opened_date`,
   order = `ORDER BY a.branch_code`;
   var day_end_data_ho = await db_Select(select,table_name,whr,order);
   }else {
   var select = "a.branch_code,b.branch_name,DATE_FORMAT(a.closed_date, '%Y-%m-%d') closed_date,DATE_FORMAT(a.opened_date, '%Y-%m-%d') opened_date,a.closed_by,a.closed_at,a.opened_by,a.opened_at",
   table_name = "td_eod_sod a LEFT JOIN md_branch b ON a.branch_code = b.branch_code",
   whr = `a.closed_date <> a.opened_date`,
   order = `ORDER BY a.branch_code`;
   var day_end_data_ho = await db_Select(select,table_name,whr,order);
   }

   res.send({day_end_data_ho});
  }catch(error){
    console.log("error to fetch day end data",error);
    res.send({ error: "Server Error" });
  }
  });

  // check any unapprove transaction has or not
  dayEndRouter.post("/check_unapprove_transaction_dtls", async (req, res) => {
   try{
    var data = req.body;
    // console.log(data,'data');

    let branches = data.branch_code.toString().split(",").map(b => b.trim());

    let branchResults = [];   
    let totalAllBranches = 0;

     // LOOP FOR EACH BRANCH
      for (let brn of branches) {

     // Fetch UNAPPROVED MEMBER TRANSFERS 
     var select = "COUNT(*) AS total",
     table_name = "td_member_transfer",
     whr = `from_branch IN (${brn}) AND approval_status = 'U'`,
     order = null;
     var mem_unapprove_dtls = await db_Select(select,table_name,whr,order);
     let mem_unapproved = mem_unapprove_dtls.msg[0].total || 0;

     // Fetch UNAPPROVED GROUP TRANSFERS
     var select = "COUNT(*) AS total",
     table_name = "td_co_transfer",
     whr = `from_brn IN (${brn}) AND approval_status = 'U'`,
     order = null;
     var grp_unapprove_dtls = await db_Select(select,table_name,whr,order);
     let grp_unapproved  = grp_unapprove_dtls.msg[0].total || 0;

     // Fetch UNAPPROVED APPROVED TRANSACTIONS
    var select = "COUNT(*) AS total",
    table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
    whr = `a.branch_code IN (${brn}) AND b.status = 'U'`,
    order = null;
    var trn_unapprove_dtls = await db_Select(select,table_name,whr,order);
    let trn_unapproved   = trn_unapprove_dtls.msg[0].total || 0;

    // Fetch UNAPPROVED DISBURSEMENTS
    var select = "COUNT(*) AS total",
    table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
    whr = `a.branch_code IN (${brn}) AND b.status = 'U'`,
    order = null;
    var disb_unapprove_dtls = await db_Select(select,table_name,whr,order);
    let disb_unapproved   = disb_unapprove_dtls.msg[0].total || 0;

     let branch_total =
        mem_unapproved +
        grp_unapproved +
        trn_unapproved +
        disb_unapproved;

      totalAllBranches += branch_total;

      let unapprove_flag = branch_total > 0 ? "Y" : "N";

       // PUSH RESULT FOR THIS BRANCH
      branchResults.push({
        branch_code: brn,
        unapprove_flag,
        total_unapproved: branch_total,
        details: {
          member_transfer: mem_unapproved,
          group_transfer: grp_unapproved,
          approve_transaction: trn_unapproved,
          disbursement: disb_unapproved
        }
      });
    }
     // Multiple branches → send array
    if (branches.length > 1) {
      return res.send({
        total_unapproved_all_branches: totalAllBranches,
        branches: branchResults
      });
    }

    // Single branch → return only one object
    return res.send({
      branches: branchResults
    });
   }catch(error){
    console.log("fetch error when check any unapprove transaction has or not" , error);
    res.send({ error: "Server Error" });
   }
  });

  //   // check any unapprove transaction has or not
  // dayEndRouter.post("/check_unapprove_transaction", async (req, res) => {
  //  try{
  //   var data = req.body;
  //   console.log(data,'data');

  //   let branches = data.branch_code.toString().split(",").map(b => b.trim());

  //   let branchResults = [];   
  //   // let totalAllBranches = 0;

  //    // LOOP FOR EACH BRANCH
  //     for (let brn of branches) {

  //    // Fetch UNAPPROVED MEMBER TRANSFERS 
  //    var select = "COUNT(*) AS total",
  //    table_name = "td_member_transfer",
  //    whr = `from_branch IN (${brn}) AND approval_status = 'U'`,
  //    order = null;
  //    var mem_unapprove_dtls = await db_Select(select,table_name,whr,order);
  //    let mem_unapproved = mem_unapprove_dtls.msg[0].total || 0;

  //    // Fetch UNAPPROVED GROUP TRANSFERS
  //    var select = "COUNT(*) AS total",
  //    table_name = "td_co_transfer",
  //    whr = `from_brn IN (${brn}) AND approval_status = 'U'`,
  //    order = null;
  //    var grp_unapprove_dtls = await db_Select(select,table_name,whr,order);
  //    let grp_unapproved  = grp_unapprove_dtls.msg[0].total || 0;

  //    // Fetch UNAPPROVED APPROVED TRANSACTIONS
  //   var select = "COUNT(*) AS total",
  //   table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  //   whr = `a.branch_code IN (${brn}) AND b.status = 'U'`,
  //   order = null;
  //   var trn_unapprove_dtls = await db_Select(select,table_name,whr,order);
  //   let trn_unapproved   = trn_unapprove_dtls.msg[0].total || 0;

  //   // Fetch UNAPPROVED DISBURSEMENTS
  //   var select = "COUNT(*) AS total",
  //   table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  //   whr = `a.branch_code IN (${brn}) AND b.status = 'U'`,
  //   order = null;
  //   var disb_unapprove_dtls = await db_Select(select,table_name,whr,order);
  //   let disb_unapproved   = disb_unapprove_dtls.msg[0].total || 0;

  //    let branch_total =
  //       mem_unapproved +
  //       grp_unapproved +
  //       trn_unapproved +
  //       disb_unapproved;

  //     // totalAllBranches += branch_total;

  //     let unapprove_flag = branch_total > 0 ? "Y" : "N";

  //      // PUSH RESULT FOR THIS BRANCH
  //     branchResults.push({
  //       branch_code: brn,
  //       unapprove_flag,
  //       // total_unapproved: branch_total,
  //       // details: {
  //       //   member_transfer: mem_unapproved,
  //       //   group_transfer: grp_unapproved,
  //       //   approve_transaction: trn_unapproved,
  //       //   disbursement: disb_unapproved
  //       // }
  //     });
  //   }
  //    // Multiple branches → send array
  //   if (branches.length > 1) {
  //     return res.send({
  //       // total_unapproved_all_branches: totalAllBranches,
  //       branches: branchResults
  //     });
  //   }

  //   // Single branch → return only one object
  //   return res.send({
  //     branches: branchResults
  //   });
  //  }catch(error){
  //   console.log("fetch error when check any unapprove transaction has or not" , error);
  //   res.send({ error: "Server Error" });
  //  }
  // });

//   dayEndRouter.post("/check_unapprove_transaction", async (req, res) => {
//   try {
//     var data = req.body;
//     let branches = data.branch_code.toString().split(",").map(b => b.trim());

//     let branchResults = [];

//     for (let brn of branches) {

//       // SINGLE QUERY TO FETCH ALL UNAPPROVED COUNTS
//       let sql = `
//         SELECT
//           (SELECT COUNT(*) FROM td_member_transfer 
//              WHERE from_branch = '${brn}' AND approval_status = 'U') AS member_transfer,
          
//           (SELECT COUNT(*) FROM td_co_transfer 
//              WHERE from_brn = '${brn}' AND approval_status = 'U') AS group_transfer,

//           (SELECT COUNT(*) 
//              FROM td_loan a 
//              LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id
//              WHERE a.branch_code = '${brn}' AND b.status = 'U') AS loan_unapproved
//       `;

//        let resp = await db_Select("", null, null, null, true, sql);

//       let result = resp.msg[0];

//       let branch_total =
//         Number(result.member_transfer) +
//         Number(result.group_transfer) +
//         Number(result.loan_unapproved);

//       let unapprove_flag = branch_total > 0 ? "Y" : "N";

//       // Only send the flag
//       branchResults.push({
//         branch_code: brn,
//         unapprove_flag: unapprove_flag
//       });
//     }

//     return res.send({ branches: branchResults });

//   } catch (error) {
//     console.log("Error in check_unapprove_transaction:", error);
//     res.send({ error: "Server Error" });
//   }
// });

// dayEndRouter.post("/check_unapprove_transaction", async (req, res) => {
//   try {
//     var data = req.body;
//     let branches = [];

//      if (data.branch_code == "100") {
//       let brnSql = `SELECT branch_code FROM md_branch ORDER BY branch_code`;
//       let brnResp = await db_Select("", null, null, null, true, brnSql);

//       if (!brnResp || brnResp.suc === 0) {
//         return res.send({ suc: 0, msg: "Unable to fetch branch list" });
//       }

//       branches = brnResp.msg.map(dt => dt.branch_code);
//     } else {
//       branches = data.branch_code.toString().split(",").map(b => b.trim());
//     }

//      let branchResults = [];

//     for (let brn of branches) {

//       var select = "a.loan_id,b.status",
//       table_name = "td_loan a,td_loan_transactions b",
//       whr = `a.loan_id = b.loan_id AND a.branch_code = '${brn}' AND a.outstanding > 0 AND b.status = 'U'
//       AND b.payment_date = '${data.closed_date}'`,
//       order = null;
//       var trn_unapprove_dtls = await db_Select(select,table_name,whr,order);
//       // let trn_unapproved   = trn_unapprove_dtls.msg[0].total || 0;

//       if (!trn_unapprove_dtls || trn_unapprove_dtls.suc === 0) {
//         return res.send({ suc: 0, branches: [] });
//       }

//         let total_unapproved = trn_unapprove_dtls.msg.length
//          console.log(total_unapproved,'result');
       

//       // let branch_total =
//       //   Number(result.member_transfer) +
//       //   Number(result.group_transfer) +
//       //   Number(result.loan_unapproved);
         
//       let unapprove_flag = total_unapproved > 0 ? "Y" : "N";

//       branchResults.push({
//         branch_code: brn,
//         unapprove_flag: unapprove_flag
//       });

//     }

//     return res.send({  suc: 1, branches: branchResults });

//   } catch (error) {
//     console.log("Error in check_unapprove_transaction:", error);
//     return res.send({ suc: 0, error: "Server Error" });
//   }
// });

dayEndRouter.post("/check_unapprove_transaction", async (req, res) => {
  try {
    var data = req.body;
    let branch_dtls = [];

    // CASE 1: If branch_code = 100 → fetch all branches + same closed_date
    if (data.branch_code == "100") {
      let brnSql = `SELECT branch_code FROM md_branch ORDER BY branch_code`;
      let brnResp = await db_Select("", null, null, null, true, brnSql);

      if (!brnResp || brnResp.suc === 0) {
        return res.send({ suc: 0, msg: "Unable to fetch branch list" });
      }
    }
    else {
      branch_dtls = data.branch_dtls;  
    }

    let branchResults = [];

    for (let item of branch_dtls) {
      let brn = Array.isArray(item.branch_code) ? item.branch_code[0] : item.branch_code;
      let closed_date = item.closed_date;

      let select = "a.loan_id, b.status";
      let table_name = "td_loan a, td_loan_transactions b";
      let whr = `
        a.loan_id = b.loan_id
        AND a.branch_code = '${brn}'
        AND a.outstanding > 0
        AND b.status = 'U'`;
      let order = null;

      let trn_unapprove_dtls = await db_Select(select, table_name, whr, order);

      if (!trn_unapprove_dtls || trn_unapprove_dtls.suc === 0) {
        return res.send({ suc: 0, branches: [] });
      }

      let total_unapproved = trn_unapprove_dtls.msg.length;
      

      let unapprove_flag = total_unapproved > 0 ? "Y" : "N";

      branchResults.push({
        branch_code: brn,
        // closed_date: closed_date,
        unapprove_flag: unapprove_flag
      });
    }

    return res.send({ suc: 1, branches: branchResults });

  } catch (error) {
    console.log("Error in check_unapprove_transaction:", error);
    return res.send({ suc: 0, error: "Server Error" });
  }
});


  // HO open new date
  dayEndRouter.post("/ho_open_new_date", async (req, res) => {
    try{
    var data = req.body;
    console.log(data,'open_data');
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let branches = data.branch_code.toString().split(",").map(b => b.trim());
    
    for(let branch of branches){
    var table_name = "td_eod_sod",
    fields = `opened_date = '${data.opened_date}',opened_by = '${data.user_name}',opened_at = '${datetime}'`,
    values = null,
    whr = `branch_code IN (${branch})`,
    flag = 1 ;
    var open_data = await db_Insert(table_name,fields,values,whr,flag);

    // FETCH ACTIVE USERS OF THIS BRANCH
      let users = await db_Select(
        "emp_id, session_id, fcm_token",
        "md_user",
        `brn_code='${branch}' AND user_status='A'`,
        null
      );

       for (let user of users.msg) {
          // SEND FIREBASE MESSAGE (APP USERS)
        if (user.fcm_token) {
          try {
            await admin.messaging().send({
              token: user.fcm_token,
              notification: {
                title: "New Day Opened",
                body: `Branch is opened. Please login again.`
              },
              data: {
                type: "OPEN_NEW_DATE_LOGOUT",
                branch_code: branch,
                opened_date: data.opened_date
              }
            });

            // console.log(`FCM sent to ${user.emp_id}:`, response);

          } catch (err) {
            console.log("FCM error:", user.emp_id, err);
          }
        }
        // LOGOUT USER (WEB + APP)
        await db_Insert(
          "md_user",
          `session_id=NULL, fcm_token=NULL`,
          null,
          `emp_id='${user.emp_id}'`,
          1
        );
      }
    }
    res.send(open_data);
    }catch(error){
    console.log("fetch error when open new date" , error);
    res.send({ error: "Server Error" });
    }
  });

    // HO recert the date
  dayEndRouter.post("/ho_revert_date", async (req, res) => {
    try{
    var data = req.body;
    // console.log(data,'revert_data');
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let branches = data.branch_code.toString().split(",").map(b => b.trim());

    // Convert opened date to previous day
    let oldDate = new Date(data.opened_date);          
    oldDate.setDate(oldDate.getDate() - 1);            
    let newClosedDate = dateFormat(oldDate, "yyyy-mm-dd"); 
    // console.log(newClosedDate);
    
    
    for(let branch of branches){
    var table_name = "td_eod_sod",
    fields = `closed_date = '${newClosedDate}',revert_by = '${data.user_name}',revert_at = '${datetime}'`,
    values = null,
    whr = `branch_code IN (${branch}) AND opened_date = '${data.opened_date}'`,
    flag = 1 ;
    var revert_data = await db_Insert(table_name,fields,values,whr,flag);

    // FETCH ACTIVE USERS OF THIS BRANCH
      let users = await db_Select(
        "emp_id, session_id, fcm_token",
        "md_user",
        `brn_code='${branch}' AND user_status='A'`,
        null
      );

       for (let user of users.msg) {
          // SEND FIREBASE MESSAGE (APP USERS)
        if (user.fcm_token) {
          try {
            await admin.messaging().send({
              token: user.fcm_token,
              notification: {
                title: "Operational Date Reverted",
                body: `Operational date has been reverted. Please login again.`
              },
              data: {
                type: "REVERT_DATE_LOGOUT",
                branch_code: branch,
                reverted_date: newClosedDate
              }
            });

            // console.log(`FCM sent to ${user.emp_id}:`, response);

          } catch (err) {
            console.log("FCM error:", user.emp_id, err);
          }
        }
        // LOGOUT USER (WEB + APP)
        await db_Insert(
          "md_user",
          `session_id=NULL, fcm_token=NULL`,
          null,
          `emp_id='${user.emp_id}'`,
          1
        );
      }
    }
    res.send(revert_data);
    }catch(error){
    console.log("fetch error when open new date" , error);
    res.send({ error: "Server Error" });
    }
  });

  // FETCH OPENED DATE BASED ON BRANCH 19.02.2026
  dayEndRouter.post("/fetch_open_date", async (req, res) => {
    try{
     var data = req.body;
    //  console.log(data,'gagaga');
     

     var select = "DATE_FORMAT(opened_date, '%Y-%m-%d') AS opened_date",
     table_name = "td_eod_sod",
     whr = `branch_code = '${data.branch_code}'`,
     order = null;
     var open_date = await db_Select(select,table_name,whr,order);
    res.send(open_date)
    }catch(error){
    console.log("error when fetch opened date" , error);
    res.send({ error: "Server Error" });
    }
  });

  // MANUAL DAY END 19.02.2026
  dayEndRouter.post("/manual_day_end", async (req, res) => {
    try{
     var data = req.body;
    //  console.log(data,'manual day end');

    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let branch_dt = data.branch_dt;

    if (branch_dt.suc <= 0 || branch_dt.length === 0) {
      return res.send({
        suc: 1,
        msg: "No branch data received",
        data: []
      });
    }

     for (let dt of branch_dt) {
      // UPDATE EOD
      let table_name = "td_eod_sod",
      fields = `closed_date = '${dt.opened_date}',closed_by = '${data.closed_by}',closed_at = '${datetime}'`,
      values = null,
      whr = `branch_code = '${dt.branch_code}'`,
      flag = 1;
      let eod_data_manual = await db_Insert(table_name, fields, values, whr, flag);

     if (eod_data_manual.suc <= 0 || eod_data_manual.msg.length === 0) {
        console.log(`${dt.branch_code} EOD update failed`);
        continue;
     }

      // FETCH ACTIVE USERS
      let users = await db_Select("emp_id,brn_code,session_id,fcm_token","md_user",`brn_code='${dt.branch_code}' AND user_status = 'A'`,null);
      
      if ((!users || users.suc <= 0 || !users.msg || users.msg.length === 0)) {
        console.log("No active user found for branch", dt.branch_code);
        continue;
      }

       // LOGOUT USERS (NULL SESSION)
       for (let user of users.msg) {
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
        }catch (error) {
          console.log("FCM error:", user.emp_id, error);
        }
        }

       // LOGOUT WEB + APP USERS
       let table_name1 = "md_user",
       fields1 = `session_id = NULL, fcm_token = NULL`,
       values1 = null,
       whr1 = `emp_id = '${user.emp_id}'`, 
       flag1 = 1;
       var update_user_data_manual = await db_Insert(table_name1,fields1,values1,whr1,flag1);
     }
    }
    res.send({
      suc: 1,
      msg: "Manual Day End completed successfully. ALL Users logged out from APP and Web."
    });

    }catch(error){
    console.log("fetch error when manual day end" , error);
    res.send({ suc: 0,
      msg: "Server Error" });
    }
  });

  module.exports = {dayEndRouter}