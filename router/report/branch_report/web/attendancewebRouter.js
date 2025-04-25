const { db_Select, db_Insert } = require('../../../../model/mysqlModel');

const express = require('express'),
attendancewebRouter = express.Router(),
dateFormat = require('dateformat');

//fetch employee name through branch id
attendancewebRouter.post("/fetch_employee_fr_branch", async (req, res) => {
    try{
        var data = req.body;
        //fetch employee name through branch_id
        if(data.branch_id == 'A'){
            var select = "emp_id,branch_id,emp_name",
            table_name = "md_employee",
            whr = null,
            order = null;
            var emp_dtls_web = await db_Select(select,table_name,whr,order);
            res.send(emp_dtls_web)
        }else {
            var select = "emp_id,branch_id,emp_name",
            table_name = "md_employee",
            whr = `branch_id = '${data.branch_id}'`,
            order = null;
            var emp_dtls_web = await db_Select(select,table_name,whr,order);
            res.send(emp_dtls_web)
        }
    } catch (error) {
        console.error("Error fetching employee details:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }    
});

//show a single employee , show no. of days present, total effective hours,no. of Late In & Early Out per branch
attendancewebRouter.post("/show_per_emp_detls_per_brn", async (req, res) => {
 try{
  var data = req.body;  

  var select = "COUNT(in_date_time)tot_present",
  table_name = "td_emp_attendance",
  whr = `emp_id = '${data.emp_id}' AND attan_status != 'R'`,
  order = null;
  var emp_details = await db_Select(select,table_name,whr,order);

  if(emp_details.suc > 0 && emp_details.msg.length > 0){

    var select = "emp_id, COUNT(*) tot_late_in",
    table_name = "td_emp_attendance",
    whr = `TIME(in_date_time) > (SELECT start_time FROM md_check_in_out) AND entry_dt BETWEEN '${data.from_date}' AND '${data.to_date}' AND emp_id = '${data.emp_id}'  AND attan_status != 'R'`,
    order = `GROUP BY emp_id`;
    var emp_details_late_in = await db_Select(select,table_name,whr,order);
    
    var select = "emp_id,COUNT(*) tot_early_out",
    table_name = "td_emp_attendance",
    whr = `TIME(out_date_time) < (SELECT end_time FROM md_check_in_out) AND clock_status = 'O' AND entry_dt BETWEEN '${data.from_date}' AND '${data.to_date}' AND emp_id = '${data.emp_id}'  AND attan_status != 'R'`,
    order = `GROUP BY emp_id`;
    var emp_details_late_out = await db_Select(select,table_name,whr,order);

    var select = "emp_id,SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(out_date_time, in_date_time)))) AS total_work_hours",
    table_name = "td_emp_attendance",
    whr = `entry_dt BETWEEN '${data.from_date}' AND '${data.to_date}' AND emp_id = '${data.emp_id}' AND clock_status = 'O'  AND attan_status != 'R'`,
    order = `GROUP BY emp_id`;
    var emp_details_tot_hoor = await db_Select(select,table_name,whr,order);

    emp_details.msg[0]['tot_work'] = emp_details_tot_hoor.suc > 0 ? (emp_details_tot_hoor.msg.length > 0 ? emp_details_tot_hoor.msg : []) : [];

    emp_details.msg[0]['late_in'] = emp_details_late_in.suc > 0 ? (emp_details_late_in.msg.length > 0 ? emp_details_late_in.msg : []) : [];

    emp_details.msg[0]['early_out'] = emp_details_late_out.suc > 0 ? (emp_details_late_out.msg.length > 0 ? emp_details_late_out.msg : []) : [];
  }

  res.send(emp_details)
 }catch (error) {
            console.error("Error fetching per employee details:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
});

//fetch attendance report through from and to date and branch id and emp name
attendancewebRouter.post("/attendance_report_brnwise", async (req, res) => {
    try{
    var data = req.body;

            var select = "a.entry_dt,b.branch_id,a.emp_id,b.emp_name,a.in_date_time,a.out_date_time,a.clock_status,a.late_in,a.in_addr,a.out_addr,a.attan_status,a.attn_reject_remarks",
            table_name = "td_emp_attendance a LEFT JOIN md_employee b ON a.emp_id = b.emp_id",
            whr = `date(a.in_date_time) BETWEEN '${data.from_date}' AND '${data.to_date}' ${data.branch_id != 'A' ? `AND b.branch_id = '${data.branch_id}'` : ''} ${data.emp_id != 'A' ? `AND a.emp_id = '${data.emp_id}'` : ''} AND a.attan_status != 'R'`,
            order = `ORDER BY a.entry_dt`;
            var atten_report = await db_Select(select,table_name,whr,order);

            res.send(atten_report)
         
        } catch (error) {
            console.error("Error fetching attendance report:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
});

//reject attendance through emp id
attendancewebRouter.post("/reject_atten_emp",async (req, res) => {
    try{
    var data = req.body;
    // console.log(data,'kog');
    
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var table_name = "td_emp_attendance",
    fields = `attan_status = 'R', attn_reject_remarks = '${data.attn_reject_remarks}', rejected_by = '${data.rejected_by}', rejected_at = '${datetime}'`,
    values = null,
    whr = `emp_id = '${data.emp_id}' AND in_date_time = '${data.in_date_time}'`,
    flag = 1;
    var reject_dtls = await db_Insert(table_name,fields,values,whr,flag);

    res.send(reject_dtls)
} catch (error) {
    console.error("Error deleting reject report:", error);
    res.send({ suc: 0, msg: "An error occurred" });
}
});

attendancewebRouter.post("/fetch_absent_list", async (req, res) => {
    try{
        var data = req.body;
        console.log(data);

        var select = `a.emp_id,b.emp_name,b.branch_id,c.branch_name`,
        table_name = `md_user a LEFT JOIN md_employee b ON a.emp_id = b.emp_id LEFT JOIN md_branch c ON b.branch_id = c.branch_code`,
        whr = `a.user_status = 'A' 
               AND a.emp_id NOT IN (
                                  SELECT emp_id 
                                  FROM td_emp_attendance 
                                  WHERE DATE(entry_dt) = '${data.to_date}')`,
        order = null;
        var absent_data = await db_Select(select,table_name,whr,order);
        res.send(absent_data)
    } catch (error) {
        console.error("Error fetching absent report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }    
});

module.exports = {attendancewebRouter}