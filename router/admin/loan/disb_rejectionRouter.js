const { db_Select, db_Delete, db_Insert } = require('../../../model/mysqlModel');

const express = require('express'),
disb_rejectRouter = express.Router(),
dateFormat = require('dateformat');

//fetch group details
disb_rejectRouter.post("/fetch_group_name_fr_disb_reject", async (req, res) => {
    try{
     var data = req.body;
    //  console.log(data,'data');

    if(data.branch_code == '100'){
    var select = "branch_code,group_name,group_code",
    table_name = "md_group",
    whr = `(group_name like '%${data.grps_name}%' OR group_code like '%${data.grps_name}%')`,
    order = null;
    var group_name = await db_Select(select,table_name,whr,order);
    }else{
    var select = "branch_code,group_name,group_code",
    table_name = "md_group",
    whr = `branch_code = '${data.branch_code}' AND (group_name like '%${data.grps_name}%' OR group_code like '%${data.grps_name}%')`,
    order = null;
    var group_name = await db_Select(select,table_name,whr,order);
    }
    res.send(group_name)
    }catch(error){
     console.error("Error fetching group name:", error);
     res.send({ suc: 0, msg: "An error occurred" });
    }
});

//fetch all disb rejection data
// disb_rejectRouter.post("/fetch_reject_disb_transactions_data", async (req, res) => {
//     try{
//      var data = req.body;
//     //  console.log(data,'data');

//      //fetch loan id from td_loan table
//      var select = "loan_id",
//      table_name = "td_loan",
//      whr = data.branch_code == '100' ? `group_code = '${data.group_code}'` : `branch_code = '${data.branch_code}' AND group_code = '${data.group_code}'`,
//      order = null;
//      var loan_details = await db_Select(select,table_name,whr,order);
     
//      const finalResults = []; 
//      // loop started
//      if(loan_details.suc > 0 && loan_details.msg.length > 0){
//          for (let dt of loan_details.msg) {  
             
//              // fetch data to show when search via group name

//                  var select = "a.payment_date transaction_date,a.payment_id transaction_id,a.loan_id,a.tr_type,a.debit,a.credit,a.created_by created_code,b.emp_name created_by",
//                  table_name = "td_loan_transactions a LEFT JOIN md_employee b ON a.created_by = b.emp_id",
//                  whr = `a.loan_id IN (${dt.loan_id}) AND a.status = 'U' AND a.tr_type = 'D'`,
//                  order = null;
//                  var loan_rejection_dtls = await db_Select(select,table_name,whr,order);
                
//                  if (loan_rejection_dtls.suc > 0) {
//                      finalResults.push(...loan_rejection_dtls.msg);
//                  }
//          }
//          //end loop
//          if (finalResults.length > 0) {
//              res.send({ suc: 1, msg: "Data fetched successfully", data: finalResults });
//          } else {
//              res.send({ suc: 0, msg: "No unapproved transaction data found" });
//          }
//      }else {
//          res.send({ suc: 0, msg: "No loan id found" });
//      } 
//     }catch(error){
//      console.error("Error fetching transaction details for reject:", error);
//      res.send({ suc: 0, msg: "An error occurred" });
//     }
// });


