const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_summaryAdminRouter = express.Router(),
dateFormat = require('dateformat');

loan_summaryAdminRouter.post ("/loan_summary_report_fundwise_admin", async (req, res) => {
    try{
           var data = req.body;

          //LOAN SUMMARY REPORT FUNDWISE

        //   if(data.branch_code == 'A'){
        //      var select = "a.fund_id,c.fund_name,sum(b.debit) tot_debit,sum(b.credit) tot_credit,sum(a.outstanding) tot_outstanding",
        //      table_name = "td_loan a,td_loan_transactions b, md_fund c",
        //      whr = `a.loan_id = b.loan_id 
        //            AND a.fund_id = c.fund_id
        //            AND b.tr_type IN ('D','R')
        //            AND date(b.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'`
        //      order = `GROUP BY a.fund_id,c.fund_name`;
        //      var fund_dt = await db_Select(select,table_name,whr,order);
    
        //      res.send(fund_dt)
        //     }else {
              var select = "a.fund_id,c.fund_name,sum(b.debit) tot_debit,sum(b.credit) tot_credit,sum(a.outstanding) tot_outstanding",
              table_name = "td_loan a,td_loan_transactions b, md_fund c",
              whr = `a.loan_id = b.loan_id 
                     AND a.fund_id = c.fund_id
                     AND b.tr_type IN ('D','R')
                     AND a.branch_code = '${data.branch_code}'
                     AND date(b.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'`
              order = `GROUP BY a.fund_id,c.fund_name`;
              var fund_dt = await db_Select(select,table_name,whr,order);
    
               res.send(fund_dt)
            // }
        } catch (error) {
            console.error("Error fetching loan summary report:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
});

loan_summaryAdminRouter.post ("/loan_summary_report_schemewise_admin", async (req, res) => {
    try{
          var data = req.body;

          //LOAN SUMMARY REPORT SCHEMEWISE
          
        //   if(data.branch_code == 'A'){
        //      var select = "a.scheme_id,c.scheme_name,sum(b.debit) tot_debit,sum(b.credit) tot_credit,sum(a.outstanding) tot_outstanding",
        //      table_name = "td_loan a,td_loan_transactions b, md_scheme c",
        //      whr = `a.loan_id = b.loan_id 
        //             AND a.scheme_id = c.scheme_id
        //             AND b.tr_type IN ('D','R')
        //             AND date(b.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'`
        //      order = `GROUP BY a.scheme_id,c.scheme_name`;
        //      var scheme_dt = await db_Select(select,table_name,whr,order);

        //      res.send(scheme_dt)
        //    }else {

             var select = "a.scheme_id,c.scheme_name,sum(b.debit) tot_debit,sum(b.credit) tot_credit,sum(a.outstanding) tot_outstanding",
             table_name = "td_loan a,td_loan_transactions b, md_scheme c",
             whr = `a.loan_id = b.loan_id 
                    AND a.scheme_id = c.scheme_id
                    AND b.tr_type IN ('D','R')
                    AND a.branch_code = '${data.branch_code}'
                    AND date(b.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'`
             order = `GROUP BY a.scheme_id,c.scheme_name`;
             var scheme_dt = await db_Select(select,table_name,whr,order);

             res.send(scheme_dt)
            // }
        } catch (error) {
            console.error("Error fetching loan summary report:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
});

module.exports = {loan_summaryAdminRouter}