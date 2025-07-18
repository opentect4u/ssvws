const { db_Select, db_Insert, db_Delete } = require('../../../model/mysqlModel');

const express = require('express'),
loan_disb_approveRouter = express.Router(),
dateFormat = require('dateformat');

loan_disb_approveRouter.post("/fetch_groupwise_disburse_admin", async (req, res) => {
    var data = req.body;

    //FETCH GROUPWISE DISBURSE DATA
    var select = "a.payment_date transaction_date,SUM(a.debit) debit_amt,b.group_code,a.created_by created_code,a.status,b.branch_code,b.purpose,b.scheme_id,b.fund_id,b.period,b.period_mode,b.curr_roi,SUM(b.tot_emi) total_emi,c.group_name,d.emp_name created_by,CONCAT(e.sub_purpose,'-',e.purpose_id)purpose_id,f.scheme_name",
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_purpose e ON b.purpose = e.purp_id LEFT JOIN md_scheme f ON b.scheme_id = f.scheme_id",
    whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'D'`,
    order = `GROUP BY a.payment_date,b.group_code,a.created_by,a.status,b.branch_code,b.purpose,b.scheme_id,b.fund_id,b.period,b.period_mode,b.curr_roi,c.group_name,d.emp_name,e.purpose_id,f.scheme_name`;
    var fetch_grp_dt_disb = await db_Select(select,table_name,whr,order);

    res.send(fetch_grp_dt_disb);
    // console.log(fetch_grp_dt,'lo');
    
});

loan_disb_approveRouter.post("/fetch_grp_member_dtls_disb", async (req, res) => {
    var data = req.body;

    //FETCH GROUPWISE DISBURSE DATA OF MEMBER
    var select = "a.payment_date transaction_date,a.payment_id,c.group_name,b.loan_id,e.client_name,a.debit amt,b.tot_emi total_emi,a.created_by creted_code,d.emp_name created_by",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code",
    whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'D' AND b.group_code = '${data.group_code}' AND a.payment_date = '${dateFormat(data.payment_date, 'yyyy-mm-dd')}'`,
    order = null;
    var fetch_grp_memb__disb_dt = await db_Select(select,table_name,whr,order);

    res.send(fetch_grp_memb__disb_dt);

});

loan_disb_approveRouter.post("/fetch_memberwise_disburse_admin", async (req, res) => {
    var data = req.body;

        //FETCH MEMBERWISE DISBURSE DATA 13.02.2025
        var select = "a.payment_date transaction_date,a.payment_id,c.group_name,b.loan_id,b.tot_emi total_emi,b.grt_form_no,e.member_code,e.client_name,a.debit amt,a.created_by creted_code,d.emp_name created_by",
        table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code",
        whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'D'`,
        order = null;
        var fetch_disb_memb_dt = await db_Select(select,table_name,whr,order);
   
        res.send(fetch_disb_memb_dt)
});

loan_disb_approveRouter.post("/fetch_branch_co_disb", async (req, res) => {
    var data = req.body;

     //FETCH BRANCHWISE CO NAME
    var select = "a.emp_id,a.emp_name,b.user_type",
    table_name = "md_employee a LEFT JOIN md_user b ON a.emp_id = b.emp_id",
    whr = `a.branch_id = '${data.branch_code}' AND b.user_type IN ('1','2','5') AND b.user_status = 'A'`,
    order = null;
    var branch_co_dt = await db_Select(select,table_name,whr,order);

    res.send(branch_co_dt)
});

loan_disb_approveRouter.post("/fetch_cowise_disb_data", async (req, res) => {
    var data = req.body;

     //FETCH COWISE DISBURSE DATA
     var select = "a.payment_date transaction_date,SUM(a.debit) debit_amt,b.group_code,a.created_by created_code,a.status,b.branch_code,b.purpose,b.scheme_id,b.fund_id,b.period,b.period_mode,b.curr_roi,SUM(b.tot_emi) total_emi,c.group_name,d.emp_name created_by,CONCAT(e.sub_purpose,'-',e.purpose_id)purpose_id,f.scheme_name",
     table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_purpose e ON b.purpose = e.purp_id LEFT JOIN md_scheme f ON b.scheme_id = f.scheme_id",
     whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'D' AND a.created_by = '${data.co_id}'`,
     order = `GROUP BY a.payment_date,b.group_code,a.created_by,a.status,b.branch_code,b.purpose,b.scheme_id,b.fund_id,b.period,b.period_mode,b.curr_roi,c.group_name,d.emp_name,e.purpose_id,f.scheme_name`;
     var fetch_co_dt = await db_Select(select,table_name,whr,order);
 
     res.send(fetch_co_dt);
});

