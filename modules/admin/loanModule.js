var dateFormat = require("dateformat");
const { getLoanCode, interest_cal_amt, total_emi, installment_end_date, calculate_prn_emi, calculate_intt_emi } = require("../api/masterModule");
const { db_Insert } = require("../../model/mysqlModel");

module.exports = {
    loan_trans: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            let loan_code = await getLoanCode(data.branch_code);
            let intt_cal_amt = await interest_cal_amt(data.prn_disb_amt,data.period,data.curr_roi);
            // let tot_emi = await total_emi(data.prn_disb_amt,data.period,data.intt_cal_amt);
            let instl_end_dt = await installment_end_date(data.LAST_DAY(NOW()),data.period_mode,data.period);
            let prn_emi = await calculate_prn_emi(data.prn_disb_amt,data.period);
            let intt_emi = await calculate_intt_emi(data.intt_cal_amt,data.period);
            let tot_emi = prn_emi + intt_emi

            var table_name = "td_loan",
            fields = data.loan_code > 0 ? `purpose = '${data.purpose}', sub_purpose = '${data.sub_purpose}', applied_amt = '${data.applied_amt == '' ? 0 : data.applied_amt}', applied_dt = '${datetime}',
            scheme_id = '${data.scheme_id}', fund_id = '${data.fund_id}', period = '${data.period == '' ? 0 : data.period}', curr_roi = '${data.curr_roi == '' ? 0 : data.curr_roi}', od_roi = '${data.od_roi == '' ? 0 : data.od_roi}', disb_dt = '${datetime}', prn_disb_amt = '${data.prn_disb_amt == '' ? 0 : data.prn_disb_amt}', intt_cal_amt = '${intt_cal_amt}', prn_amt = '${data.prn_disb_amt == '' ? 0 : data.prn_disb_amt}', old_prn_amt = '${data.old_prn_amt == '' ? 0 : data.old_prn_amt}', od_dt = '0', intt_amt = '${intt_cal_amt}', od_intt_amt = '${data.od_intt_amt == '' ? 0 : data.od_intt_amt}', prn_emi = '${prn_emi == '' ? 0 : prn_emi}', intt_emi = '${intt_emi == '' ? 0 : intt_emi}', tot_emi = '${tot_emi == '' ? 0 : tot_emi}', period_mode = '${data.period_mode}', instl_start_dt = LAST_DAY(NOW()), instl_end_dt = '${instl_end_dt}', last_trn_dt = '${datetime}', modified_by = '${data.created_by}', modified_dt = '${datetime}'` : `(loan_id,branch_code,group_code,member_code,grt_form_no,purpose,sub_purpose,applied_amt,applied_dt,scheme_id,fund_id,period,curr_roi,od_roi,disb_dt,prn_disb_amt,intt_cal_amt,prn_amt,old_prn_amt,od_dt,intt_amt,od_intt_amt,prn_emi,intt_emi,tot_emi,period_mode,instl_start_dt,instl_end_dt,last_trn_dt,created_by,created_at)`,
            values = `('${loan_code}','${data.branch_code == '' ? 0 : data.branch_code}','${data.group_code == '' ? 0 : data.group_code}','${data.member_code == '' ? 0 : data.member_code}','${data.grt_form_no == '' ? 0 : data.grt_form_no}','${data.purpose}','${data.sub_purpose}','${data.applied_amt == '' ? 0 : data.applied_amt}','${datetime}','${data.scheme_id}','${data.fund_id}','${data.period == '' ? 0 : data.period}','${data.curr_roi == '' ? 0 : data.curr_roi}','${data.od_roi == '' ? 0 : data.od_roi}','${datetime}','${data.prn_disb_amt == '' ? 0 : data.prn_disb_amt}','${intt_cal_amt}','${data.prn_disb_amt == '' ? 0 : data.prn_disb_amt}','${data.old_prn_amt == '' ? 0 : data.old_prn_amt}','0','${intt_cal_amt}','${data.od_intt_amt == '' ? 0 : data.od_intt_amt}','${prn_emi == '' ? 0 : prn_emi}','${intt_emi == '' ? 0 : intt_emi}','${tot_emi == '' ? 0 : tot_emi}','${data.period_mode}',LAST_DAY(NOW()),'${instl_end_dt}','${datetime}','${data.created_by}','${datetime}')`,
            whr = data.loan_code > 0 ? `loan_id = ${data.loan_code}` : null,
            flag = data.loan_code > 0 ? 1 : 0;
            var trans_dt = await db_Insert(table_name,fields,values,whr,flag);

            if(trans_dt.suc > 0 && trans_dt.msg.length > 0){
                var table_name = "td_loan_transactions",
                fields = data.loan_code > 0 ? `payment_date = '${datetime}', particulars = '${data.particulars.split("'").join("\\'")}', credit = '0', debit = '${data.prn_disb_amt == '' ? 0 : data.prn_disb_amt}', bank_charge = '${data.bank_charge}', proc_charge = '${data.proc_charge}', prn_recov = '0', intt_recov = '0', balance = '0', recov_upto = '0', tr_type = '${data.tr_type}', tr_mode = '${data.tr_mode}', cheque_id = '${data.cheque_id == '' ? 0 : data.cheque_id}', chq_dt = '${data.chq_dt == '' ? null : data.chq_dt}', deposit_by = '${data.deposit_by}', bill_no = '${data.bill_no = '' ? 0 : data.bill_no}', modified_by = '${data.created_by}', modified_at = '${datetime}'` : `(payment_date,payment_id,branch_id,loan_id,particulars,credit,debit,bank_charge,proc_charge,prn_recov,intt_recov,balance,recov_upto,tr_type,tr_mode,cheque_id,chq_dt,deposit_by,bill_no,status,created_by,created_at,trn_lat,trn_long)`,
                values = `('${datetime}', '${payment_id}', '${data.branch_code == '' ? 0 : data.branch_code}', '${loan_code}', '${data.particulars.split("'").join("\\'")}', '0', '${data.prn_disb_amt == '' ? 0 : data.prn_disb_amt}', '${data.bank_charge}', '${data.proc_charge}', '0', '0', '0', '${datetime}', '${data.tr_type}', '${data.tr_mode}', '${data.cheque_id == '' ? 0 : data.cheque_id}', '${data.chq_dt == '' ? null : data.chq_dt}', '${data.deposit_by}', '${data.bill_no = '' ? 0 : data.bill_no}', 'U', '${data.created_at}', '${datetime}', '${data.trn_lat}', '${data.trn_long}')`,
                whr = data.loan_code > 0 ? `loan_id = ${data.loan_code}` : null,
                flag = data.loan_code > 0 ? 1 : 0;
                var dtls = await db_Insert(table_name,fields,values,whr,flag);
            }

            resolve(trans_dt)
        });
    }
}