disb_rejectRouter.post("/fetch_reject_disb_transactions_data", async (req, res) => {
    try{
     var data = req.body;
    //  console.log(data,'data');

    // Check if this branch is already closed for this month
    const currentMonth = dateFormat(new Date(), "yyyy-mm-dd"); 
    const monthCheck = await db_Select("branch_code,closed_upto","td_month_close",`branch_code='${data.branch_code}' AND closed_upto >='${currentMonth}'`,
      null
    );

    if (monthCheck.suc > 0 && monthCheck.msg.length > 0) {
      return res.send({
        suc: 0,
        msg: "Not possible because already month closed for this branch",
      });
    }

     //fetch loan id from td_loan table
     var select = "loan_id",
     table_name = "td_loan",
     whr = data.branch_code == '100' ? `group_code = '${data.group_code}'` : `branch_code = '${data.branch_code}' AND group_code = '${data.group_code}'`,
     order = null;
     var loan_details = await db_Select(select,table_name,whr,order);
     
     const finalResults = []; 
     // loop started
     if(loan_details.suc > 0 && loan_details.msg.length > 0){
         for (let dt of loan_details.msg) {  

            //Step 1: Check if any Recovery (R) already exists for this loan
            var recoveryCheck = await db_Select("loan_id","td_loan_transactions",
            `loan_id IN (${dt.loan_id}) AND tr_type = 'R'`,null);

            if (recoveryCheck.suc > 0 && recoveryCheck.msg.length > 0) {
          // 🔹 If Recovery exists, send message and stop loop
          return res.send({
            suc: 0,
            msg: "Already done recovery in this group",
            });
           }

           // Step 2: Fetch Disbursement (D) transactions if no Recovery found
            var select =
            "a.payment_date transaction_date,a.payment_id transaction_id,a.loan_id,a.tr_type,a.debit,a.credit,a.created_by created_code,b.emp_name created_by",
          table_name =
            "td_loan_transactions a LEFT JOIN md_employee b ON a.created_by = b.emp_id",
          whr = `a.loan_id = ${dt.loan_id} AND a.status = 'U' AND a.tr_type = 'D'`,
          order = null;

        var loan_rejection_dtls = await db_Select(select, table_name, whr, order);

        if (loan_rejection_dtls.suc > 0) {
          finalResults.push(...loan_rejection_dtls.msg);
        }
      }
         //end loop
         if (finalResults.length > 0) {
             res.send({ suc: 1, msg: "Data fetched successfully", data: finalResults });
         } else {
             res.send({ suc: 0, msg: "No unapproved transaction data found" });
         }
     }else {
         res.send({ suc: 0, msg: "No loan id found" });
     } 
    }catch(error){
     console.error("Error fetching transaction details for reject:", error);
     res.send({ suc: 0, msg: "An error occurred" });
    }
});

