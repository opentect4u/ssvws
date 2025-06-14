const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_transAdminRouter = express.Router(),
dateFormat = require('dateformat');

//TRANSACTION REPORT (DISBURSEMENT)
loan_transAdminRouter.post("/disb_loan_trans_report_admin", async (req, res) => {
    var data = req.body;

    //   if(data.branch_code == 'A'){

    //       if(data.flag == 'M'){
    //           var select = "c.payment_date,a.group_code,d.group_name,a.branch_code,a.member_code,b.client_name,a.loan_id,b.client_mobile,b.gurd_name,b.client_addr,b.aadhar_no,b.pan_no,b.acc_no,e.purpose_id,f.sub_purp_name,g.scheme_name,h.fund_name,a.applied_dt,a.applied_amt,a.disb_dt,a.intt_cal_amt intt_payable,a.prn_disb_amt,a.curr_roi,a.period_mode,a.instl_end_dt,(a.prn_amt + a.od_prn_amt)prn_amt,a.intt_amt,a.outstanding,c.created_by collector_code,i.emp_name collec_name,c.created_at,c.approved_by approve_code,i.emp_name approved_by,c.approved_at,j.branch_name",
    //           table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN td_loan_transactions c ON a.loan_id = c.loan_id LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_purpose e ON a.purpose = e.purp_id LEFT JOIN md_sub_purpose f ON a.sub_purpose = f.sub_purp_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_fund h ON a.fund_id = h.fund_id LEFT JOIN md_employee i ON c.created_by = i.emp_id AND c.approved_by = i.emp_id LEFT JOIN md_branch j ON a.branch_code = j.branch_code",
    //           whr = `date(c.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND c.tr_type = '${data.tr_type}'`,
    //           order = `ORDER BY c.payment_date`;
    //           var disb_loan_dt = await db_Select(select,table_name,whr,order);
      
    //           res.send(disb_loan_dt);
    //     } else {

    //           var select = "c.payment_date,a.group_code,d.group_name,a.branch_code, e.purpose_id,f.sub_purp_name,g.scheme_name,h.fund_name,a.applied_dt,sum(a.applied_amt)applied_amt,a.disb_dt,sum(a.intt_cal_amt)intt_payable,sum(a.prn_disb_amt)prn_disb_amt,a.curr_roi,a.period_mode,a.instl_end_dt,(sum(a.prn_amt) + sum(a.od_prn_amt))prn_amt,sum(a.intt_amt)intt_amt,sum(a.outstanding)outstanding,c.created_by collector_code,i.emp_name collec_name,c.approved_by approve_code,i.emp_name approved_by,j.branch_name",
    //           table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN td_loan_transactions c ON a.loan_id = c.loan_id LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_purpose e ON a.purpose = e.purp_id LEFT JOIN md_sub_purpose f ON a.sub_purpose = f.sub_purp_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_fund h ON a.fund_id = h.fund_id LEFT JOIN md_employee i ON c.created_by = i.emp_id AND c.approved_by = i.emp_id LEFT JOIN md_branch j ON a.branch_code = j.branch_code",
    //           whr = `date(c.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND c.tr_type = '${data.tr_type}'`,
    //           order = `GROUP BY c.payment_date,a.group_code,d.group_name,a.branch_code,e.purpose_id,f.sub_purp_name,g.scheme_name,h.fund_name,a.applied_dt, a.disb_dt,a.curr_roi,a.period_mode,a.instl_end_dt,c.created_by, i.emp_name,c.approved_by,j.branch_name
    //            ORDER BY c.payment_date`;
    //           var disb_loan_dt = await db_Select(select,table_name,whr,order);
    
    //     res.send(disb_loan_dt);
    //   }
    // }else {

      if(data.flag == 'M'){
        var select = "c.payment_date,a.group_code,d.group_name,a.branch_code,a.member_code,b.client_name,a.loan_id,b.client_mobile,b.gurd_name,b.client_addr,b.aadhar_no,b.pan_no,b.acc_no,CONCAT(e.sub_purpose,'-',e.purpose_id)purpose_id,f.sub_purp_name,g.scheme_name,h.fund_name,a.applied_dt,a.applied_amt,a.disb_dt,a.intt_cal_amt intt_payable,a.prn_disb_amt,a.curr_roi,a.period_mode,a.instl_end_dt,(a.prn_amt + a.od_prn_amt)prn_amt,a.intt_amt,a.outstanding,c.created_by collector_code,i.emp_name collec_name,c.created_at,c.approved_by approve_code,i.emp_name approved_by,c.approved_at,j.branch_name",
        table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN td_loan_transactions c ON a.loan_id = c.loan_id LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_purpose e ON a.purpose = e.purp_id LEFT JOIN md_sub_purpose f ON a.sub_purpose = f.sub_purp_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_fund h ON a.fund_id = h.fund_id LEFT JOIN md_employee i ON c.created_by = i.emp_id AND c.approved_by = i.emp_id LEFT JOIN md_branch j ON a.branch_code = j.branch_code",
        whr = `a.branch_code = '${data.branch_code}' AND date(c.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND c.tr_type = '${data.tr_type}'`,
        order = `ORDER BY c.payment_date`;
        var disb_loan_dt = await db_Select(select,table_name,whr,order);
    
        res.send(disb_loan_dt);
    } else {

      var select = "c.payment_date,a.group_code,d.group_name,a.branch_code, CONCAT(e.sub_purpose,'-',e.purpose_id)purpose_id,f.sub_purp_name,g.scheme_name,h.fund_name,a.applied_dt,sum(a.applied_amt)applied_amt,a.disb_dt,sum(a.intt_cal_amt)intt_payable,sum(a.prn_disb_amt)prn_disb_amt,a.curr_roi,a.period_mode,a.instl_end_dt,(sum(a.prn_amt) + sum(a.od_prn_amt))prn_amt,sum(a.intt_amt)intt_amt,sum(a.outstanding)outstanding,c.created_by collector_code,i.emp_name collec_name,c.approved_by approve_code,i.emp_name approved_by,j.branch_name",
      table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN td_loan_transactions c ON a.loan_id = c.loan_id LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_purpose e ON a.purpose = e.purp_id LEFT JOIN md_sub_purpose f ON a.sub_purpose = f.sub_purp_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_fund h ON a.fund_id = h.fund_id LEFT JOIN md_employee i ON c.created_by = i.emp_id AND c.approved_by = i.emp_id LEFT JOIN md_branch j ON a.branch_code = j.branch_code",
      whr = `a.branch_code = '${data.branch_code}' AND date(c.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND c.tr_type = '${data.tr_type}'`,
      order = `GROUP BY c.payment_date,a.group_code,d.group_name,a.branch_code,e.purpose_id,f.sub_purp_name,g. scheme_name,h.fund_name,a.applied_dt, a.disb_dt,a.curr_roi,a.period_mode,a.instl_end_dt,c.   created_by, i.emp_name,c.approved_by,j.branch_name
       ORDER BY c.payment_date`;
      var disb_loan_dt = await db_Select(select,table_name,whr,order);
  
      res.send(disb_loan_dt);
    // }

    }
});

