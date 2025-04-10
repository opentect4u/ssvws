const { db_Select, db_Insert } = require("../../model/mysqlModel");

const express = require("express"),
recovery_scheduler = express.Router(),
dateFormat = require("dateformat");

recovery_scheduler.get("/update_recovery_negative_balance", async (req, res) => {
  try{
   var data = req.query;

   var select = "*",
      table_name = "td_loan",
      whr = `intt_amt < 0`,
      order = null;
    var fetch_loan_id = await db_Select(select, table_name, whr, order);

    if(fetch_loan_id.suc > 0 && fetch_loan_id.msg.length > 0){
        for(let dt of fetch_loan_id.msg){
            try {
             // Update prn_amt and set intt_amt to 0
            let updated_prn_amt = parseFloat(dt.prn_amt) + parseFloat(dt.intt_amt);
            let updated_intt_amt = 0;

            var table_name = "td_loan",
            fields = `prn_amt = '${updated_prn_amt}', intt_amt = '${updated_intt_amt}'`,
            values = null,
            whr = `loan_id = ${dt.loan_id}`,
            flag = 1;
            var update_data = await db_Insert(table_name,fields,values,whr,flag);
 
            // Update outstanding = updated_prn_amt + intt_amt (which is 0)
            let outstanding = updated_prn_amt + 0;
            var table_name = "td_loan",
            fields = `outstanding = '${outstanding}'`,
            values = null,
            whr = `loan_id = ${dt.loan_id}`,
            flag = 1;
            var update_outstanding = await db_Insert(table_name,fields,values,whr,flag);

            // select maximum payment date
            var select = "max(payment_date) payment_date",
            table_name = "td_loan_transactions",
            whr = `loan_id = '${dt.loan_id}' AND tr_type = 'R'`,
            order = null;
            var payment_dt_data = await db_Select(select, table_name, whr, order);

            // select maximum payment id
                var latestPaymentDate = payment_dt_data.msg[0].payment_date;

                var select = "max(payment_id) payment_id",
                table_name = "td_loan_transactions",
                whr = `loan_id = '${dt.loan_id}' AND tr_type = 'R' AND payment_date = '${dateFormat(latestPaymentDate,"yyyy-mm-dd")}'`,
                order = null;
                var pay_id_data = await db_Select(select, table_name, whr, order);
           
            // Update td_loan_transactions with final prn_amt, intt_amt
               let latestPaymentId = pay_id_data.msg[0].payment_id;
                var table_name = "td_loan_transactions",
                fields = `balance = '${updated_prn_amt}', intt_balance = '${updated_intt_amt}'`,
              values = null,
              whr = `loan_id = '${dt.loan_id}' AND payment_date = '${dateFormat(latestPaymentDate, "yyyy-mm-dd")}' AND payment_id = '${latestPaymentId}'`,
              flag = 1;
              var update_data_gain = await db_Insert(table_name,fields,values,whr,flag);
        }catch (err){
            console.error(`Error updating loan ${dt.loan_id}:`, err);
        }   
    }
    return res.json({ success: 1, message: "Negative balances processed and updated." });
   }else{
    return res.json({ success: 0, message: "No loans found with negative interest." });
   }
  }catch(error){
    console.error("Error:", error);
    return res.json({ success: 0, error: "Internal Server Error" });
  }
});

module.exports = {recovery_scheduler}