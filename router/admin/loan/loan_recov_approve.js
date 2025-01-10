const { db_Select, db_Insert } = require('../../../model/mysqlModel');

const express = require('express'),
loan_recov_approveRouter = express.Router(),
dateFormat = require('dateformat');

loan_recov_approveRouter.post("/fetch_groupwise_recovery_admin", async (req, res) => {
    var data = req.body;

    //FETCH GROUPWISE RECOVERY DATA
    var select = "a.payment_date transaction_date,SUM(a.credit) credit_amt,b.group_code,SUM(b.tot_emi) tot_emi,a.created_by created_code,a.status,b.branch_code,c.group_name,d.emp_name created_by,SUM(a.balance+a.od_balance+a.intt_balance) outstanding,if(a.tr_mode='C','Cash','UPI')tr_mode",
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id",
    whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'R'`,
    order = `GROUP BY a.payment_date,b.group_code,a.created_by,a.status,b.branch_code,c.group_name,d.emp_name,a.tr_mode`;
    var fetch_grp_dt = await db_Select(select,table_name,whr,order);

    res.send(fetch_grp_dt);
    // console.log(fetch_grp_dt,'lo');
    
});

loan_recov_approveRouter.post("/fetch_grp_member_dtls", async (req, res) => {
    var data = req.body;

    //FETCH GROUPWISE RECOVERY DATA OF MEMBER
    var select = "a.payment_date transaction_date,a.payment_id,c.group_name,b.loan_id,b.tot_emi,e.client_name,a.credit amt,if(a.tr_mode='C','Cash','UPI')tr_mode,a.created_by creted_code,d.emp_name created_by,(a.balance+a.od_balance+a.intt_balance) outstanding",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code",
    whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'R' AND b.group_code = '${data.group_code}' AND a.payment_date = '${dateFormat(data.payment_date, 'yyyy-mm-dd')}'`,
    order = null;
    var fetch_grp_memb_dt = await db_Select(select,table_name,whr,order);

    res.send(fetch_grp_memb_dt);

});

loan_recov_approveRouter.post("/fetch_memberwise_recovery_admin", async (req, res) => {
    var data = req.body;

        //FETCH MEMBERWISE RECOVERY DATA
        var select = "a.payment_date transaction_date,a.payment_id,c.group_name,b.loan_id,b.tot_emi,e.client_name,a.credit amt,if(a.tr_mode='C','Cash','UPI')tr_mode,a.created_by creted_code,a.status,b.branch_code,d.emp_name created_by,(a.balance+a.od_balance+a.intt_balance) outstanding",
        table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code",
        whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'R'`,
        order = null;
        var fetch_recov_memb_dt = await db_Select(select,table_name,whr,order);
   
        res.send(fetch_recov_memb_dt)
});

loan_recov_approveRouter.post("/fetch_branch_co", async (req, res) => {
    var data = req.body;

     //FETCH BRANCHWISE CO NAME
    var select = "a.emp_id,a.emp_name,b.user_type",
    table_name = "md_employee a LEFT JOIN md_user b ON a.emp_id = b.emp_id",
    whr = `a.branch_id = '${data.branch_code}' AND b.user_type IN ('1','2') AND b.user_status = 'A'`,
    order = null;
    var branch_co_dt = await db_Select(select,table_name,whr,order);

    res.send(branch_co_dt)
});

loan_recov_approveRouter.post("/fetch_cowise_recov_data", async (req, res) => {
    var data = req.body;

     //FETCH COWISE RECOVERY DATA
     var select = "a.payment_date transaction_date,SUM(a.credit) credit_amt,b.group_code,SUM(b.tot_emi) tot_emi,a.created_by created_code,a.status,b.branch_code,c.group_name,d.emp_name created_by,SUM(a.balance+a.od_balance+a.intt_balance) outstanding,if(a.tr_mode='C','Cash','UPI')tr_mode",
     table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id",
     whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'R' AND a.created_by = '${data.co_id}'`,
     order = `GROUP BY a.payment_date,b.group_code,a.created_by,a.status,c.group_name,d.emp_name,a.tr_mode,b.branch_code`;
     var fetch_grp_dt = await db_Select(select,table_name,whr,order);
 
     res.send(fetch_grp_dt);
});

