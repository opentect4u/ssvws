var dateFormat = require("dateformat");
const { getLoanCode } = require("../api/masterModule");
const { db_Insert } = require("../../model/mysqlModel");

module.exports = {
    loan_trans: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let loan_code = await getLoanCode(data.branch_code)

            var table_name = "td_loan",
            fields = `(loan_id,branch_code,group_code,member_code,grt_form_no,purpose,sub_purpose,applied_amt,applied_dt,scheme_id,fund_id,period,curr_roi,od_roi,disb_dt,prn_disb_amt,intt_cal_amt,prn_amt,old_prn_amt,od_dt,intt_amt,od_intt_amt,prn_emi,intt_emi,tot_emi,period_mode,instl_start_dt,instl_end_dt,last_trn_dt,created_by,created_at)`,
            values = `('${loan_code}','${data.branch_code}','${data.group_code == '' ? 0 : data.group_code}','${data.member_code == '' ? 0 : data.member_code}','${data.grt_form_no == '' ? 0 : data.grt_form_no}','${data.purpose}','${data.sub_purpose}','${data.applied_amt}','${datetime}','${data.scheme_id}','${data.fund_id}','${data.period == '' ? 0 : data.period}','${data.curr_roi == '' ? 0 : data.curr_roi}','${data.od_roi == '' ? 0 : data.od_roi}','${datetime}','${data.prn_disb_amt == '' ? 0 : data.prn_disb_amt}','${data.intt_cal_amt == '' ? 0 : data.intt_cal_amt}','${data.prn_amt == '' ? 0 : data.prn_amt}','${data.old_prn_amt == '' ? 0 : data.old_prn_amt}','0','${data.intt_amt == '' ? 0 : data.intt_amt == '' ? 0 : data.intt_amt}','${data.od_intt_amt == '' ? 0 : data.od_intt_amt}','${data.prn_emi == '' ? 0 : data.prn_emi}','${data.intt_emi == '' ? 0 : data.intt_emi}','${data.tot_emi == '' ? 0 : data.tot_emi}','${data.period_mode}','${data.instl_start_dt}','${data.instl_end_dt}','${data.last_trn_dt}','${data.created_by}','${datetime}')`,
            whr = null,
            flag = 0;
            var trans_dt = await db_Insert(table_name,fields,values,whr,flag);

            resolve(trans_dt)
        });
    }
}