loan_disb_approveRouter.post("/fetch_cowise_disb_member_dtls", async (req, res) => {
    var data = req.body;

    //FETCH COWISE RECOVERY DATA OF MEMBER
    var select = "a.payment_date transaction_date,a.payment_id,c.group_name,b.loan_id,e.client_name,a.debit amt,b.tot_emi total_emi,a.created_by creted_code,d.emp_name created_by",
    table_name = "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code",
    whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = 'D' AND a.created_by = '${data.co_id}' AND a.payment_date = '${dateFormat(data.payment_date, 'yyyy-mm-dd')}'`,
    order = null;
    var fetch_co_memb_dt_disb = await db_Select(select,table_name,whr,order);

    res.send(fetch_co_memb_dt_disb);

});

loan_disb_approveRouter.post("/approve_grpwise_disb", async (req, res) => {
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var data = req.body;
    // console.log(data,'data');

    //APPROVE GROUPWISE DISBURSE
    if (data.grpdt_disb.length > 0) {        
        for (let dt of data.grpdt_disb) {
        var select = "loan_id",
        table_name = "td_loan",
        whr = `branch_code = '${dt.branch_code}' AND group_code = '${dt.group_code}'`,
        order = null;
        var fetch_loan_id_disb = await db_Select(select,table_name,whr,order);

            if(fetch_loan_id_disb.suc > 0 && fetch_loan_id_disb.msg.length > 0){
                var loan_id_arr = fetch_loan_id_disb.msg.map(ldt => ldt.loan_id)
                // console.log(loan_id_arr,'arr');
                
                var table_name = "td_loan_transactions",
                fields = `status = 'A', approved_by = '${data.approved_by}', approved_at = '${datetime}'`,
                values = null,
                whr = `payment_date = '${dateFormat(dt.payment_date, 'yyyy-mm-dd')}' AND loan_id IN (${loan_id_arr.join(',')}) AND tr_type = 'D'`,
                flag = 1;
                var approve_dt_disb = await db_Insert(table_name,fields,values,whr,flag);
             }
        }
    }

    res.send(approve_dt_disb)
});

loan_disb_approveRouter.post("/approve_member_disb", async (req, res) => {
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var data = req.body;
    // console.log(data,'memdata');

    //APPROVE MEMBERWISE DISBURSE
    if (data.membdt_disb.length > 0) {        
        for (let dt of data.membdt_disb) {
                var table_name = "td_loan_transactions",
                fields = `status = 'A', approved_by = '${data.approved_by}', approved_at = '${datetime}'`,
                values = null,
                whr = `payment_date = '${dateFormat(dt.payment_date, 'yyyy-mm-dd')}' AND payment_id = '${dt.payment_id}' AND loan_id = '${dt.loan_id}' AND tr_type = 'D'`,
                flag = 1;
                var approve_dt_memb = await db_Insert(table_name,fields,values,whr,flag);
        }
    }

    res.send(approve_dt_memb)
});

// loan_disb_approveRouter.post("/reject_disb_transaction", async (req, res) => {
//     try {
//     const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
//     var data = req.body, del_loans_disb = {};
//     // console.log(data,'juju');
    
//     //REJECT DISBURSE TRANSACTION MEMBERWISE
//     if (data.reject_membdt_disb.length > 0) {   
//         var payment_date_arr = data.reject_membdt_disb.map(pdt => `'${dateFormat(pdt.payment_date, 'yyyy-mm-dd')}'`)
//         var loan_id_arr = data.reject_membdt_disb.map(pdt => `'${pdt.loan_id}'`)
//         var branch_code_arr = data.reject_membdt_disb.map(pdt => `'${pdt.branch_code}'`)

//         // console.log(payment_date_arr,loan_id_arr,branch_code_arr,'array');
        
    
//         var select = "a.loan_id,b.payment_date,b.payment_id,b.branch_id,b.particulars,b.credit,b.debit,b.prn_recov,b.intt_recov,b.balance,b.od_balance,b.intt_balance,b.tr_type,b.tr_mode,b.created_by",
//             table_name = "td_loan a, td_loan_transactions b",
//             whr = `a.branch_code = b.branch_id AND a.loan_id = b.loan_id AND a.branch_code IN (${branch_code_arr.join(',')}) AND b.payment_date IN (${payment_date_arr.join(',')}) AND a.loan_id IN (${loan_id_arr.join(',')}) AND b.tr_type IN ('D')`,
//             order = null;
//             var fetch_loans_disb = await db_Select(select,table_name,whr,order);

//             // console.log(fetch_loans,'fetch_loans');
            

//         if(fetch_loans_disb.suc > 0 && fetch_loans_disb.msg.length > 0){
            
//             for (let dt of fetch_loans_disb.msg) {
    
//                     var table_name = "td_reject_transactions",
//                     fields = `(payment_date,payment_id,branch_id,loan_id,particulars,credit,debit,prn_recov,intt_recov,balance,od_balance,intt_balance,tr_type,tr_mode,status,reject_remarks,rejected_by,rejected_at,created_by)`,
//                     values = `('${dateFormat(dt.payment_date, 'yyyy-mm-dd')}','${dt.payment_id}','${dt.branch_id}','${dt.loan_id}','${dt.particulars}','${dt.credit}','${dt.debit}','${dt.prn_recov}','${dt.intt_recov}','${dt.balance}','${dt.od_balance}','${dt.intt_balance}','${dt.tr_type}','${dt.tr_mode}','R','${data.reject_remarks.split("'").join("\\'")}','${data.rejected_by}','${datetime}','${dt.created_by}')`,
//                     whr = null,
//                     flag = 0;
//                     var reject_dt_disb = await db_Insert(table_name,fields,values,whr,flag);
               
//                     // console.log(reject_dt,'reject_dt');
                    
    
//                 if(reject_dt_disb.suc > 0 && reject_dt_disb.msg.length > 0){
//                     var table_name = "td_loan_transactions",
//                     whr = `payment_date = '${dateFormat(dt.payment_date, 'yyyy-mm-dd')}' AND payment_id = '${dt.payment_id}' AND loan_id = '${dt.loan_id}' AND tr_type = '${dt.tr_type}'`
//                     del_loans_disb = await db_Delete(table_name,whr);
//                 }

//                 // console.log(del_loans,'del');

//                 if(del_loans_disb.suc > 0 && del_loans_disb.msg.length > 0){
//                     var select = "loan_id,balance,od_balance,intt_balance,tr_type",
//                     table_name = "td_loan_transactions",
//                     whr = `loan_id = '${dt.loan_id}'`,
//                     order = `ORDER BY payment_id DESC
//                     LIMIT 1`;
//                     var last_row = await db_Select(select,table_name,whr,order)
//                 }

//                 // console.log(last_row,'last_row');

//                 if(last_row.suc > 0 && last_row.msg.length > 0){
//                     // console.log(last_row,'lass');
                    
//                     var prn_amt = last_row.msg[0].balance
//                     var od_prn_amt = last_row.msg[0].od_balance
//                     var intt_amt = last_row.msg[0].intt_balance
//                     var outstanding = parseFloat(prn_amt) + parseFloat(od_prn_amt) + parseFloat(intt_amt)

//                     var table_name = "td_loan",
//                     fields = `prn_amt = '${prn_amt}', od_prn_amt = '${od_prn_amt}', intt_amt = '${intt_amt}', outstanding = '${outstanding}', modified_by = '${data.rejected_by}', modified_dt = '${datetime}'`,
//                     values = null,
//                     whr = `loan_id = '${dt.loan_id}'`,
//                     flag = 1;
//                     var update_dt = await db_Insert(table_name,fields,values,whr,flag);
//                 }

//                 // console.log(update_dt,'reject');
                
//             }
//         }    
        
//     }

//     res.send(del_loans_disb)
// } catch (error) {
//     console.error("Error occurred:", error.message);
//     res.send({ success: false, error: error.message });
// }
// });

// loan_disb_approveRouter.post("/reject_grp_co_wise_disb", async (req, res) => {
//     try {
//     const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
//     var data = req.body, del_loan_disburse = {};
//     // console.log(data,'data');

//     //REJECT GROUPWISE / COWISE DISBURSE
//     if (data.reject_dt_disb.length > 0) {        
//         for (let dt of data.reject_dt_disb) {
//         var select = "a.loan_id,b.payment_date,b.payment_id,b.branch_id,b.particulars,b.credit,b.debit,b.prn_recov,b.intt_recov,b.balance,b.od_balance,b.intt_balance,b.tr_type,b.tr_mode,b.created_by"
//         table_name = "td_loan a, td_loan_transactions b",
//         whr = `a.branch_code = b.branch_id AND a.loan_id = b.loan_id AND a.branch_code = '${dt.branch_code}' AND a.group_code = '${dt.group_code}' AND b.payment_date = '${dateFormat(dt.payment_date, 'yyyy-mm-dd')}' AND b.tr_type IN ('D')`,
//         order = null;
//         var fetch_loan_disb = await db_Select(select,table_name,whr,order);
//         // console.log(fetch_loan,'fetchhh');
        

//             if(fetch_loan_disb.suc > 0 && fetch_loan_disb.msg.length > 0){
//                 for (let dts of fetch_loan_disb.msg) {

//                         var table_name = "td_reject_transactions",
//                         fields = `(payment_date,payment_id,branch_id,loan_id,particulars,credit,debit,prn_recov,intt_recov,balance,od_balance,intt_balance,tr_type,tr_mode,status,reject_remarks,rejected_by,rejected_at,created_by)`,
//                         values = `('${dateFormat(dts.payment_date, 'yyyy-mm-dd')}','${dts.payment_id}','${dts.branch_id}','${dts.loan_id}','${dts.particulars}','${dts.credit}','${dts.debit}','${dts.prn_recov}','${dts.intt_recov}','${dts.balance}','${dts.od_balance}','${dts.intt_balance}','${dts.tr_type}','${dts.tr_mode}','R','${data.reject_remarks.split("'").join("\\'")}','${data.rejected_by}','${datetime}','${dts.created_by}')`,
//                         whr = null,
//                         flag = 0;
//                         var reject_dt_disb = await db_Insert(table_name,fields,values,whr,flag);
//                         // console.log(reject_dt,'reject_dtt');
                        
    
//                         if(reject_dt_disb.suc > 0 && reject_dt_disb.msg.length > 0){
//                             var table_name = "td_loan_transactions",
//                             whr = `payment_date = '${dateFormat(dts.payment_date, 'yyyy-mm-dd')}' AND payment_id = '${dts.payment_id}' AND loan_id = '${dts.loan_id}' AND tr_type = '${dts.tr_type}'`
//                             del_loan_disburse = await db_Delete(table_name,whr);
//                         }
//                         // console.log(del_loan,'loans');

//                         if(del_loan_disburse.suc > 0 && del_loan_disburse.msg.length > 0){
//                             var select = "loan_id,balance,od_balance,intt_balance,tr_type",
//                             table_name = "td_loan_transactions",
//                             whr = `loan_id = '${dts.loan_id}'`,
//                             order = `ORDER BY payment_id DESC
//                             LIMIT 1`;
//                             var last_rows = await db_Select(select,table_name,whr,order)
//                         }
        
//                         // console.log(last_rows,'last_row');
        
//                         if(last_rows.suc > 0 && last_rows.msg.length > 0){
//                             // console.log(last_rows,'lasst');
                            
//                             var prn_amt = last_rows.msg[0].balance
//                             var od_prn_amt = last_rows.msg[0].od_balance
//                             var intt_amt = last_rows.msg[0].intt_balance
//                             var outstanding = parseFloat(prn_amt) + parseFloat(od_prn_amt) + parseFloat(intt_amt)
        
//                             var table_name = "td_loan",
//                             fields = `prn_amt = '${prn_amt}', od_prn_amt = '${od_prn_amt}', intt_amt = '${intt_amt}', outstanding = '${outstanding}', modified_by = '${data.rejected_by}', modified_dt = '${datetime}'`,
//                             values = null,
//                             whr = `loan_id = '${dts.loan_id}'`,
//                             flag = 1;
//                             var update_dts = await db_Insert(table_name,fields,values,whr,flag);
//                         }
        
//                         // console.log(update_dts,'update');
                        
//                 }
//              }
//         }
//     }

//     res.send(del_loan_disburse)
// } catch (error) {
//     console.error("Error occurred:", error.message);
//     res.send({ success: false, error: error.message });
// }
// });

// loan_disb_approveRouter.post("/reject_list", async (req, res) => {
//     var data = req.body;

//     var select = "payment_date,payment_id,branch_id,loan_id,credit,tr_type,status,reject_remarks",
//     table_name = "td_reject_transactions",
//     whr = `status = 'R'`,
//     order = null;
//     var reject_list_dt = await db_Select(select,table_name,whr,order);

//     res.send(reject_list_dt)
// });

module.exports = {loan_disb_approveRouter}