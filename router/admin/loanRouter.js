const { db_Select, db_Insert } = require('../../model/mysqlModel');
const { loan_trans } = require('../../modules/admin/loanModule');

const loanRouter = require('express').Router();
dateFormat = require('dateformat');

loanRouter.post("/scheme_dtls", async (req, res) => {
    var data = req.body;

    var select = "scheme_name,min_amt,max_amt,min_period,max_period,payment_mode,roi",
    table_name = "md_scheme",
    whr = `scheme_id = '${data.scheme_id}'`,
    order = null;
    var scheme_dt = await db_Select(select,table_name,whr,order);

    res.send(scheme_dt)
});

loanRouter.post("/fetch_loan_application_dtls", async (req, res) => {
    var data = req.body;

        var select = "a.branch_code,a.member_code,a.client_name,b.form_no,DATE_FORMAT(b.grt_date, '%Y-%m-%d') application_date,b.prov_grp_code,DATE_FORMAT(b.approved_at, '%Y-%m-%d') grt_approve_date,c.branch_name,d.group_name,e.applied_amt,e.loan_purpose,e.sub_pupose,f.purpose_id,g.sub_purp_name",
        table_name = "md_member a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.branch_code = d.branch_code AND b.prov_grp_code = d.group_code LEFT JOIN td_grt_occupation_household e ON a.branch_code = e.branch_code AND b.form_no = e.form_no LEFT JOIN md_purpose f ON e.loan_purpose = f.purp_id LEFT JOIN md_sub_purpose g ON e.sub_pupose = g.sub_purp_id",
        whr = `a.member_code like '%${data.member_dtls}%' OR a.client_name like '%${data.member_dtls}%' OR a.client_mobile like '%${data.member_dtls}%' OR b.form_no like '%${data.member_dtls}%'`,
        order = null;
        var fetch_appl_dtls = await db_Select(select,table_name,whr,order);
   
    res.send(fetch_appl_dtls)
});

loanRouter.post("/fetch_existing_loan", async (req, res) => {
    var data = req.body;

    // var select = "loan_id,branch_code,group_code,member_code,grt_form_no,purpose,sub_purpose,applied_amt,applied_dt,scheme_id,fund_id,period,curr_roi,disb_dt,prn_disb_amt,period_mode,last_trn_dt",
    var select = "*",
    table_name = "td_loan",
    whr = `grt_form_no = '${data.form_no}' AND last_trn_dt <= date(now()) AND instl_end_dt >= date(now());`,
    order = null;
    var loan_dtls = await db_Select(select,table_name,whr,order);

    if(loan_dtls.suc > 0 && loan_dtls.msg.length > 0){
        var select = "payment_date transaction_dt,payment_id transaction_id,particulars,debit,bank_charge,proc_charge,tr_type,tr_mode,bank_name,cheque_id,chq_dt,status",
        table_name = "td_loan_transactions",
        whr = `loan_id = ${loan_dtls.msg[0].loan_id} AND branch_id = '${loan_dtls.msg[0].branch_code}'`,
        order = `ORDER BY payment_date ASC LIMIT 1`;
        var loan_trans_dt = await db_Select(select,table_name,whr,order);

        loan_dtls = {suc: loan_dtls.suc, loan_dt: loan_dtls.msg[0], loan_trans: loan_trans_dt.msg[0], msg: true}
    }else {
        loan_dtls = {suc: loan_dtls.suc, loan_dt: loan_dtls.msg, loan_trans: {}, msg: false}
    }

res.send(loan_dtls)
})

loanRouter.post("/fetch_loan_trans_dtls", async (req, res) => {
    var data = req.body;

    var select = "a.payment_date transaction_date, a.payment_id transaction_id, a.loan_id, a.tr_type, a.debit, b.member_code, c.client_name",
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_member c ON b.branch_code = c.branch_code AND b.member_code = c.member_code",
    whr = `a.status = 'U'`,
    order = null;
    var fetch_trans_dt = await db_Select(select,table_name,whr,order);

    res.send(fetch_trans_dt)
});

