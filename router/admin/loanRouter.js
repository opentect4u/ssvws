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