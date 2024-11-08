var dateFormat = require("dateformat");
const { db_Insert } = require("../../model/mysqlModel");

module.exports = { 
    recovery_trans: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            
            let remaining_credit = data.credit;

            let rec_intt_amt = data.intt_amt;
            if (remaining_credit >= rec_intt_amt) {
                remaining_credit = remaining_credit - rec_intt_amt;;
                rec_intt_amt = 0;
            } else {
                rec_intt_amt = rec_intt_amt - remaining_credit;
                remaining_credit = 0;
            }

            let rec_prn_amt = data.prn_amt;
            if (remaining_credit > 0) {
                rec_prn_amt = rec_prn_amt >= remaining_credit ? rec_prn_amt - remaining_credit : 0;
                remaining_credit = 0;
            }

            let rec_outstanding = (parseFloat(data.rec_prn_amt)+parseFloat(data.rec_intt_amt))

            let instl_paid = data.instl_paid + 1;

            var table_name = "td_loan",
            fields = `prn_amt = '${rec_prn_amt}', intt_amt = '${data.rec_intt_amt}', outstanding = '${rec_outstanding}', instl_paid = '${instl_paid}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `loan_id = '${data.loan_id}'`,
            flag = 1;
            var recovery_dt = await db_Insert(table_name,fields,values,whr,flag);

            if(recovery_dt.suc > 0 && recovery_dt.msg.length > 0){

                var table_name = "td_loan_transactions",
                fields = `credit = '${data.credit}', prn_recov = '${data.prn_recov}', intt_recov = '${data.intt_recov}', recov_upto = '${data.recov_upto}', tr_type = 'R', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                values = null,
                whr = `loan_id = '${data.loan_id}'`,
                flag = 1;
                var rec_dtls = await db_Insert(table_name,fields,values,whr,flag);
            }

            resolve(recovery_dt)
        });
    }
}