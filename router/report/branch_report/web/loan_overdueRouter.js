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
      whr = `a.emp_id = '${data.emp_id}' AND a.user_type = '${data.user_type}' AND c.brn_status = 'O'`;
      order = null;
  
      // If user_type is 4, fetch all branches
      if (data.user_type == 4) {
        select = "branch_code AS branch_assign_id, branch_name";
        table_name = "md_branch";
        whr = `branch_code != '100' AND brn_status = 'O'`; // This fetches all branches
      }
  
      var branch_dtls_users = await db_Select(select, table_name, whr, order);
      res.send(branch_dtls_users);
    } catch (error) {
      console.error("Error fetching branch name details based on user type:", error);
      res.send({ suc: 0, msg: "An error occurred" });
    }
  });

  //loan overdue report groupwise 17.04.2025
  //loan overdue report groupwise 22.05.2025 latest
  loan_overdueRouter.post("/loan_overdue_report_groupwise", async (req, res) => {
    try {
        var data = req.body;
        let finalData = [];
        // console.log(data,'data');
        
        
        if (!data.search_brn_id ||  data.search_brn_id.length === 0) {
            return res.send({ suc: 0, msg: "No data found" });
          }

            for(let dt of data.search_brn_id){
            var select = `a.trf_date,MIN(a.od_date) first_od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.acc_no1,d.acc_no2,f.branch_name bank_addr,b.period,b.period_mode,
            CASE 
           WHEN b.period_mode = 'Monthly' THEN b.recovery_day
           WHEN b.period_mode = 'Weekly' THEN 
           CASE b.recovery_day
           WHEN 1 THEN 'Sunday'
           WHEN 2 THEN 'Monday'
           WHEN 3 THEN 'Tuesday'
           WHEN 4 THEN 'Wednesday'
           WHEN 5 THEN 'Thursday'
           WHEN 6 THEN 'Friday'
           WHEN 7 THEN 'Saturday'
           ELSE 'Unknown'
           END
           ELSE 'N/A'
           END AS recovery_day,d.co_id code,e.emp_name co_name,SUM(a.disb_amt)loan_amt,b.instl_end_dt,SUM(b.prn_amt)outstanding_principal,SUM(b.intt_amt)outstanding_interest,SUM(a.outstanding) total_outstanding,SUM(a.od_amt) overdue`,
            table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_bank f ON d.bank_name = f.bank_code",
            whr = `a.branch_code IN (${dt.branch_code}) AND a.trf_date = (SELECT MAX(trf_date) FROM td_od_loan WHERE branch_code IN (${dt.branch_code}) AND trf_date <= '${data.send_date}')`,
            order = `GROUP BY a.trf_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.acc_no1,d.acc_no2,f.branch_name,d.co_id,e.emp_name,b.recovery_day,b.disb_dt,b.instl_end_dt,b.period,b.period_mode
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
           var select = `a.trf_date,a.od_date first_od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id code,e.emp_name co_name,b.fund_id,f.fund_name,b.period,b.period_mode,
           CASE 
           WHEN b.period_mode = 'Monthly' THEN b.recovery_day
           WHEN b.period_mode = 'Weekly' THEN 
           CASE b.recovery_day
           WHEN 1 THEN 'Sunday'
           WHEN 2 THEN 'Monday'
           WHEN 3 THEN 'Tuesday'
           WHEN 4 THEN 'Wednesday'
           WHEN 5 THEN 'Thursday'
           WHEN 6 THEN 'Friday'
           WHEN 7 THEN 'Saturday'
           ELSE 'Unknown'
           END
           ELSE 'N/A'
           END AS recovery_day,SUM(a.disb_amt)loan_amt,b.instl_end_dt,SUM(b.prn_amt) outstanding_principal,SUM(b.intt_amt) outstanding_interest,SUM(a.outstanding) total_outstanding,SUM(a.od_amt)overdue`,
          table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_fund f ON b.fund_id = f.fund_id",
          whr = `a.branch_code IN (${dt.branch_code}) AND a.trf_date = (SELECT MAX(trf_date) FROM td_od_loan
                                                                           WHERE branch_code IN (${dt.branch_code})
                                                                           AND trf_date <= '${data.send_date}') AND b.fund_id IN (${data.fund_id})`,
          order = `GROUP BY a.trf_date,a.od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.fund_id,f.fund_name,b.recovery_day,b.disb_dt,b.instl_end_dt,b.period,b.period_mode
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
           var select = `a.trf_date,a.od_date first_od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id code,e.emp_name co_name,b.period,b.period_mode, 
           CASE 
           WHEN b.period_mode = 'Monthly' THEN b.recovery_day
           WHEN b.period_mode = 'Weekly' THEN 
           CASE b.recovery_day
           WHEN 1 THEN 'Sunday'
           WHEN 2 THEN 'Monday'
           WHEN 3 THEN 'Tuesday'
           WHEN 4 THEN 'Wednesday'
           WHEN 5 THEN 'Thursday'
           WHEN 6 THEN 'Friday'
           WHEN 7 THEN 'Saturday'
           ELSE 'Unknown'
           END
           ELSE 'N/A'
           END AS recovery_day,SUM(a.disb_amt)loan_amt,b.instl_end_dt,SUM(b.prn_amt) outstanding_principal,SUM(b.intt_amt)outstanding_interest,SUM(a.outstanding) total_outstanding,SUM(a.od_amt) overdue`,
          table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
          whr = `a.branch_code IN (${dt.branch_code}) AND a.trf_date = (SELECT MAX(trf_date) FROM td_od_loan
                                                                           WHERE branch_code IN (${dt.branch_code})
                                                                           AND trf_date <= '${data.send_date}') AND d.co_id IN (${data.co_id})`,
          order = `GROUP BY a.trf_date,a.od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.recovery_day,b.instl_end_dt,b.period,b.period_mode
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
  //loan overdue report groupwise 22.05.2025 latest

      loan_overdueRouter.post("/loan_overdue_report_memberwise", async (req, res) => {
        try {
            var data = req.body;
            let finalData = [];
            // console.log(data,'data');
            
            if (!data.search_brn_id ||  data.search_brn_id.length === 0) {
                return res.send({ suc: 0, msg: "No data found" });
              }

            for(let dt of data.search_brn_id){
           var select = `a.trf_date,a.od_date first_od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.acc_no1,d.acc_no2,h.branch_name bank_address,b.period,b.period_mode,
           CASE 
           WHEN b.period_mode = 'Monthly' THEN b.recovery_day
           WHEN b.period_mode = 'Weekly' THEN 
           CASE b.recovery_day
           WHEN 1 THEN 'Sunday'
           WHEN 2 THEN 'Monday'
           WHEN 3 THEN 'Tuesday'
           WHEN 4 THEN 'Wednesday'
           WHEN 5 THEN 'Thursday'
           WHEN 6 THEN 'Friday'
           WHEN 7 THEN 'Saturday'
           ELSE 'Unknown'
           END
           ELSE 'N/A'
           END AS recovery_day,b.member_code,f.client_name,f.client_mobile,f.gurd_name,d.co_id code,e.emp_name co_name,g.scheme_name,a.loan_id,b.disb_dt loan_date,a.disb_amt loan_amt,b.instl_end_dt,b.prn_amt outstanding_principal,b.intt_amt outstanding_interest,a.outstanding total_outstanding,a.od_amt overdue,b.last_trn_dt last_payment,DATEDIFF(CURDATE(), a.od_date) AS od_days`,
          table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_member f ON b.member_code = f.member_code LEFT JOIN md_scheme g ON b.scheme_id = g.scheme_id LEFT JOIN md_bank h ON d.bank_name = h.bank_code",
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
           var select = "a.branch_code,c.branch_name,SUM(a.disb_amt) loan_amt,SUM(b.prn_amt) outstanding_principal,SUM(b.intt_amt) outstanding_interest,SUM(a.outstanding) total_outstanding,SUM(a.od_amt) overdue",
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

      //loan overdue report groupwise via day
      
      loan_overdueRouter.post("/filter_daywise_overdue_report_groupwise", async (req, res) => {
           try {
        var data = req.body;
        let finalData = [];
        // console.log(data,'gt');

        // console.log(data,'data');
        
        if (!data.search_brn_id ||  data.search_brn_id.length === 0) {
            return res.send({ suc: 0, msg: [] });
          }

            for(let dt of data.search_brn_id){
              const branchCodes = Array.isArray(dt.branch_code) ? dt.branch_code : [dt.branch_code];
              const branchCodeStr = branchCodes.map(b => `'${b}'`).join(',');

            var select = `a.trf_date,MIN(a.od_date) first_od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.acc_no1,d.acc_no2,d.branch_name bank_addr,b.period,b.period_mode,
            CASE 
           WHEN b.period_mode = 'Monthly' THEN b.recovery_day
           WHEN b.period_mode = 'Weekly' THEN 
           CASE b.recovery_day
           WHEN 1 THEN 'Sunday'
           WHEN 2 THEN 'Monday'
           WHEN 3 THEN 'Tuesday'
           WHEN 4 THEN 'Wednesday'
           WHEN 5 THEN 'Thursday'
           WHEN 6 THEN 'Friday'
           WHEN 7 THEN 'Saturday'
           ELSE 'Unknown'
           END
           ELSE 'N/A'
           END AS recovery_day,d.co_id code,e.emp_name co_name,SUM(a.disb_amt)loan_amt,b.instl_end_dt,SUM(b.prn_amt)outstanding_principal,SUM(b.intt_amt)outstanding_interest,SUM(a.outstanding) total_outstanding,SUM(a.od_amt) overdue`,
            table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
            whr = `a.branch_code IN (${branchCodeStr}) 
            AND b.period_mode = '${data.period_mode}' 
            AND b.recovery_day BETWEEN ${data.from_day} AND ${data.to_day}
            AND a.trf_date = (
            SELECT MAX(trf_date) 
            FROM td_od_loan 
            WHERE branch_code IN (${branchCodeStr}) 
            AND trf_date <= '${data.send_date}')`,
            order = `GROUP BY a.trf_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.acc_no1,d.acc_no2,d.branch_name,d.co_id,e.emp_name,b.recovery_day,b.disb_dt,b.instl_end_dt,b.period,b.period_mode
            ORDER BY b.group_code`;
            var loan_overdue_dtls_group = await db_Select(select, table_name, whr, order);

            finalData.push(...loan_overdue_dtls_group.msg)
        }
        res.send({suc : 1, msg: finalData});
    }catch(error){
        console.error("Error fetching loan overdue report groupwise day:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
      });


      //loan demand report fundwise via day
      
      loan_overdueRouter.post("/filter_daywise_overdue_report_fundwise", async (req, res) => {
          try {
            var data = req.body;
            let finalData = [];
            console.log(data,'data');
            
            if (!data.search_brn_id ||  data.search_brn_id.length === 0) {
                return res.send({ suc: 0, msg: [] });
              }

            for(let dt of data.search_brn_id){
              const branchCodes = Array.isArray(dt.branch_code) ? dt.branch_code : [dt.branch_code];
              const branchCodeStr = branchCodes.map(b => `'${b}'`).join(',');

           var select = `a.trf_date,a.od_date first_od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id code,e.emp_name co_name,b.fund_id,f.fund_name,b.period,b.period_mode,
           CASE 
           WHEN b.period_mode = 'Monthly' THEN b.recovery_day
           WHEN b.period_mode = 'Weekly' THEN 
           CASE b.recovery_day
           WHEN 1 THEN 'Sunday'
           WHEN 2 THEN 'Monday'
           WHEN 3 THEN 'Tuesday'
           WHEN 4 THEN 'Wednesday'
           WHEN 5 THEN 'Thursday'
           WHEN 6 THEN 'Friday'
           WHEN 7 THEN 'Saturday'
           ELSE 'Unknown'
           END
           ELSE 'N/A'
           END AS recovery_day,SUM(a.disb_amt)loan_amt,b.instl_end_dt,SUM(b.prn_amt) outstanding_principal,SUM(b.intt_amt) outstanding_interest,SUM(a.outstanding) total_outstanding,SUM(a.od_amt)overdue`,
          table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_fund f ON b.fund_id = f.fund_id",
          whr = `a.branch_code IN (${branchCodeStr}) 
                 AND a.trf_date = (SELECT MAX(trf_date) FROM td_od_loan
                 WHERE branch_code IN (${branchCodeStr})
                 AND trf_date <= '${data.send_date}') AND b.fund_id IN (${data.fund_id}) AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN ${data.from_day} AND ${data.to_day}`,
          order = `GROUP BY a.trf_date,a.od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.fund_id,f.fund_name,b.recovery_day,b.disb_dt,b.instl_end_dt,b.period,b.period_mode
          ORDER BY b.group_code`;
          var loan_overdue_dtls_fundwise_day = await db_Select(select, table_name, whr, order);
          finalData.push(...loan_overdue_dtls_fundwise_day.msg)
        }
        res.send({suc : 1, msg: finalData});
        }catch(error){
            console.error("Error fetching loan overdue report fundwisewise day:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
      });
      
      // loan demand report cowise via day
      
      loan_overdueRouter.post("/filter_dayawise_overdue_report_cowise", async (req, res) => {
         try {
            var data = req.body;
            let finalData = [];
            // console.log(data,'data');
            
            if (!data.search_brn_id ||  data.search_brn_id.length === 0) {
                return res.send({ suc: 0, msg: [] });
              }

              for(let dt of data.search_brn_id){
                const branchCodes = Array.isArray(dt.branch_code) ? dt.branch_code : [dt.branch_code];
                const branchCodeStr = branchCodes.map(b => `'${b}'`).join(',');

           var select = `a.trf_date,a.od_date first_od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id code,e.emp_name co_name,b.period,b.period_mode, 
           CASE 
           WHEN b.period_mode = 'Monthly' THEN b.recovery_day
           WHEN b.period_mode = 'Weekly' THEN 
           CASE b.recovery_day
           WHEN 1 THEN 'Sunday'
           WHEN 2 THEN 'Monday'
           WHEN 3 THEN 'Tuesday'
           WHEN 4 THEN 'Wednesday'
           WHEN 5 THEN 'Thursday'
           WHEN 6 THEN 'Friday'
           WHEN 7 THEN 'Saturday'
           ELSE 'Unknown'
           END
           ELSE 'N/A'
           END AS recovery_day,SUM(a.disb_amt)loan_amt,b.instl_end_dt,SUM(b.prn_amt) outstanding_principal,SUM(b.intt_amt)outstanding_interest,SUM(a.outstanding) total_outstanding,SUM(a.od_amt) overdue`,
          table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id",
          whr = `a.branch_code IN (${branchCodeStr}) AND a.trf_date = (SELECT MAX(trf_date) FROM td_od_loan
                                                                           WHERE branch_code IN (${branchCodeStr})
                                                                           AND trf_date <= '${data.send_date}') AND d.co_id IN (${data.co_id}) AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN ${data.from_day} AND ${data.to_day}`,
          order = `GROUP BY a.trf_date,a.od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.co_id,e.emp_name,b.recovery_day,b.instl_end_dt,b.period,b.period_mode
          ORDER BY b.group_code`;
          var loan_overdue_dtls_cowise_day = await db_Select(select, table_name, whr, order);
          finalData.push(...loan_overdue_dtls_cowise_day.msg)
        }
        res.send({suc : 1, msg: finalData});
        }catch(error){
            console.error("Error fetching loan overdue report cowise:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
      });
      
      // loan demand report memberwise via day
      loan_overdueRouter.post("/filter_dayawise_overdue_report_membwise", async (req, res) => {
         try {
            var data = req.body;
            let finalData = [];
            // console.log(data,'data');
            
            if (!data.search_brn_id ||  data.search_brn_id.length === 0) {
                return res.send({ suc: 0, msg: [] });
              }

            for(let dt of data.search_brn_id){
               const branchCodes = Array.isArray(dt.branch_code) ? dt.branch_code : [dt.branch_code];
               const branchCodeStr = branchCodes.map(b => `'${b}'`).join(',');

           var select = `a.trf_date,a.od_date first_od_date,a.branch_code,c.branch_name,b.group_code,d.group_name,d.acc_no1,d.acc_no2,d.branch_name bank_address,b.period,b.period_mode,
           CASE 
           WHEN b.period_mode = 'Monthly' THEN b.recovery_day
           WHEN b.period_mode = 'Weekly' THEN 
           CASE b.recovery_day
           WHEN 1 THEN 'Sunday'
           WHEN 2 THEN 'Monday'
           WHEN 3 THEN 'Tuesday'
           WHEN 4 THEN 'Wednesday'
           WHEN 5 THEN 'Thursday'
           WHEN 6 THEN 'Friday'
           WHEN 7 THEN 'Saturday'
           ELSE 'Unknown'
           END
           ELSE 'N/A'
           END AS recovery_day,b.member_code,f.client_name,f.client_mobile,f.gurd_name,d.co_id code,e.emp_name co_name,g.scheme_name,a.loan_id,b.disb_dt loan_date,a.disb_amt loan_amt,b.instl_end_dt,b.prn_amt outstanding_principal,b.intt_amt outstanding_interest,a.outstanding total_outstanding,a.od_amt overdue,b.last_trn_dt last_payment,DATEDIFF(CURDATE(), a.od_date) AS od_days`,
          table_name = "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_member f ON b.member_code = f.member_code LEFT JOIN md_scheme g ON b.scheme_id = g.scheme_id",
           whr = `a.branch_code IN (${branchCodeStr}) AND a.trf_date = (SELECT MAX(trf_date) FROM td_od_loan
                                                                           WHERE branch_code IN (${branchCodeStr})
                                                                           AND trf_date <= '${data.send_date}') AND b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN ${data.from_day} AND ${data.to_day}`,
          order = `ORDER BY a.loan_id`;
          var loan_overdue_dtls_memberwise_day = await db_Select(select, table_name, whr, order);
          finalData.push(...loan_overdue_dtls_memberwise_day.msg)
        }
        res.send({suc : 1, msg: finalData});
        }catch(error){
            console.error("Error fetching loan overdue report memberwise:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
      });

module.exports = {loan_overdueRouter}