loan_recov_approveRouter.post("/fetch_cowise_recov_member_dtls", async (req, res) => {
    var data = req.body;

    //FETCH COWISE RECOVERY DATA OF MEMBER
    var select = "a.payment_date transaction_date,a.payment_id,c.group_name,b.loan_id,b.tot_emi,e.client_name,a.credit amt,if(a.tr_mode='C','Cash','UPI')tr_mode,a.created_by creted_code,a.status,d.emp_name created_by,(a.balance+a.od_balance+a.intt_balance) outstanding",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code",
    whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'R' AND a.created_by = '${data.co_id}' AND a.payment_date = '${dateFormat(data.payment_date, 'yyyy-mm-dd')}'`,
    order = null;
    var fetch_co_memb_dt = await db_Select(select,table_name,whr,order);

    res.send(fetch_co_memb_dt);

});

loan_recov_approveRouter.post("/approve_grpwise_recov", async (req, res) => {
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var data = req.body;
    // console.log(data,'data');

    //APPROVE GROUPWISE RECOVERY
    if (data.grpdt.length > 0) {        
        for (let dt of data.grpdt) {
        var select = "loan_id",
        table_name = "td_loan",
        whr = `branch_code = '${dt.branch_code}' AND group_code = '${dt.group_code}'`,
        order = null;
        var fetch_loan_id = await db_Select(select,table_name,whr,order);

            if(fetch_loan_id.suc > 0 && fetch_loan_id.msg.length > 0){
                var loan_id_arr = fetch_loan_id.msg.map(ldt => ldt.loan_id)
                // console.log(loan_id_arr,'arr');
                
                var table_name = "td_loan_transactions",
                fields = `status = 'A', approved_by = '${data.approved_by}', approved_at = '${datetime}'`,
                values = null,
                whr = `payment_date = '${dateFormat(dt.payment_date, 'yyyy-mm-dd')}' AND loan_id IN (${loan_id_arr.join(',')}) AND tr_type != 'D'`,
                flag = 1;
                var approve_dt = await db_Insert(table_name,fields,values,whr,flag);
             }
        }
    }

    res.send(approve_dt)
});

loan_recov_approveRouter.post("/approve_member_recov", async (req, res) => {
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var data = req.body;
    // console.log(data,'memdata');

    //APPROVE MEMBERWISE RECOVERY
    if (data.membdt.length > 0) {        
        for (let dt of data.membdt) {
                var table_name = "td_loan_transactions",
                fields = `status = 'A', approved_by = '${data.approved_by}', approved_at = '${datetime}'`,
                values = null,
                whr = `payment_date = '${dateFormat(dt.payment_date, 'yyyy-mm-dd')}' AND payment_id = '${dt.payment_id}' AND loan_id = '${dt.loan_id}' AND tr_type != 'D'`,
                flag = 1;
                var approve_dt_memb = await db_Insert(table_name,fields,values,whr,flag);
        }
    }

    res.send(approve_dt_memb)
});

loan_recov_approveRouter.post("/reject_recovery_transaction", async (req, res) => {
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var data = req.body;
    // console.log(data,'juju');
    
//REJECT RECOVERY TRANSACTION
    if (data.reject_membdt.length > 0) {        
        for (let dt of data.reject_membdt) {
            var table_name = "td_reject_transactions",
            fields = `(payment_date,payment_id,branch_id,loan_id,credit,tr_type,status,reject_remarks,rejected_by,rejected_at)`,
            values = `('${dateFormat(dt.payment_date, 'yyyy-mm-dd')}','${dt.payment_id}','${dt.branch_code}','${dt.loan_id}','${dt.credit}','R','R','${data.reject_remarks.split("'").join("\\'")}','${data.rejected_by}','${datetime}')`,
            whr = null,
            flag = 0;
            var reject_dt = await db_Insert(table_name,fields,values,whr,flag);
        }
    }

    res.send(reject_dt)

});

loan_recov_approveRouter.post("/reject_list", async (req, res) => {
    var data = req.body;

    var select = "payment_date,payment_id,branch_id,loan_id,credit,tr_type,status,reject_remarks",
    table_name = "td_reject_transactions",
    whr = `status = 'R'`,
    order = null;
    var reject_list_dt = await db_Select(select,table_name,whr,order);

    res.send(reject_list_dt)
})

module.exports = {loan_recov_approveRouter}