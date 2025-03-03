var dateFormat = require("dateformat");
const { getLoanCode, interest_cal_amt, total_emi, installment_end_date, calculate_prn_emi, calculate_intt_emi, payment_code, periodic, genDate } = require("../api/masterModule");
const { db_Insert } = require("../../model/mysqlModel");

module.exports = {
    // loan_trans: (data) => {
    //     return new Promise(async (resolve, reject) => {
    //         let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    //         //  console.log(data,'kiki');
             
    //         var curr_date = new Date()
    //         var last_date = new Date(curr_date.getFullYear(), curr_date.getMonth()+1, 0)
            
    //         var selectedMode = periodic.filter(dt => dt.id == data.period_mode)
            
    //         var inst_end_date = new Date(curr_date.getFullYear(), curr_date.getMonth()+1, 0)
    //         switch (data.period_mode) {
    //             case 'Monthly':
    //                 inst_end_date.setMonth((last_date.getMonth() + (data.period / selectedMode[0].div_period)))
    //                 break;
    //             case 'Weekly':
    //                 inst_end_date.setDate((last_date.getDay() + ((data.period / selectedMode[0].div_period) * 7)))
    //                 break;
            
    //             default:
    //                 break;
    //         }


    //         // let instl_end_dt = await installment_end_date(last_date,data.period_mode,data.period);

    //         let loan_code = await getLoanCode(data.branch_code);
    //         let intt_cal_amt = await interest_cal_amt(data.prn_disb_amt,data.period,data.curr_roi,data.period_mode);
    //         // let tot_emi = await total_emi(data.prn_disb_amt,data.period,data.intt_cal_amt);
    //         let prn_emi = await calculate_prn_emi(data.prn_disb_amt,data.period);
    //         let intt_emi = await calculate_intt_emi(intt_cal_amt,data.period);
            

    //         if (isNaN(prn_emi) || isNaN(intt_emi)) {
    //             console.error("One of the values is not a number. Please check the calculate functions.");
    //         } else {
    //             var tot_emi = Math.round(parseFloat(prn_emi) + parseFloat(intt_emi));
    //             // console.log("Total EMI:", tot_emi);
    //         }
    //         // let tot_emi = Math.round(prn_emi + intt_emi);
    //         // console.log(tot_emi,'emi');
            
    //         let payment_id = await payment_code(data.branch_code)

    //         let outstanding = (parseFloat(data.prn_disb_amt)+parseFloat(data.old_prn_amt)+parseFloat(intt_cal_amt)+parseFloat(data.od_intt_amt))
    //         // console.log(outstanding,'outstanding');
            
    //         let instl_date = await genDate(data.period, data.period_mode, data.recovery_date, data.recovery_date);
    //         // console.log("Generated Dates:", instl_date); 
    //         const startDate = instl_date.emtStart;
    //         const endDate = instl_date.emiEnd;
            
    //         // console.log("Start Date:", startDate);
    //         // console.log("End Date:", endDate);

    //         var table_name = "td_loan",
    //         fields =`(loan_id,branch_code,group_code,member_code,grt_form_no,purpose,sub_purpose,applied_amt,applied_dt,scheme_id,fund_id,period,curr_roi,od_roi,disb_dt,prn_disb_amt,intt_cal_amt,prn_amt,od_prn_amt,od_dt,intt_amt,od_intt_amt,outstanding,prn_emi,intt_emi,tot_emi,recovery_day,period_mode,instl_start_dt,instl_end_dt,last_trn_dt,created_by,created_dt)`,
    //         values = `('${loan_code}','${data.branch_code == '' ? 0 : data.branch_code}','${data.group_code == '' ? 0 : data.group_code}','${data.member_code == '' ? 0 : data.member_code}','${data.grt_form_no == '' ? 0 : data.grt_form_no}','${data.purpose}','${data.sub_purpose}','${data.applied_amt == '' ? 0 : data.applied_amt}','${datetime}','${data.scheme_id}','${data.fund_id}','${data.period == '' ? 0 : data.period}','${data.curr_roi == '' ? 0 : data.curr_roi}','${data.od_roi == '' ? 0 : data.od_roi}','${datetime}','${data.prn_disb_amt == '' ? 0 : data.prn_disb_amt}','${intt_cal_amt}','${data.prn_disb_amt == '' ? 0 : data.prn_disb_amt}','${data.old_prn_amt == '' ? 0 : data.old_prn_amt}',NULL,'${intt_cal_amt}','${data.od_intt_amt == '' ? 0 : data.od_intt_amt}','${outstanding > 0 ? outstanding : 0}','${prn_emi == '' ? 0 : prn_emi}','${intt_emi == '' ? 0 : intt_emi}','${tot_emi > 0 ? tot_emi : 0}','${data.recovery_date}','${data.period_mode}', '${dateFormat(startDate, 'yyyy-mm-dd')}','${dateFormat(endDate, 'yyyy-mm-dd')}','${data.trans_date}','${data.created_by}','${datetime}')`,
    //         whr = null,
    //         flag = 0;
    //         var trans_dt = await db_Insert(table_name,fields,values,whr,flag);
    //         trans_dt["loan_id"] = loan_code;

    //         if(trans_dt.suc > 0 && trans_dt.msg.length > 0){
    //             var table_name = "td_loan_transactions",
    //             fields =`(payment_date,payment_id,branch_id,loan_id,particulars,credit,debit,bank_charge,proc_charge,prn_recov,intt_recov,balance,od_balance,intt_balance,tr_type,tr_mode,bank_name,cheque_id,chq_dt,status,created_by,created_at)`,
    //             values = `('${datetime}', '${payment_id}', '${data.branch_code == '' ? 0 : data.branch_code}', '${loan_code}', '${data.particulars.split("'").join("\\'")}', '0', '${data.prn_disb_amt > 0 ?  data.prn_disb_amt : 0}', '${data.bank_charge > 0 ? data.bank_charge : 0}', '${data.proc_charge > 0 ? data.proc_charge : 0}', '0', '0', '${data.prn_disb_amt > 0 ? data.prn_disb_amt : 0}', '0', '${intt_cal_amt}', '${data.tr_type}', '${data.tr_mode}', '${data.bank_name}', '${data.cheque_id == '' ? 0 : data.cheque_id}', ${data.chq_dt == '' ? null : `'${data.chq_dt}'`}, 'U', '${data.created_by}', '${datetime}')`,
    //             whr = null,
    //             flag = 0;
    //             var dtls = await db_Insert(table_name,fields,values,whr,flag);
    //         }

    //         resolve(trans_dt)
    //     });
    // },

    loan_trans: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            //  console.log(data,'kiki');

               var curr_date = new Date()
               var last_date = new Date(curr_date.getFullYear(), curr_date.getMonth()+1, 0)
            
            if(data.disbdtls.length > 0){   
                for (let dts of data.disbdtls) {
            var selectedMode = periodic.filter(dt => dt.id == data.period_mode)
            
            var inst_end_date = new Date(curr_date.getFullYear(), curr_date.getMonth()+1, 0)
            switch (data.period_mode) {
                case 'Monthly':
                    inst_end_date.setMonth((last_date.getMonth() + (data.period / selectedMode[0].div_period)))
                    break;
                case 'Weekly':
                    inst_end_date.setDate((last_date.getDay() + ((data.period / selectedMode[0].div_period) * 7)))
                    break;
            
                default:
                    break;
            }

            let loan_code = await getLoanCode(data.branch_code);
            let intt_cal_amt = await interest_cal_amt(dts.prn_disb_amt,data.period,data.curr_roi,data.period_mode);
            let prn_emi = await calculate_prn_emi(dts.prn_disb_amt,data.period);
            let intt_emi = await calculate_intt_emi(intt_cal_amt,data.period);
            

            if (isNaN(prn_emi) || isNaN(intt_emi)) {
                console.error("One of the values is not a number. Please check the calculate functions.");
            } else {
                var tot_emi = Math.round(parseFloat(prn_emi) + parseFloat(intt_emi));
            }
            
            let outstanding = (parseFloat(dts.prn_disb_amt)+parseFloat(data.old_prn_amt)+parseFloat(intt_cal_amt)+parseFloat(data.od_intt_amt))
            // console.log(outstanding,'outstanding');
            
            let instl_date = await genDate(data.period, data.period_mode, data.recovery_date, data.recovery_date);
            // console.log("Generated Dates:", instl_date); 
            const startDate = instl_date.emtStart;
            const endDate = instl_date.emiEnd;
            
            // console.log("Start Date:", startDate);
            // console.log("End Date:", endDate);

            var table_name = "td_loan",
            fields =`(loan_id,branch_code,group_code,member_code,grt_form_no,purpose,sub_purpose,applied_amt,applied_dt,scheme_id,fund_id,period,curr_roi,od_roi,disb_dt,prn_disb_amt,intt_cal_amt,prn_amt,od_prn_amt,od_dt,intt_amt,od_intt_amt,outstanding,prn_emi,intt_emi,tot_emi,recovery_day,period_mode,instl_start_dt,instl_end_dt,last_trn_dt,created_by,created_dt)`,
            values = `('${loan_code}','${data.branch_code == '' ? 0 : data.branch_code}','${data.group_code == '' ? 0 : data.group_code}','${dts.member_code == '' ? 0 : dts.member_code}','${dts.grt_form_no == '' ? 0 : dts.grt_form_no}','${data.purpose}','0','${dts.applied_amt == '' ? 0 : dts.applied_amt}','${datetime}','${data.scheme_id}','${data.fund_id}','${data.period == '' ? 0 : data.period}','${data.curr_roi == '' ? 0 : data.curr_roi}','${data.od_roi == '' ? 0 : data.od_roi}','${data.disb_dt}','${dts.prn_disb_amt == '' ? 0 : dts.prn_disb_amt}','${intt_cal_amt}','${dts.prn_disb_amt == '' ? 0 : dts.prn_disb_amt}','${data.old_prn_amt == '' ? 0 : data.old_prn_amt}',NULL,'${intt_cal_amt}','${data.od_intt_amt == '' ? 0 : data.od_intt_amt}','${outstanding > 0 ? outstanding : 0}','${prn_emi == '' ? 0 : prn_emi}','${intt_emi == '' ? 0 : intt_emi}','${tot_emi > 0 ? tot_emi : 0}','${data.recovery_date}','${data.period_mode}', '${dateFormat(startDate, 'yyyy-mm-dd')}','${dateFormat(endDate, 'yyyy-mm-dd')}','${data.trans_date}','${data.created_by}','${datetime}')`,
            whr = null,
            flag = 0;
            var trans_dt = await db_Insert(table_name,fields,values,whr,flag);
            trans_dt["loan_id"] = loan_code;

            if(trans_dt.suc > 0 && trans_dt.msg.length > 0){

                let payment_id = await payment_code()
                // console.log(payment_id,'pay_id22');
                
                var table_name = "td_loan_transactions",
                fields =`(payment_date,payment_id,branch_id,loan_id,particulars,credit,debit,bank_charge,proc_charge,prn_recov,intt_recov,balance,od_balance,intt_balance,tr_type,tr_mode,bank_name,cheque_id,status,created_by,created_at)`,
                values = `('${datetime}', '${payment_id}', '${data.branch_code == '' ? 0 : data.branch_code}', '${loan_code}', '${data.particulars.split("'").join("\\'")}', '0', '${dts.prn_disb_amt > 0 ?  dts.prn_disb_amt : 0}', '${data.bank_charge > 0 ? data.bank_charge : 0}', '${data.proc_charge > 0 ? data.proc_charge : 0}', '0', '0', '${dts.prn_disb_amt > 0 ? dts.prn_disb_amt : 0}', '0', '${intt_cal_amt}', 'D', 'B', '${data.bank_name}', '0', 'U', '${data.created_by}', '${datetime}')`,
                whr = null,
                flag = 0;
                var dtls = await db_Insert(table_name,fields,values,whr,flag);
            }
        }
            resolve(trans_dt)
        }else {
            reject({ "suc": 0, "msg": "No recovery details provided" });
        }
        });
    },

    save_loan_dtls: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            var table_name = "td_loan",
            fields = `purpose = '${data.purpose}', sub_purpose = '${data.sub_purpose}', fund_id = '${data.fund_id}', tot_emi = '${data.tot_emi}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'`,
            values = null,
            whr = `loan_id = '${data.loan_id}'`,
            flag = 1;
            var res_dt = await db_Insert(table_name,fields,values,whr,flag);

            resolve(res_dt)
            });
        }
}