// loanRouter.post("/fetch_unapprove_loan_dtls", async (req, res) => {
//     var data = req.body;

//     var select = "a.branch_code,a.member_code,a.client_name,b.form_no,DATE_FORMAT(b.grt_date, '%Y-%m-%d') application_date,b.prov_grp_code,DATE_FORMAT(b.approved_at, '%Y-%m-%d') grt_approve_date,c.branch_name,d.group_name,e.applied_amt,e.loan_purpose,e.sub_pupose,f.purpose_id,g.sub_purp_name",
//     table_name = "md_member a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.branch_code = d.branch_code AND b.prov_grp_code = d.group_code LEFT JOIN td_grt_occupation_household e ON a.branch_code = e.branch_code AND b.form_no = e.form_no LEFT JOIN md_purpose f ON e.loan_purpose = f.purp_id LEFT JOIN md_sub_purpose g ON e.sub_pupose = g.sub_purp_id",
//     whr = `a.member_code = ${data.member_code}`,
//     order = null;
//     var member_dtls = await db_Select(select,table_name,whr,order);

//     if(member_dtls.suc > 0 && member_dtls.msg.length > 0){
//         var select = "a.loan_id,a.branch_code,a.group_code,a.member_code,a.grt_form_no,a.purpose,a.sub_purpose,a.applied_amt,a.applied_dt,a.scheme_id,a.fund_id,a.period,a.curr_roi,a.disb_dt,a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.intt_amt,a.prn_emi,a.intt_emi,a.tot_emi,a.period_mode,a.instl_start_dt,a.instl_end_dt,a.last_trn_dt,b.scheme_name,c.fund_name",
//         table_name = "td_loan a LEFT JOIN md_scheme b ON a.scheme_id = b.scheme_id LEFT JOIN md_fund c ON a.fund_id = c.fund_id",
//         whr = `a.grt_form_no = ${member_dtls.msg[0].form_no}`,
//         order = null;
//         var loan_dtls = await db_Select(select,table_name,whr,order);
    
//         if(loan_dtls.suc > 0 && loan_dtls.msg.length > 0){
//             var select = "payment_date transaction_date, payment_id transaction_id, particulars,debit, bank_charge,proc_charge,balance,tr_type,tr_mode,bank_name,cheque_id,chq_dt,status",
//             table_name = "td_loan_transactions",
//             whr = `loan_id = ${loan_dtls.msg[0].loan_id} AND branch_id = '${loan_dtls.msg[0].branch_code}' AND status = 'U'`,
//             order = null;
//             var loan_trans_dt = await db_Select(select,table_name,whr,order);
    
//             loan_dtls = {suc: loan_dtls.suc, loan_dt: loan_dtls.msg[0], loan_trans: loan_trans_dt.msg[0], msg: true}
//         }else {
//             loan_dtls = {suc: loan_dtls.suc, loan_dt: loan_dtls.msg, loan_trans: {}, msg: false}
//         }
//     }else {
//         member_dtls = {suc: member_dtls.suc, member_dt: member_dtls.msg,  msg: false}
//     }
//     res.send(member_dtls)
// })

loanRouter.post("/save_loan_transaction", async (req, res) => {
    var data = req.body,res_dt;
    loan_trans(data).then(data => {
        res_dt = data
    }).catch(err => {
        res_dt = err
    }).finally (() => {
        res.send(res_dt)
    })

});

loanRouter.post("/approve_loan_disbursement", async (req, res) => {
    var data = req.body;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var table_name = "td_loan_transactions",
    fields = `status = 'A', approved_by = '${data.approved_by}', approved_at = '${datetime}'`,
    values = null,
    whr = `loan_id = '${data.loan_id}'`,
    flag = 1;
    var approve_dt = await db_Insert(table_name,fields,values,whr,flag);

    res.send(approve_dt)
})

module.exports = {loanRouter}