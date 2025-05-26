const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_closeRouter = express.Router(),
dateFormat = require('dateformat');

loan_closeRouter.post("/loan_close_report_memberwise", async (req, res) => {
    try{
    var data = req.body;

    var select = "max(payment_date)payment_date,branch_code,member_code,client_name,loan_id,group_code,group_name,co_id,emp_name,purpose,CONCAT(sub_purpose,'-',purpose_id)purpose_id,scheme_id,scheme_name,fund_id,fund_name,curr_roi,period,period_mode,disb_dt,sum(debit_amt)debit_amt,sum(credit_amt)credit_amt",
    table_name = `(SELECT b.payment_date,a.branch_code,a.member_code,c.client_name,a.loan_id,a.group_code,d.group_name,d.co_id,h.emp_name,a.purpose,CONCAT(e.sub_purpose,'-',e.purpose_id)purpose_id,a.scheme_id,f.scheme_name,a.fund_id,g.fund_name,a.curr_roi,a.period,a.period_mode,a.disb_dt,0 debit_amt, 0 credit_amt
    FROM td_loan a,td_loan_transactions b,md_member c,md_group d,md_purpose e,md_scheme f,md_fund g,md_employee h
    WHERE a.loan_id = b.loan_id
    AND a.member_code = c.member_code
    AND a.group_code = d.group_code
    AND a.purpose = e.purp_id
    AND a.scheme_id = f.scheme_id
    AND a.fund_id = g.fund_id
    AND d.co_id = h.emp_id
    AND b.balance = 0
    AND b.payment_date BETWEEN '${data.from_date}' AND '${data.to_date}'

    UNION

    SELECT '' payment_date,a.branch_code,a.member_code,c.client_name,a.loan_id,a.group_code,d.group_name,d.co_id,h.emp_name,a.purpose,CONCAT(e.sub_purpose,'-',e.purpose_id)purpose_id,a.scheme_id,f.scheme_name,a.fund_id,g.fund_name,a.curr_roi,a.period,a.period_mode,a.disb_dt,a.prn_disb_amt debit_amt, 0 credit_amt
    FROM td_loan a,td_loan_transactions b,md_member c,md_group d,md_purpose e,md_scheme f,md_fund g,md_employee h
    WHERE a.loan_id = b.loan_id
    AND a.member_code = c.member_code
    AND a.group_code = d.group_code
    AND a.purpose = e.purp_id
    AND a.scheme_id = f.scheme_id
    AND a.fund_id = g.fund_id
    AND d.co_id = h.emp_id
    AND a.loan_id in (SELECT loan_id from td_loan_transactions 
                     WHERE balance = 0
                     AND payment_date BETWEEN '${data.from_date}' AND '${data.to_date}')

    UNION
    
    SELECT '' payment_date,a.branch_code,a.member_code,c.client_name,a.loan_id,a.group_code,d.group_name,d.co_id,h.emp_name,a.purpose,CONCAT(e.sub_purpose,'-',e.purpose_id)purpose_id,a.scheme_id,f.scheme_name,a.fund_id,g.fund_name,a.curr_roi,a.period,a.period_mode,a.disb_dt,0 debit_amt, sum(b.credit)credit_amt
    FROM td_loan a,td_loan_transactions b,md_member c,md_group d,md_purpose e,md_scheme f,md_fund g,md_employee h
    WHERE a.loan_id = b.loan_id
    AND a.member_code = c.member_code
    AND a.group_code = d.group_code
    AND a.purpose = e.purp_id
    AND a.scheme_id = f.scheme_id
    AND a.fund_id = g.fund_id
    AND d.co_id = h.emp_id
    AND a.loan_id in (SELECT DISTINCT loan_id from td_loan_transactions 
                   WHERE balance = 0
                   AND payment_date BETWEEN '${data.from_date}' AND '${data.to_date}')
    GROUP BY a.branch_code,a.member_code,c.client_name,a.loan_id,a.group_code,d.group_name,d.co_id,h.emp_name,a.purpose,e.purpose_id,a.scheme_id,f.scheme_name,a.fund_id,g.fund_name,a.curr_roi,a.period,a.period_mode,a.disb_dt)a`,
    whr = null,
    order = `GROUP BY branch_code,member_code,client_name,loan_id,group_code,group_name,co_id,emp_name,purpose,     purpose_id,scheme_id,scheme_name,fund_id,fund_name,curr_roi,period,period_mode,disb_dt
    ORDER BY payment_date,group_code,loan_id,payment_date`;
    var loan_close_repo_memwise = await db_Select(select,table_name,whr,order);

    res.send(loan_close_repo_memwise)
    }catch(error){
      res.send({suc: 0, msg: "Error fetching loan close report", error})
    }
});

module.exports = {loan_closeRouter}