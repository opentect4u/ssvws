const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_outstandingRouter = express.Router(),
dateFormat = require('dateformat');

loan_outstandingRouter.post("/loan_outstanding_report", async (req, res) => {
    var data = req.body;

    //FETCH OUTSTANDING DETAILS MEMBER WISE
    var select = "c.payment_date,a.group_code,d.group_name,a.member_code,b.client_name,a.loan_id,b.client_mobile,b.gurd_name,b.client_addr,b.aadhar_no,b.pan_no,b.acc_no,e.purpose_id,f.sub_purp_name,g.scheme_name,h.fund_name,a.applied_dt,a.applied_amt,a.disb_dt,a.intt_cal_amt intt_payable,a.prn_disb_amt,a.curr_roi,a.period_mode,a.instl_end_dt,(a.prn_amt + a.od_prn_amt)prn_amt,a.intt_amt,a.outstanding,c.created_by collector_code,i.emp_name collec_name,c.created_at,c.approved_by,c.approved_at",
    table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN td_loan_transactions c ON a.loan_id = c.loan_id LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_purpose e ON a.purpose = e.purp_id LEFT JOIN md_sub_purpose f ON a.sub_purpose = f.sub_purp_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_fund h ON a.fund_id = h.fund_id LEFT JOIN md_employee i ON c.created_by = i.emp_id",
    whr = `a.branch_code = '${data.branch_code}' AND c.tr_type = '${data.tr_type}'`,
    order = `ORDER BY c.payment_date`;
    var loan_outstanding_dt = await db_Select(select,table_name,whr,order);

    res.send(loan_outstanding_dt);
})

module.exports = {loan_outstandingRouter}