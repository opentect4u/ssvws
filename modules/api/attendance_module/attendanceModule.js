var dateFormat = require("dateformat");
const { db_Insert } = require("../../../model/mysqlModel");
module.exports = {
    save_attendance_in: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                  let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

                  var table_name = "td_emp_attendance",
                  fields = '(emp_id,entry_dt,in_date_time,in_lat,in_long,in_addr,created_by,created_at)',
                  values = `('${data.emp_id}','${datetime}','${data.in_date_time}','${data.in_lat}','${data.in_long}','${data.in_addr.split("'").join("\\'")}','${data.created_by}','${datetime}')`,
                  whr = null,
                  flag = 0;
                  var attendance_data = await db_Insert(table_name, fields, values, whr, flag);
                //   console.log(attendance_data,'dt');
                  
                  resolve({"suc" : 1, "msg": "Attendance data saved successfully", attendance_data});
                }catch(error){
                    reject({"suc": 0, "msg": "Error occurred during saving attendance details", details: error });
                }   
        });
    },

    save_attendance_out: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
              // console.log(data,'data');
              
                  let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

                  var table_name = "td_emp_attendance",
                  fields = `out_date_time = '${data.out_date_time}',out_lat = '${data.out_lat}',out_long = '${data.out_long}',out_addr = '${data.out_addr.split("'").join("\\'")}',clock_status = 'O',modified_by = '${data.modified_by}',modified_at = '${datetime}'`,
                  values = null,
                  whr = `emp_id = '${data.emp_id}' AND in_date_time = '${data.in_date_time}'`,
                  flag = 1;
                  var attendance_data_out = await db_Insert(table_name, fields, values, whr, flag);
                //   console.log(attendance_data_out,'dt');
                  
                  resolve({"suc" : 1, "msg": "Attendance data updated successfully", attendance_data_out});
                }catch(error){
                    reject({"suc": 0, "msg": "Error occurred during updated attendance details", details: error });
                }   
        });
    },
}