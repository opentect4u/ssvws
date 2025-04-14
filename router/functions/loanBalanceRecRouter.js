const { db_Select, db_Insert } = require("../../model/mysqlModel"),
dateFormat = require("dateformat");

const loanBalanceRecRouter = require("express").Router();

loanBalanceRecRouter.get('/loan_balance_rec', async (req, res) => {
    var errorData = []
    var loan_out_miss_data = await db_Select(null, null, null, null, true, `SELECT * FROM tt_loan_out_mis WHERE branch_code = 117`)

    for(let missDt of loan_out_miss_data.msg){
        try{
            var loan_month_balance_sql = `SELECT * FROM td_loan_month_balance WHERE loan_id = '${missDt.loan_id}' AND branch_code = ${missDt.branch_code} AND balance_date = '2025-01-31'`;

            var loan_month_balance_data = await db_Select(null, null, null, null, true, loan_month_balance_sql)

            // console.log(loan_month_balance_data.suc > 0 && loan_month_balance_data.msg.length > 0, loan_month_balance_data.suc > 0, loan_month_balance_data.msg.length > 0);
            if (loan_month_balance_data.suc > 0 && loan_month_balance_data.msg.length > 0){
                
                let opening_prn_amt = loan_month_balance_data.msg[0].prn_amt
                let opening_intt_amt = loan_month_balance_data.msg[0].intt_amt
                let opening_outstanding = loan_month_balance_data.msg[0].outstanding

                var loan_transaction_sql = `SELECT * FROM td_loan_transactions WHERE loan_id = '${missDt.loan_id}' AND payment_date <= '2025-02-28' AND prn_recov > 0 AND intt_recov > 0 ORDER BY payment_date,payment_id`
                var loan_transaction_data = await db_Select(null, null, null, null, true, loan_transaction_sql)
                // console.log(loan_transaction_data);
                
                if (loan_transaction_data.suc > 0 && loan_transaction_data.msg.length > 0){
                    let curr_prn_amt = opening_prn_amt,
                        curr_intt_amt = opening_intt_amt,
                        curr_outstanding = opening_outstanding;
                    let i = 0
                    for (let trnDt of loan_transaction_data.msg){
                        curr_prn_amt = curr_prn_amt - trnDt.prn_recov
                        curr_intt_amt = curr_intt_amt - trnDt.intt_recov
                        // curr_outstanding = curr_prn_amt + curr_intt_amt
                        try{
                            await db_Insert('td_loan_transactions', `balance = ${curr_prn_amt}, intt_balance = ${curr_intt_amt}, modified_by = 'System', modified_at = '${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}'`, null, `payment_date = '${dateFormat(new Date(trnDt.payment_date), 'yyyy-mm-dd')}' AND payment_id = ${trnDt.payment_id}`, 1)
                        }catch(err){
                            errorData.push({loan_id: missDt.loan_id, error: err, msg: 'Error in updating loan transaction balance'})
                        }
                    }
                    // console.log('loan_id:', missDt.loan_id, 'opening_prn_amt:', opening_prn_amt, 'opening_intt_amt:', opening_intt_amt, 'opening_outstanding:', opening_outstanding, 'curr_prn_amt:', curr_prn_amt, 'curr_intt_amt:', curr_intt_amt, 'curr_outstanding:', curr_outstanding);
                    
                }else{
                    errorData.push({ loan_id: missDt.loan_id, error: loan_transaction_data.msg, msg: 'Might be no data found in transaction table' })
                }
                // return;
            }else{
                errorData.push({ loan_id: missDt.loan_id, error: loan_month_balance_data.msg, msg: 'Might be no data found loan month balance table' })
            }
        }catch(err){
            errorData.push({loan_id: missDt.loan_id, error: err})
        }
    }
    res.send(errorData)
})

module.exports = {loanBalanceRecRouter}