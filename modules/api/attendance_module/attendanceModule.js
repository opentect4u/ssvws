var dateFormat = require("dateformat");
const { db_Insert, db_Select } = require("../../../model/mysqlModel");
const { createCustomToken } = require("../../../middleware/authMiddleware");
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config()
module.exports = {

  //save in attendance
  save_attendance_in: (data) => {
    return new Promise(async (resolve, reject) => {
      // console.log(data);
      let locationActiveToken = null
      try {
        let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
          max_end_time = dateFormat(new Date(), "yyyy-mm-dd 23:59:59");

        var select = "start_time",
          table_name = "md_check_in_out",
          whr = null,
          order = null;
        var get_start_time = await db_Select(select, table_name, whr, order);

        if (get_start_time.suc > 0 && get_start_time.msg.length > 0) {
          var start_time_dt = get_start_time.msg[0].start_time;

          var file_location = path.join(__dirname, `../../../activity_log/${data.emp_id}`);

          if (!fs.existsSync(file_location)) {
            fs.mkdirSync(file_location, { recursive: true });
          }

          const activeLogFilePath = `activity_log/${data.emp_id}/location_acc_log_${dateFormat(new Date(), "yyyy_mm_dd")}.json`;

          if (!fs.existsSync(path.join(__dirname, `../../../${activeLogFilePath}`))) {
            fs.writeFileSync(path.join(__dirname, `../../../${activeLogFilePath}`), JSON.stringify([]));
          }

          locationActiveToken = await createCustomToken({ emp_id: data.emp_id, start_dt: data.in_date_time, in_lat: data.in_lat, in_long: data.in_long, activeLogFilePath }, data.in_date_time, max_end_time);

          var clock_in_time = data.in_date_time.split(" ")[1];

          var table_name = "td_emp_attendance",
            fields = '(emp_id,entry_dt,in_date_time,in_lat,in_long,in_addr,late_in,location_acc_token_gen_dt,location_acc_token,location_acc_save_file_path,created_by,created_at)',
            values = `('${data.emp_id}','${datetime}','${data.in_date_time}','${data.in_lat}','${data.in_long}','${data.in_addr.split("'").join("\\'")}',${clock_in_time <= start_time_dt ? "NULL" : "'L'"},'${datetime}','${locationActiveToken}','${activeLogFilePath}','${data.created_by}','${datetime}')`,
            whr = null,
            flag = 0;
          var attendance_data = await db_Insert(table_name, fields, values, whr, flag);
        } else {
          reject({ "suc": 0, "msg": "Check-in time not found in master data." });
        }
        //   console.log(attendance_data,'dt');

        resolve({ "suc": 1, "msg": "Attendance data saved successfully", attendance_data, location_active_token: locationActiveToken, start_dt: data.in_date_time, max_end_time });

      } catch (error) {
        console.log(error);

        reject({ "suc": 0, "msg": "Error occurred during saving attendance details", details: error });
      }
    });
  },
  //save out attendance
  save_attendance_out: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log(data,'data');

        let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

        var select = "start_time,end_time",
          table_name = "md_check_in_out",
          whr = null,
          order = null;
        var get_time = await db_Select(select, table_name, whr, order);

        if (get_time.suc > 0 && get_time.msg.length > 0) {

          var start_time_dt = get_time.msg[0].start_time;
          var end_time_dt = get_time.msg[0].end_time
          //  console.log(end_time_dt,'dts');

          var clock_in_time = data.in_date_time.split(" ")[1];
          var clock_out_time = data.out_date_time.split(" ")[1];

          let late_status = "NULL";

          if (clock_in_time > start_time_dt) {
            late_status = "'L'";
          }

          if (clock_out_time < end_time_dt) {
            late_status = "'E'";
          }

          if (clock_in_time > start_time_dt && clock_out_time >= end_time_dt) {
            late_status = "'L'";
          }

          var table_name = "td_emp_attendance",
            fields = `out_date_time = '${data.out_date_time}',out_lat = '${data.out_lat}',out_long = '${data.out_long}',out_addr = '${data.out_addr.split("'").join("\\'")}',clock_status = 'O', late_in = ${late_status}, modified_by = '${data.modified_by}',modified_at = '${datetime}'`,
            values = null,
            whr = `emp_id = '${data.emp_id}' AND in_date_time = '${data.in_date_time}'`,
            flag = 1;
          var attendance_data_out = await db_Insert(table_name, fields, values, whr, flag);
        } else {
          reject({ "suc": 0, "msg": "Check-in/out time not found in master data." });
        }
        //   console.log(attendance_data_out,'dt');

        resolve({ "suc": 1, "msg": "Attendance data updated successfully", attendance_data_out });
      } catch (error) {
        reject({ "suc": 0, "msg": "Error occurred during updated attendance details", details: error });
      }
    });
  },
  saveLocationAccessLog: (data) => {
    return new Promise((resolve, reject) => {
      try {
        const verifyLocationToken = jwt.verify(data.location_acc_token, process.env.SECRET_KEY);
        if (verifyLocationToken && verifyLocationToken.emp_id == data.emp_id) {
          const logEntry = {
            sl_no: 0,
            emp_id: data.emp_id,
            timestamp: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
            latitude: data.latitude,
            longitude: data.longitude,
            dis: data.dis
          };
          const filePath = path.join(__dirname, `../../../${verifyLocationToken.activeLogFilePath}`);
          fs.readFile(filePath, 'utf8', (err, jsonString) => {
            if (err) {
              console.log("Error reading file:", err);
              return reject({ suc: 0, msg: "Error reading log file." });
            }
            try {
              const data = JSON.parse(jsonString);
              logEntry.sl_no = data.length + 1;
              data.push(logEntry);
              fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
                if (err) {
                  reject({ suc: 0, msg: "Error writing to log file." });
                }
                resolve({ suc: 1, msg: "Location access log saved successfully." });
              });
            } catch (err) {
              reject({ suc: 0, msg: "Error parsing log file." });
            }
          })
        } else {
          reject({ suc: 0, msg: "Invalid token or employee ID." });
        }
      } catch (error) {
        reject({ suc: 0, msg: "Error verifying token.", details: error });
      }
    })
  },
  getAttendanceDetailsByDate: (emp_id, entry_dt) => {
    return new Promise(async (resolve, reject) => {
      try {
        var select = "entry_dt,in_date_time,in_lat,in_long,in_addr,attan_status,clock_status,late_in,out_date_time,out_lat,out_long,out_addr, location_acc_token_gen_dt,location_acc_save_file_path",
          table_name = "td_emp_attendance",
          whr = `emp_id = '${emp_id}' AND entry_dt = '${dateFormat(new Date(entry_dt), "yyyy-mm-dd")}'`,
          order = `ORDER BY in_date_time DESC 
                   LIMIT 1`;
        var atten_emp_dtls = await db_Select(select, table_name, whr, order);
        resolve(atten_emp_dtls);
      } catch (error) {
        reject({ "suc": 0, "msg": "Error occurred during fetching attendance details", details: error });
      }
    })
  }
}