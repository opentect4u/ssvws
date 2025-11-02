const { db_Select } = require('../../../model/mysqlModel');

const express = require('express'),
audit_trialRouter = express.Router(),
dateFormat = require('dateformat');

audit_trialRouter.get("/fetch_employee_details", async (req, res) => {
  try{
      var data = req.query;

      var select = "emp_id,emp_name",
      table_name = "md_employee",
      whr = null,
      order = null;
      var employee_data = await db_Select(select,table_name,whr,order);

       // 🔹 Check if no data found
    if (!employee_data || employee_data.suc === 0 || employee_data.msg.length === 0) {
      return res.send({
        suc: 0,
        msg: "No employee details found",
      });
    }
     res.send(
     employee_data
    );
    }catch(err){
      console.error("Fetch employee details error:", err);
    res.send({
      error: err.message,
    });

    }
});

audit_trialRouter.post("/generate_audit_trial_report", async (req, res) => {
    try{
    var data = req.body

    // 🔹 Validation for dates
    if (!data.from_date || !data.to_date) {
      return res.send({
        suc: 2,
        msg: "Invalid request. Date range (form_date & to_date) is required.",
      });
    }

     // 🔹 Validation: emp_id required
    // if (!data.emp_id || !/^\d+$/.test(data.emp_id)) {
    //   return res.send({
    //     suc: 0,
    //     msg: "Invalid request. emp_id is required and must be numeric.",
    //   });
    // }
    
    var select = `a.emp_id,a.branch_code,a.operation_dt,
                  CASE 
        WHEN a.in_out_flag = 'O' THEN 'Logout'
        WHEN a.in_out_flag = 'I' THEN 'Login'
        ELSE a.in_out_flag
      END AS in_out_flag,
      CASE
      WHEN a.device_type = 'W' THEN 'Web'
      WHEN a.device_type = 'A' THEN 'App'
      ELSE a.device_type
      END AS device_type,
      b.emp_name,c.branch_name`,
    table_name = "td_log_details a LEFT JOIN md_employee b ON a.emp_id = b.emp_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code",
    whr = `date(a.operation_dt) BETWEEN '${data.from_date}' AND '${data.to_date}' ${data.branch_code != 'A' ? `AND a.branch_code = '${data.branch_code}'` : ''} ${data.emp_id != 'A' ? `AND a.emp_id = '${data.emp_id}'` : ''}`,
    order = `ORDER BY a.operation_dt DESC`;
    var generate_data = await db_Select(select,table_name,whr,order);

    // 🔹 Handle no results
    if (!generate_data || generate_data.suc === 0 || generate_data.msg.length === 0) {
      return res.send({
        suc: 1,
        // msg: "No audit records found for this employee.",
        msg: [],
      });
    }
    res.send(generate_data);
    }catch(err){
      console.error("Fetch employee details error:", err);
    res.send({
      error: err.message,
    });
    }
});

module.exports = {audit_trialRouter}