//TRANSACTION REPORT (RECOVERY)
loan_transAdminRouter.post("/recov_loan_trans_report_admin", async (req, res) => {
    var data = req.body;

      // if(data.branch_code == 'A'){

      //   if(data.flag == 'M'){

      //     var select = "a.payment_date,a.payment_id,b.group_code,c.group_name,a.branch_id,b.member_code,d.client_name,b.loan_id,a.particulars,a.credit,(a.balance + a.od_balance + a.intt_balance)balance,a.tr_mode,e.scheme_name,a.bank_name,a.cheque_id,a.trn_addr,a.created_by collector_code,f.emp_name collec_name,a.created_at,a.approved_by,a.approved_at,g.branch_name",
      //     table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_member d ON b.member_code = d.member_code LEFT JOIN md_scheme e ON b.scheme_id = e.scheme_id LEFT JOIN md_employee f ON a.created_by = f.emp_id LEFT JOIN md_branch g ON a.branch_id = g.branch_code",
      //     whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
      //     order = `ORDER BY a.payment_date,c.group_name`;
      //     var member_dt = await db_Select(select,table_name,whr,order);
      
      //     res.send(member_dt);
      //     } else {
    
      //       var select = "a.payment_date,a.branch_id,b.group_code,c.group_name,a.particulars,sum(a.credit)credit,(sum(a.balance) + sum(a.od_balance) + sum(a.intt_balance))balance,a.tr_mode,e.scheme_name,a.bank_name,a.created_by collector_code,f.emp_name collec_name,a.created_at,a.approved_by,g.branch_name",
      //       table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_member d ON b.member_code = d.member_code LEFT JOIN md_scheme e ON b.scheme_id = e.scheme_id LEFT JOIN md_employee f ON a.created_by = f.emp_id LEFT JOIN md_branch g ON a.branch_id = g.branch_code",
      //       whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
      //       order = `GROUP BY a.payment_date,a.branch_id,b.group_code,c.group_name,a.particulars,a.tr_mode,e.scheme_name,a.bank_name,a.created_by,f.emp_name,a.created_at,a.approved_by,g.branch_name
      //       ORDER BY a.payment_date,c.group_name`;
      //       var member_dt = await db_Select(select,table_name,whr,order);
      
      //     res.send(member_dt);
      //     }
      // } else {

        if(data.flag == 'M'){

          var select = "a.payment_date,a.payment_id,b.group_code,c.group_name,a.branch_id,b.member_code,d.client_name,b.loan_id,a.particulars,a.credit,(a.balance + a.od_balance + a.intt_balance)balance,a.tr_mode,e.scheme_name,a.bank_name,a.cheque_id,a.trn_addr,a.created_by collector_code,f.emp_name collec_name,a.created_at,a.approved_by,a.approved_at,g.branch_name",
          table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_member d ON b.member_code = d.member_code LEFT JOIN md_scheme e ON b.scheme_id = e.scheme_id LEFT JOIN md_employee f ON a.created_by = f.emp_id LEFT JOIN md_branch g ON a.branch_id = g.branch_code",
          whr = `b.branch_code = '${data.branch_code}' AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
          order = `ORDER BY a.payment_date,c.group_name`;
          var member_dt = await db_Select(select,table_name,whr,order);
      
          res.send(member_dt);
          } else {
    
            var select = "a.payment_date,a.branch_id,b.group_code,c.group_name,a.particulars,sum(a.credit)credit,(sum(a.balance) + sum(a.od_balance) + sum(a.intt_balance))balance,a.tr_mode,e.scheme_name,a.bank_name,a.created_by collector_code,f.emp_name collec_name,a.created_at,a.approved_by,g.branch_name",
            table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_member d ON b.member_code = d.member_code LEFT JOIN md_scheme e ON b.scheme_id = e.scheme_id LEFT JOIN md_employee f ON a.created_by = f.emp_id LEFT JOIN md_branch g ON a.branch_id = g.branch_code",
            whr = `b.branch_code = '${data.branch_code}' AND date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
            order = `GROUP BY a.payment_date,b.group_code,c.group_name,a.particulars,a.tr_mode,e.scheme_name,a.bank_name,a.created_by,f.emp_name,a.created_at,a.approved_by,a.branch_id,g.branch_name
            ORDER BY a.payment_date,c.group_name`;
            var member_dt = await db_Select(select,table_name,whr,order);
      
          res.send(member_dt);
          }
      // }
});

module.exports = {loan_transAdminRouter}