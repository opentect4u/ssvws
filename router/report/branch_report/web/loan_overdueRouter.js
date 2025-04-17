const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_overdueRouter = express.Router(),
dateFormat = require ('dateformat');

// fetch branch name details based on user type
loan_overdueRouter.post("/fetch_usertypeWise_branch_name", async (req, res) => {
    try {
      var data = req.body;
    //   console.log(data, 'data');
  
      var select = "a.user_type, b.branch_assign_id, c.branch_name";
      table_name = "md_user a LEFT JOIN td_assign_branch_user b ON a.user_type = b.user_type LEFT JOIN md_branch c ON b.branch_assign_id = c.branch_code";
      whr = `a.emp_id = '${data.emp_id}' AND a.user_type = '${data.user_type}'`;
      order = null;
  
      // If user_type is 4, fetch all branches
      if (data.user_type == 4) {
        select = "branch_code AS branch_assign_id, branch_name";
        table_name = "md_branch";
        whr = `branch_code != '100'`; // This fetches all branches
      }
  
      var branch_dtls_users = await db_Select(select, table_name, whr, order);
      res.send(branch_dtls_users);
    } catch (error) {
      console.error("Error fetching branch name details based on user type:", error);
      res.send({ suc: 0, msg: "An error occurred" });
    }
  });

  //loan overdue report groupwise 17.04.2025
  loan_overdueRouter.post("/loan_overdue_report_groupwise", async (req, res) => {
    try {
        var data = req.body;
        let finalData = [];
        // console.log(data,'data');
        
        if (!data.search_brn_id ||  data.search_brn_id.length === 0) {
            return res.send({ suc: 0, msg: "No data found" });
          }

            for(let dt of data.search_brn_id){
            var select = "a.trf_date,a.od_date first_od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id code,e.emp_name co_id,b.recovery_day,b.disb_dt,a.disb_amt,b.instl_end_dt,b.period,b.period_mode,a.od_amt,SUM(a.outstanding) outstanding",
            table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
            whr = `a.branch_code IN (${dt.branch_code}) AND a.trf_date = (SELECT MAX(trf_date) FROM td_od_loan WHERE branch_code IN (${dt.branch_code}) AND trf_date <= '${data.send_date}')`,
            order = `GROUP BY a.trf_date,a.od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.recovery_day,b.disb_dt,a.disb_amt,b.instl_end_dt,b.period,b.period_mode,a.od_amt
            ORDER BY b.group_code`;
            var loan_overdue_dtls = await db_Select(select, table_name, whr, order);

            finalData.push(...loan_overdue_dtls.msg)
        }
        res.send({suc : 1, msg: finalData});
    }catch(error){
        console.error("Error fetching loan overdue report groupwise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
  });

    //loan overdue report fundwise 17.04.2025
    loan_overdueRouter.post("/loan_overdue_report_fundwise", async (req, res) => {
        try {
            var data = req.body;
            let finalData = [];
            // console.log(data,'data');
            
            if (!data.search_brn_id ||  data.search_brn_id.length === 0) {
                return res.send({ suc: 0, msg: "No data found" });
              }

            for(let dt of data.search_brn_id){
           var select = "a.trf_date,a.od_date first_od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id code,e.emp_name co_id,b.fund_id,f.fund_name,b.recovery_day,b.disb_dt,a.disb_amt,b.instl_end_dt,b.period,b.period_mode,a.od_amt,SUM(a.outstanding) outstanding",
          table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_fund f ON b.fund_id = f.fund_id",
          whr = `a.branch_code IN (${dt.branch_code}) AND a.trf_date = (SELECT MAX(trf_date) FROM td_od_loan
                                                                           WHERE branch_code IN (${dt.branch_code})
                                                                           AND trf_date <= '${data.send_date}') AND b.fund_id = '${data.fund_id}'`,
          order = `GROUP BY a.trf_date,a.od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.fund_id,f.fund_name,b.recovery_day,b.disb_dt,a.disb_amt,b.instl_end_dt,b.period,b.period_mode,a.od_amt
          ORDER BY b.group_code`;
          var loan_overdue_dtls_fundwise = await db_Select(select, table_name, whr, order);
          finalData.push(...loan_overdue_dtls_fundwise.msg)
        }
        res.send({suc : 1, msg: finalData});
        }catch(error){
            console.error("Error fetching loan overdue report fundwisewise:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
      });


      //loan overdue report COwise 17.04.2025
      loan_overdueRouter.post("/loan_overdue_report_cowise", async (req, res) => {
        try {
            var data = req.body;
            let finalData = [];
            // console.log(data,'data');
            
            if (!data.search_brn_id ||  data.search_brn_id.length === 0) {
                return res.send({ suc: 0, msg: "No data found" });
              }

              for(let dt of data.search_brn_id){
           var select = "a.trf_date,a.od_date first_od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id code,e.emp_name co_id,b.recovery_day,b.disb_dt,a.disb_amt,b.instl_end_dt,b.period,b.period_mode,a.od_amt,SUM(a.outstanding) outstanding",
          table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
          whr = `a.branch_code IN (${dt.branch_code}) AND a.trf_date = (SELECT MAX(trf_date) FROM td_od_loan
                                                                           WHERE branch_code IN (${dt.branch_code})
                                                                           AND trf_date <= '${data.send_date}') AND d.co_id IN (${data.co_id})`,
          order = `GROUP BY a.trf_date,a.od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.recovery_day,b.disb_dt,a.disb_amt,b.instl_end_dt,b.period,b.period_mode,a.od_amt
          ORDER BY b.group_code`;
          var loan_overdue_dtls_cowise = await db_Select(select, table_name, whr, order);
          finalData.push(...loan_overdue_dtls_cowise.msg)
        }
        res.send({suc : 1, msg: finalData});
        }catch(error){
            console.error("Error fetching loan overdue report cowise:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
      });   

      //loan overdue report memberwise 17.04.2025
      loan_overdueRouter.post("/loan_overdue_report_memberwise", async (req, res) => {
        try {
            var data = req.body;
            let finalData = [];
            // console.log(data,'data');
            
            if (!data.search_brn_id ||  data.search_brn_id.length === 0) {
                return res.send({ suc: 0, msg: "No data found" });
              }

            for(let dt of data.search_brn_id){
           var select = "a.trf_date,a.od_date first_od_date,a.loan_id,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id code,e.emp_name co_id,b.recovery_day,b.disb_dt,a.disb_amt,b.instl_end_dt,b.period,b.period_mode,a.od_amt,a.outstanding",
          table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
          whr = `a.branch_code IN (${dt.branch_code}) AND a.trf_date = (SELECT MAX(trf_date) FROM td_od_loan
                                                                           WHERE branch_code IN (${dt.branch_code})
                                                                           AND trf_date <= '${data.send_date}')`,
          order = `ORDER BY a.loan_id`;
          var loan_overdue_dtls_memberwise = await db_Select(select, table_name, whr, order);
          finalData.push(...loan_overdue_dtls_memberwise.msg)
        }
        res.send({suc : 1, msg: finalData});
        }catch(error){
            console.error("Error fetching loan overdue report memberwise:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
      });  

       //loan overdue report branchwise 17.04.2025
       loan_overdueRouter.post("/loan_overdue_report_branchwise", async (req, res) => {
        try {
            var data = req.body;
            let finalData = [];
            // console.log(data,'data');
            
            if (!data.search_brn_id ||  data.search_brn_id.length === 0) {
                return res.send({ suc: 0, msg: "No data found" });
              }

              for(let dt of data.search_brn_id){
           var select = "a.branch_code,c.branch_name,SUM(a.disb_amt) disb_amt,SUM(a.od_amt) od_amt,SUM(a.outstanding) outstanding",
          table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code",
          whr = `a.branch_code IN (${dt.branch_code}) AND a.trf_date = (SELECT MAX(trf_date) FROM td_od_loan
                                                                           WHERE branch_code IN (${dt.branch_code})
                                                                           AND trf_date <= '${data.send_date}')`,
          order = `GROUP BY a.branch_code,c.branch_name`;
          var loan_overdue_dtls_branchwise = await db_Select(select, table_name, whr, order);
          finalData.push(...loan_overdue_dtls_branchwise.msg)
        }
        res.send({suc : 1, msg: finalData});
        }catch(error){
            console.error("Error fetching loan overdue report branchwise:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
      });  

module.exports = {loan_overdueRouter}