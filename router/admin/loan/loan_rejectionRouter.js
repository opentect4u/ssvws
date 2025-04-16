const { db_Select } = require('../../../model/mysqlModel');

const express = require('express'),
loan_rejectionRouter = express.Router(),
dateFormat = require('dateformat');

loan_rejectionRouter.post("/reject_loan_transactions", async (req, res) => {
    try {
        var data = req.body;

        //fetch loan id from td_loan table
        var select = "loan_id",
        table_name = "td_loan",
        whr = `branch_code = '${data.branch_code}' AND group_code = '${data.group_code}'`,
        order = null;
        var loan_details = await db_Select(select,table_name,whr,order);
        
        const finalResults = [];

        // loop started
        if(loan_details.suc > 0 && loan_details.msg.length > 0){
            for (let dt of loan_details.msg) {

                //fetch maximum payment date
                var select = "max(payment_date) payment_date",
                table_name = "td_loan_transactions",
                whr = `loan_id = '${dt.loan_id}'`,
                order = null;
                var payment_date_dtls = await db_Select(select,table_name,whr,order);

                //fetch payment_id
                if(payment_date_dtls.suc > 0 && payment_date_dtls.msg.length > 0){
                   var latestPayDate = payment_date_dtls.msg[0].payment_date;

                   var select = "max(payment_id) payment_id",
                   table_name = "td_loan_transactions",
                   whr = `loan_id = '${dt.loan_id}' AND payment_date = '${dateFormat(
                          latestPayDate,"yyyy-mm-dd")}'`,
                   order = null;
                   var payment_id_dtls = await db_Select(select,table_name,whr,order);

                // fetch data to show when search via group name
                if(payment_id_dtls.suc > 0 && payment_id_dtls.msg.length > 0){
                    var latestpay_id = payment_id_dtls.msg[0].payment_id;

                    var select = "a.payment_date transaction_date,a.payment_id transaction_id,a.loan_id,a.debit,a.credit,a.created_by created_code,b.emp_name created_by",
                    table_name = "td_loan_transactions a LEFT JOIN md_employee b ON a.created_by = b.emp_code",
                    whr = `payment_date = '${dateFormat(latestPayDate,"yyyy-mm-dd")}' AND payment_id = '${latestpay_id}'`,
                    order = null;
                    var loan_rejection_dtls = await db_Select(select,table_name,whr,order);
                   
                    if (loan_rejection_dtls.suc > 0) {
                        finalResults.push(...loan_rejection_dtls.msg);
                    }
                }else {
                  res.send({ suc: 0, msg: "No data found against particular payment date and id" });

                }
                }else {
                  res.send({ suc: 0, msg: "No payment id found" });
                }
            }
            //end loop
            if (finalResults.length > 0) {
                res.send({ suc: 1, msg: "Data fetched successfully", data: finalResults });
            } else {
                res.send({ suc: 0, msg: "No transaction data found" });
            }
        }else {
            res.send({ suc: 0, msg: "No loan id found" });
        }
    }catch(error){
        console.error("Error fetching loan:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }    
});

module.exports = {loan_rejectionRouter}