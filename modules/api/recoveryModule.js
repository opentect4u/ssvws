var dateFormat = require("dateformat");
const { db_Insert, db_Select } = require("../../model/mysqlModel");
const { payment_code } = require("./masterModule");

module.exports = { 
    // recovery_trans: (data) => {
    //     return new Promise(async (resolve, reject) => {
    //         let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            
    //         let remaining_credit = data.credit;

    //         let rec_intt_amt = data.intt_amt;
    //         if (remaining_credit >= rec_intt_amt) {
    //             remaining_credit = remaining_credit - rec_intt_amt;;
    //             rec_intt_amt = 0;
    //         } else {
    //             rec_intt_amt = rec_intt_amt - remaining_credit;
    //             remaining_credit = 0;
    //         }

    //         let rec_prn_amt = data.prn_amt;
    //         if (remaining_credit > 0) {
    //             rec_prn_amt = rec_prn_amt >= remaining_credit ? rec_prn_amt - remaining_credit : 0;
    //             remaining_credit = 0;
    //         }

    //         let rec_outstanding = (parseFloat(rec_prn_amt)+parseFloat(rec_intt_amt))

    //         let instl_paid = (parseFloat(data.instl_paid) + 1);

    //         var table_name = "td_loan",
    //         fields = `prn_amt = '${rec_prn_amt}', intt_amt = '${rec_intt_amt}', outstanding = '${rec_outstanding}', instl_paid = '${instl_paid}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'`,
    //         values = null,
    //         whr = `loan_id = '${data.loan_id}'`,
    //         flag = 1;
    //         var recovery_dt = await db_Insert(table_name,fields,values,whr,flag);

    //         if(recovery_dt.suc > 0 && recovery_dt.msg.length > 0){

    //             var table_name = "td_loan_transactions",
    //             fields = `credit = '${data.credit}', prn_recov = '${rec_prn_amt}', intt_recov = '${rec_intt_amt}', recov_upto = '${datetime}', tr_type = 'R', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
    //             values = null,
    //             whr = `loan_id = '${data.loan_id}'`,
    //             flag = 1;
    //             var rec_dtls = await db_Insert(table_name,fields,values,whr,flag);
    //         }

    //         resolve(recovery_dt)
    //     });
    // }

    recovery_trans: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            let payment_id = await payment_code(data.branch_code)

            console.log(payment_id, 'payment_id');
            
            var table_name = "td_loan_transactions",
                fields = `(payment_date,payment_id,branch_id,loan_id,credit,debit,balance,intt_balance,tr_type,status,created_by,created_at,trn_lat,trn_long,trn_addr)`,
                values = `('${dateFormat(datetime, "yyyy-mm-dd")}','${payment_id}','${data.branch_code == '' ? 0 : data.branch_code}','${data.loan_id}','0','${data.intt_emi}','${data.balance > 0 ? data.balance : 0}','${data.intt_emi > 0 ? data.intt_emi : 0}','I','U','${data.created_by}','${datetime}','${data.trn_lat}','${data.trn_long}','${data.trn_addr.split("'").join("\\'")}')`,
                whr = null,
                flag = 0;
                var rec_dtls_int = await db_Insert(table_name,fields,values,whr,flag);

                if(rec_dtls_int.suc > 0 && rec_dtls_int.msg.length > 0){
                    payment_id = await payment_code(data.branch_code)

                    let prn_recov = parseFloat(data.balance) - parseFloat(data.prn_emi);

                    var table_name = "td_loan_transactions",
                    fields = `(payment_date,payment_id,branch_id,loan_id,credit,debit,prn_recov,intt_recov,balance,intt_balance,recov_upto,tr_type,tr_mode,bank_name,cheque_id,chq_dt,status,created_by,created_at,trn_lat,trn_long,trn_addr)`,
                    values = `('${datetime}','${payment_id}','${data.branch_code == '' ? 0 : data.branch_code}','${data.loan_id}','${data.credit}','0','${data.prn_emi > 0 ? data.prn_emi : 0}','${data.intt_emi > 0 ? data.intt_emi : 0}','${prn_recov > 0 ? prn_recov : 0}','0','${datetime}','R','${data.tr_mode}','${data.bank_name}','${data.cheque_id == '' ? 0 : data.cheque_id}', '${data.chq_dt == '' ? null : data.chq_dt}','U','${data.created_by}','${datetime}','${data.trn_lat}','${data.trn_long}','${data.trn_addr.split("'").join("\\'")}')`,
                    whr = null,
                    flag = 0;
                    var rec_dtls_prn = await db_Insert(table_name,fields,values,whr,flag);    
                }
    
            if(rec_dtls_prn.suc > 0 && rec_dtls_prn.msg.length > 0){

                let prn_recov = parseFloat(data.balance) - parseFloat(data.prn_emi);
                let intt_recov = parseFloat(data.intt_cal_amt) - parseFloat(data.intt_emi);
                let outstanding = parseFloat(prn_recov) + parseFloat(intt_recov);

                var table_name = "td_loan",
                fields = `prn_amt = '${prn_recov}', intt_amt = '${intt_recov}', outstanding = '${outstanding}', instl_paid = '${data.instl_paid}', last_trn_dt = '${data.last_trn_dt}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'`,
                values = null,
                whr = `loan_id = '${data.loan_id}'`,
                flag = 1;
                var rec_dt = await db_Insert(table_name,fields,values,whr,flag);
                // rec_dt["outstanding"] = outstanding;
                // rec_dt["instl_paid"] = data.instl_paid;
            }

            if(rec_dt.suc > 0 && rec_dt.msg.length > 0){
                var select = `a.loan_id,a.branch_code,a.group_code,a.member_code,a.instl_paid,a.outstanding,b.payment_date tnx_date,b.payment_id tnx_id,b.credit,b.balance curr_balance,c.group_name,d.branch_name,e.client_name,(
                SELECT SUM(i.balance + i.intt_balance)
                FROM td_loan_transactions i
                WHERE i.tr_type = 'I' AND i.loan_id = a.loan_id
            ) AS prev_balance`,
                table_name = "td_loan a JOIN td_loan_transactions b ON a.loan_id = b.loan_id AND a.branch_code = b.branch_id JOIN md_group c ON a.branch_code = c.branch_code AND a.group_code = c.group_code JOIN md_branch d ON a.branch_code = d.branch_code JOIN md_member e ON a.branch_code = e.branch_code AND a.member_code = e.member_code",
                whr = `a.loan_id = '${data.loan_id}' AND b.tr_type = 'R'`
                order = null;
                var trans_dtl = await db_Select(select,table_name,whr,order);

                rec_dtls_prn.msg[0]['trans_dtl'] = trans_dtl.suc > 0 ? (trans_dtl.msg.length > 0 ? trans_dtl.msg : []) : [];
            }

            resolve(trans_dtl)
        });
    }
}