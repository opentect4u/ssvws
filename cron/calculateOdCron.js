const {db_Select, db_Insert} = require('../model/mysqlModel');
const { payment_code } = require('../modules/api/masterModule'),
dateFormat = require('dateformat');

const odCron = async () => {
    try {
        var curr_dt = dateFormat(new Date(), 'yyyy-mm-dd');
        var select = "loan_id, branch_code, prn_amt, intt_amt",
        table_name = "td_loan",
        whr = `instl_end_dt < DATE(NOW()) AND prn_amt > 0 AND od_prn_amt = 0 AND od_dt IS NULL`,
        order = null;
        var loan_dt = await db_Select(select, table_name, whr, order);
        // console.log(loan_dt, 'loan_dt');
        for(let dt of loan_dt.msg){
            var payment_id = await payment_code()
            if(payment_id){
                var fields = `(payment_date,payment_id,branch_id,loan_id,particulars,credit,debit,bank_charge,proc_charge,prn_recov,intt_recov,balance,od_balance,intt_balance,tr_type,tr_mode,status,created_by,created_at,approved_by,approved_at)`,
                values = `('${curr_dt}',${payment_id},${dt.branch_code},${dt.loan_id},'To OD',0,${dt.prn_amt},0,0,0,0,0,${dt.prn_amt},${dt.intt_amt},'O','B','A','System','${curr_dt}','System','${curr_dt}')`,
                whr = null,
                flag = 0;
                var ins_res = await db_Insert('td_loan_transactions', fields, values, whr, flag);
                if(ins_res.suc > 0){
                    var fields = `prn_amt = 0, od_prn_amt = ${dt.prn_amt}, od_dt = '${curr_dt}'`,
                    whr = `loan_id = ${dt.loan_id}`,
                    flag = 1;
                    var upd_res = await db_Insert('td_loan', fields, null, whr, flag);
                    if(upd_res.suc > 0){
                        console.log(`OD created for loan_id: ${dt.loan_id}`);
                    }
                }
            }
        }
        process.exit(1)
    } catch (error) {
        console.error("Error fetching loan outstanding report:", error);
        process.exit(1)
    }
}

odCron();