//reject selected disbursement transaction
disb_rejectRouter.post("/reject_disb_transactions", async (req, res) => {
   try{
   const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
   var data = req.body;
   let del_loan = {}, del_loans = {};
   let errors = [];
//    console.log(data,'data');

   if (!data.reject_disb_trans || data.reject_disb_trans.length === 0) {
    return res.send({ suc: 0, msg: "No transactions to reject" });
   }

    // loop 1 through each transaction to be rejected
    for(let dt of data.reject_disb_trans){

    //extract values from dt object
    var payment_date_arr = [`'${dateFormat(dt.payment_date, 'yyyy-mm-dd')}'`];
    var loan_id_arr = [`'${dt.loan_id}'`];
    var payment_id_arr = [`'${dt.payment_id}'`];

    // select all transaction details 
    var select = "*",
    table_name = "td_loan_transactions",
    whr = `payment_date IN (${payment_date_arr.join(',')}) AND payment_id IN (${payment_id_arr.join(',')}) AND loan_id IN (${loan_id_arr.join(',')}) AND tr_type = 'D' AND status = 'U'`,
    order = null;
    var fetch_loans = await db_Select(select,table_name,whr,order);

    if(fetch_loans.suc > 0 && fetch_loans.msg.length > 0){
        //loop 2 through each transaction details insert reject transaction table
        for (let dts of fetch_loans.msg) {
            // console.log(dts,'dts');
            
          var table_name = "td_reject_transactions",
          fields = `(payment_date,payment_id,branch_id,loan_id,particulars,credit,debit,bank_charge,proc_charge,prn_recov,intt_recov,balance,od_balance,intt_balance,tr_type,tr_mode,bank_name,cheque_id,chq_dt,status,reject_remarks,delete_status,deleted_by,deleted_at,rejected_by,rejected_at,approved_by,approved_at,created_by,created_at,modified_by,modified_at,trn_lat,trn_long,trn_addr)`,
          values = `('${dateFormat(dts.payment_date, 'yyyy-mm-dd')}','${dts.payment_id}','${dts.branch_id}','${dts.loan_id}','${dts.particulars}','${dts.credit}','${dts.debit}','${dts.bank_charge}','${dts.proc_charge}','${dts.prn_recov}','${dts.intt_recov}','${dts.balance}','${dts.od_balance}','${dts.intt_balance}','${dts.tr_type}','${dts.tr_mode}','${dts.bank_name}','${dts.cheque_id}','${dts.chq_dt ? dateFormat(dts.chq_dt, 'yyyy-mm-dd') : null}','R','${data.reject_remarks ? data.reject_remarks.split("'").join("\\'") : ''}','${dts.delete_status}','${dts.deleted_by}',${dts.deleted_dt ? `'${dateFormat(dts.deleted_dt, 'yyyy-mm-dd')}'` : 'NULL'},'${data.rejected_by}','${datetime}','${dts.approved_by}',${dts.approved_at ? `'${dateFormat(dts.approved_at, 'yyyy-mm-dd')}'` : 'NULL'},'${dts.created_by}', ${dts.created_at ? `'${dateFormat(dts.created_at, 'yyyy-mm-dd')}'` : 'NULL'},'${dts.modified_by}',  ${dts.modified_at ? `'${dateFormat(dts.modified_at, 'yyyy-mm-dd')}'` : 'NULL'},'${dts.trn_lat}','${dts.trn_long}','${dts.trn_addr}')`,
          whr = null,
          flag = 0;
          var insert_reject_dt = await db_Insert(table_name,fields,values,whr,flag);

           //if insert is successful then delete from td_loan_transactions table
                if(insert_reject_dt.suc > 0){
                    var table_name = "td_loan_transactions",
                    whr = `payment_date = '${dateFormat(dt.payment_date, 'yyyy-mm-dd')}' AND payment_id = '${dt.payment_id}' AND loan_id = '${dt.loan_id}'`
                    del_loan = await db_Delete(table_name,whr);

                    var table_name = "td_loan",
                    whr = `loan_id = '${dt.loan_id}'`
                    del_loans = await db_Delete(table_name,whr);
                } else {
                  errors.push(`Failed to insert rejected transaction for payment_id ${dts.payment_id}`);
                }
            }
    } else {
       errors.push(`Data not fetched from td_loan_transactions for loan_id ${dt.loan_id}`);
       }
    }
  if (errors.length > 0) {
            res.send({ suc: 0, msg: "Some errors occurred during rejection process", errors });
          } else {
            res.send({ suc: 1, msg: "Transactions rejected successfully" });
          }
    }catch(error){
     console.error("Error fetching transaction details for reject:", error);
     res.send({ suc: 0, msg: "An error occurred" });
    } 
});

// search reject disb transactions

disb_rejectRouter.post("/search_reject_disb_trans", async (req, res) => {
 try{
   var data = req.body;
  //  console.log(data,'data_loan');
   
   var select = `a.payment_date,a.payment_id,c.branch_name,b.group_code,d.group_name,a.loan_id,b. member_code,e.client_name,a.credit,a.reject_remarks,a.created_by created_code,f.emp_name created_by,a.created_at,a.rejected_by rejected_code,g.emp_name rejected_by,a.rejected_at`,
   table_name = `td_reject_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_id = c.branch_code LEFT JOIN md_group d ON b.group_code = d.group_code LEFT JOIN md_member e ON b.member_code = e.member_code LEFT JOIN md_employee f ON a.created_by = f.emp_id LEFT JOIN md_employee g ON a.rejected_by = g.emp_id`,
   whr = `a.branch_id IN (${data.branch_code.join(",")}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = 'D'`,
   order = `ORDER BY a.payment_date desc`;
   var search_reject_data = await db_Select(select,table_name,whr,order);
   res.send({ search_reject_data})
 }catch(error){
  console.error("Error fetching search loan transaction:", error);
  res.send({ suc: 0, msg: "An error occurred" });;
 }
});

module.exports = {disb_rejectRouter}