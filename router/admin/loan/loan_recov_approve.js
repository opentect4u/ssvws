const { db_Select, db_Insert, db_Delete } = require('../../../model/mysqlModel');

const express = require('express'),
loan_recov_approveRouter = express.Router(),
dateFormat = require('dateformat');

loan_recov_approveRouter.post("/fetch_groupwise_recovery_admin", async (req, res) => {
    var data = req.body;

    //FETCH GROUPWISE RECOVERY DATA
    var select = "a.payment_date transaction_date,SUM(a.credit) credit_amt,b.group_code,SUM(b.tot_emi) tot_emi,a.created_by created_code,a.status,b.branch_code,c.group_name,d.emp_name created_by,SUM(a.balance+a.od_balance+a.intt_balance) outstanding,if(a.tr_mode='C','Cash','UPI')tr_mode",
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id",
    whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'R'`
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

loan_recov_approveRouter.post("/checking_before_approve", async (req, res) => {
  try{
     var data = req.body;

     if (data.chkdt.length > 0) {  
        for (let dt of data.chkdt) { 
            if(data.flag == 'M'){
                var select = "COUNT(*) tot_row",
                table_name = "td_loan_transactions",
                whr = `loan_id = '${dt.loan_id}' AND payment_date <= '${dateFormat(dt.payment_date,'yyyy-mm-dd')}' AND payment_id  < '${dt.payment_id}' AND status = 'U'`
                order = null;
                var check_dt = await db_Select(select,table_name,whr,order);
            }else {
                var select = "loan_id",
                table_name = "td_loan",
                whr = `group_code = '${data.group_code}'`,
                order = null;
                var loan_id_dt = await db_Select(select,table_name,whr,order);

                var loan_ids = loan_id_dt.msg.map(dts => dts.loan_id).join(",");
                var select = "COUNT(*) tot_row",
                table_name = "td_loan_transactions",
                whr = `loan_id = '${loan_ids}' AND payment_date <= '${dateFormat(dt.payment_date,'yyyy-mm-dd')}' AND status = 'U'`
                order = null;
                var check_dt = await db_Select(select,table_name,whr,order);
            }
           
            if (check_dt.suc > 0 && check_dt.msg.length > 0) {
                if(check_dt.msg[0].tot_row > 0){
                    return res.send({ suc: 0, msg: "One or more unapprove transactions found before this transactions" });
                }
            }
        }
       return res.send({ suc: 1, msg: "No unapproved details found" });
    } else {
       return res.send({ suc: 0, msg: "No data provided to check" });
      }
  }catch (error) {
    console.error("Error fetching loan:", error);
   return res.send({ suc: 0, msg: "An error occurred" });
}
});

// loan_recov_approveRouter.post("/checking_before_approve_grp_co", async (req, res) => {
//     try {
//         var data = req.body;

//         if (data.chkdt.length > 0) {
//             for (let dt of data.chkdt) {
//                 // Step 1: Get the max payment_id for this loan_id
//                 var select = "MAX(payment_id) payment_id",
//                     table_name = "td_loan_transactions",
//                     whr = `loan_id = '${dt.loan_id}'`,
//                     order = null;

//                 var maxResult = await db_Select(select, table_name, whr, order);

//                 if (maxResult.suc > 0 && maxResult.msg.length > 0) {
//                     let max_payment_id = maxResult.msg[0].max_payment_id;

//                     // Step 2: Check if there are unapproved transactions before the max payment_id
//                     var select = "COUNT(*) AS tot_row",
//                     table_name = "td_loan_transactions",
//                     whr = `loan_id = '${dt.loan_id}' AND payment_id < '${max_payment_id}' AND status = 'U'`;

//                     let check_dt = await db_Select(select, table_name, whr, order);

//                     if (check_dt.suc > 0 && check_dt.msg.length > 0) {
//                         if (check_dt.msg[0].tot_row > 0) {
//                             return res.send({ suc: 0, msg: "One or more unapproved transactions found before the latest transaction." });
//                         }
//                     }
//                 } else {
//                     return res.send({ suc: 0, msg: "Failed to fetch maximum payment_id." });
//                 }
//             }
//             return res.send({ suc: 1, msg: "No unapproved transactions found before the latest payment_id." });
//         } else {
//             return res.send({ suc: 0, msg: "No data provided to check." });
//         }
//     } catch (error) {
//         console.error("Error checking unapproved transactions:", error);
//         return res.send({ suc: 0, msg: "An error occurred during the check." });
//     }
// });


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
    try {
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var data = req.body, del_loans = {};
    // console.log(data,'juju');
    
    //REJECT RECOVERY TRANSACTION MEMBERWISE
    if (data.reject_membdt.length > 0) {   
        var payment_date_arr = data.reject_membdt.map(pdt => `'${dateFormat(pdt.payment_date, 'yyyy-mm-dd')}'`)
        var loan_id_arr = data.reject_membdt.map(pdt => `'${pdt.loan_id}'`)
        var branch_code_arr = data.reject_membdt.map(pdt => `'${pdt.branch_code}'`)

        // console.log(payment_date_arr,loan_id_arr,branch_code_arr,'array');
        
    
        var select = "a.loan_id,b.payment_date,b.payment_id,b.branch_id,b.particulars,b.credit,b.debit,b.prn_recov,b.intt_recov,b.balance,b.od_balance,b.intt_balance,b.tr_type,b.tr_mode,b.created_by",
            table_name = "td_loan a, td_loan_transactions b",
            whr = `a.branch_code = b.branch_id AND a.loan_id = b.loan_id AND a.branch_code IN (${branch_code_arr.join(',')}) AND b.payment_date IN (${payment_date_arr.join(',')}) AND a.loan_id IN (${loan_id_arr.join(',')}) AND b.tr_type IN ('I', 'R')`,
            order = null;
            var fetch_loans = await db_Select(select,table_name,whr,order);

            // console.log(fetch_loans,'fetch_loans');
            

        if(fetch_loans.suc > 0 && fetch_loans.msg.length > 0){
            
            for (let dt of fetch_loans.msg) {
    
                    var table_name = "td_reject_transactions",
                    fields = `(payment_date,payment_id,branch_id,loan_id,particulars,credit,debit,prn_recov,intt_recov,balance,od_balance,intt_balance,tr_type,tr_mode,status,reject_remarks,rejected_by,rejected_at,created_by)`,
                    values = `('${dateFormat(dt.payment_date, 'yyyy-mm-dd')}','${dt.payment_id}','${dt.branch_id}','${dt.loan_id}','${dt.particulars}','${dt.credit}','${dt.debit}','${dt.prn_recov}','${dt.intt_recov}','${dt.balance}','${dt.od_balance}','${dt.intt_balance}','${dt.tr_type}','${dt.tr_mode}','R','${data.reject_remarks.split("'").join("\\'")}','${data.rejected_by}','${datetime}','${dt.created_by}')`,
                    whr = null,
                    flag = 0;
                    var reject_dt = await db_Insert(table_name,fields,values,whr,flag);
               
                    // console.log(reject_dt,'reject_dt');
                    
    
                if(reject_dt.suc > 0 && reject_dt.msg.length > 0){
                    var table_name = "td_loan_transactions",
                    whr = `payment_date = '${dateFormat(dt.payment_date, 'yyyy-mm-dd')}' AND payment_id = '${dt.payment_id}' AND loan_id = '${dt.loan_id}' AND tr_type = '${dt.tr_type}'`
                    del_loans = await db_Delete(table_name,whr);
                }

                // console.log(del_loans,'del');

                if(del_loans.suc > 0 && del_loans.msg.length > 0){
                    var select = "loan_id,balance,od_balance,intt_balance,tr_type",
                    table_name = "td_loan_transactions",
                    whr = `loan_id = '${dt.loan_id}'`,
                    order = `ORDER BY payment_id DESC
                    LIMIT 1`;
                    var last_row = await db_Select(select,table_name,whr,order)
                }

                // console.log(last_row,'last_row');

                if(last_row.suc > 0 && last_row.msg.length > 0){
                    // console.log(last_row,'lass');
                    
                    var prn_amt = last_row.msg[0].balance
                    var od_prn_amt = last_row.msg[0].od_balance
                    var intt_amt = last_row.msg[0].intt_balance
                    var outstanding = parseFloat(prn_amt) + parseFloat(od_prn_amt) + parseFloat(intt_amt)

                    var table_name = "td_loan",
                    fields = `prn_amt = '${prn_amt}', od_prn_amt = '${od_prn_amt}', intt_amt = '${intt_amt}', outstanding = '${outstanding}', modified_by = '${data.rejected_by}', modified_dt = '${datetime}'`,
                    values = null,
                    whr = `loan_id = '${dt.loan_id}'`,
                    flag = 1;
                    var update_dt = await db_Insert(table_name,fields,values,whr,flag);
                }

                // console.log(update_dt,'reject');
                
            }
        }    
        
    }

    res.send(del_loans)
} catch (error) {
    console.error("Error occurred:", error.message);
    res.send({ success: false, error: error.message });
}
});

loan_recov_approveRouter.post("/reject_grp_co_wise_recov", async (req, res) => {
    try {
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var data = req.body, del_loan = {};
    // console.log(data,'data');

    //REJECT GROUPWISE / COWISE RECOVERY
    if (data.reject_dt.length > 0) {        
        for (let dt of data.reject_dt) {
        // var select = "a.loan_id,b.payment_date,b.payment_id,b.branch_id,b.credit,b.debit,b.tr_type",
        var select = "a.loan_id,b.payment_date,b.payment_id,b.branch_id,b.particulars,b.credit,b.debit,b.prn_recov,b.intt_recov,b.balance,b.od_balance,b.intt_balance,b.tr_type,b.tr_mode,b.created_by"
        table_name = "td_loan a, td_loan_transactions b",
        whr = `a.branch_code = b.branch_id AND a.loan_id = b.loan_id AND a.branch_code = '${dt.branch_code}' AND a.group_code = '${dt.group_code}' AND b.payment_date = '${dateFormat(dt.payment_date, 'yyyy-mm-dd')}' AND b.tr_type IN ('I', 'R')`,
        order = null;
        var fetch_loan = await db_Select(select,table_name,whr,order);
        // console.log(fetch_loan,'fetchhh');
        

            if(fetch_loan.suc > 0 && fetch_loan.msg.length > 0){
                for (let dts of fetch_loan.msg) {

                        var table_name = "td_reject_transactions",
                        fields = `(payment_date,payment_id,branch_id,loan_id,particulars,credit,debit,prn_recov,intt_recov,balance,od_balance,intt_balance,tr_type,tr_mode,status,reject_remarks,rejected_by,rejected_at,created_by)`,
                        values = `('${dateFormat(dts.payment_date, 'yyyy-mm-dd')}','${dts.payment_id}','${dts.branch_id}','${dts.loan_id}','${dts.particulars}','${dts.credit}','${dts.debit}','${dts.prn_recov}','${dts.intt_recov}','${dts.balance}','${dts.od_balance}','${dts.intt_balance}','${dts.tr_type}','${dts.tr_mode}','R','${data.reject_remarks.split("'").join("\\'")}','${data.rejected_by}','${datetime}','${dts.created_by}')`,
                        whr = null,
                        flag = 0;
                        var reject_dt = await db_Insert(table_name,fields,values,whr,flag);
                        // console.log(reject_dt,'reject_dtt');
                        
    
                        if(reject_dt.suc > 0 && reject_dt.msg.length > 0){
                            var table_name = "td_loan_transactions",
                            whr = `payment_date = '${dateFormat(dts.payment_date, 'yyyy-mm-dd')}' AND payment_id = '${dts.payment_id}' AND loan_id = '${dts.loan_id}' AND tr_type = '${dts.tr_type}'`
                            del_loan = await db_Delete(table_name,whr);
                        }
                        // console.log(del_loan,'loans');

                        if(del_loan.suc > 0 && del_loan.msg.length > 0){
                            var select = "loan_id,balance,od_balance,intt_balance,tr_type",
                            table_name = "td_loan_transactions",
                            whr = `loan_id = '${dts.loan_id}'`,
                            order = `ORDER BY payment_id DESC
                            LIMIT 1`;
                            var last_rows = await db_Select(select,table_name,whr,order)
                        }
        
                        // console.log(last_rows,'last_row');
        
                        if(last_rows.suc > 0 && last_rows.msg.length > 0){
                            // console.log(last_rows,'lasst');
                            
                            var prn_amt = last_rows.msg[0].balance
                            var od_prn_amt = last_rows.msg[0].od_balance
                            var intt_amt = last_rows.msg[0].intt_balance
                            var outstanding = parseFloat(prn_amt) + parseFloat(od_prn_amt) + parseFloat(intt_amt)
        
                            var table_name = "td_loan",
                            fields = `prn_amt = '${prn_amt}', od_prn_amt = '${od_prn_amt}', intt_amt = '${intt_amt}', outstanding = '${outstanding}', modified_by = '${data.rejected_by}', modified_dt = '${datetime}'`,
                            values = null,
                            whr = `loan_id = '${dts.loan_id}'`,
                            flag = 1;
                            var update_dts = await db_Insert(table_name,fields,values,whr,flag);
                        }
        
                        // console.log(update_dts,'update');
                        
                }
             }
        }
    }

    res.send(del_loan)
} catch (error) {
    console.error("Error occurred:", error.message);
    res.send({ success: false, error: error.message });
}
});

loan_recov_approveRouter.post("/reject_list", async (req, res) => {
    var data = req.body;

    var select = "payment_date,payment_id,branch_id,loan_id,credit,tr_type,status,reject_remarks",
    table_name = "td_reject_transactions",
    whr = `status = 'R'`,
    order = null;
    var reject_list_dt = await db_Select(select,table_name,whr,order);

    res.send(reject_list_dt)
});

module.exports = {loan_recov_approveRouter}