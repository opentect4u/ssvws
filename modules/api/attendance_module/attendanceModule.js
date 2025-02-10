var dateFormat = require("dateformat");
const { db_Insert, db_Select } = require("../../../model/mysqlModel");
module.exports = {

  //save in attendance
    save_attendance_in: (data) => {
        return new Promise(async (resolve, reject) => {
          // console.log(data);
          
            try {
                let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

                    var select = "start_time",
                    table_name = "md_check_in_out",
                    whr = null,
                    order = null;
                    var get_start_time = await db_Select(select,table_name,whr,order);
  
                    if(get_start_time.suc > 0 && get_start_time.msg.length > 0){
                       var start_time_dt = get_start_time.msg[0].start_time;
                      //  console.log(start_time_dt,'dt');


                      var clock_in_time = data.in_date_time.split(" ")[1];

                      var table_name = "td_emp_attendance",
                      fields = '(emp_id,entry_dt,in_date_time,in_lat,in_long,in_addr,late_in,created_by,created_at)',
                      values = `('${data.emp_id}','${datetime}','${data.in_date_time}','${data.in_lat}','${data.in_long}','${data.in_addr.split("'").join("\\'")}',${clock_in_time <= start_time_dt ? "NULL" : "'L'"},'${data.created_by}','${datetime}')`,
                      whr = null,
                      flag = 0;
                      var attendance_data = await db_Insert(table_name, fields, values, whr, flag);
                    }
                  //   console.log(attendance_data,'dt');
                    
                    resolve({"suc" : 1, "msg": "Attendance data saved successfully", attendance_data});
                
                  }catch(error){
                      reject({"suc": 0, "msg": "Error occurred during saving attendance details", details: error });
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
                  var get_time = await db_Select(select,table_name,whr,order);

                  if(get_time.suc > 0 && get_time.msg.length > 0){
                    var start_time_dt = get_time.msg[0].start_time;
                    var end_time_dt = get_time.msg[0].end_time
                    //  console.log(end_time_dt,'dts');

                    var clock_in_time = data.in_date_time.split(" ")[1]; 
                    var clock_out_time = data.out_date_time.split(" ")[1];

                    let late_status = "NULL";
                    if (clock_in_time > start_time_dt) {
                        late_status = clock_out_time >= end_time_dt ? "NULL" : "'L'";
                    }

                    var table_name = "td_emp_attendance",
                    fields = `out_date_time = '${data.out_date_time}',out_lat = '${data.out_lat}',out_long = '${data.out_long}',out_addr = '${data.out_addr.split("'").join("\\'")}',clock_status = 'O', late_in = ${late_status}, modified_by = '${data.modified_by}',modified_at = '${datetime}'`,
                    values = null,
                    whr = `emp_id = '${data.emp_id}' AND in_date_time = '${data.in_date_time}'`,
                    flag = 1;
                    var attendance_data_out = await db_Insert(table_name, fields, values, whr, flag);
                  }
                //   console.log(attendance_data_out,'dt');
                  
                  resolve({"suc" : 1, "msg": "Attendance data updated successfully", attendance_data_out});
                }catch(error){
                    reject({"suc": 0, "msg": "Error occurred during updated attendance details", details: error });
                }   
        });
    },
}