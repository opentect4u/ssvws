const { db_Select } = require('../../model/mysqlModel');
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
    whr = `(a.member_code like '%${data.member_dtls}%' OR a.client_name like '%${data.member_dtls}%') AND b.approval_status = 'A'`,
    order = null;
    var fetch_appl_dtls = await db_Select(select,table_name,whr,order);

    res.send(fetch_appl_dtls)
});

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



module.exports = {loanRouter}