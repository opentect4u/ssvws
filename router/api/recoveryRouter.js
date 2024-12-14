const { db_Select, db_Insert } = require('../../model/mysqlModel');
const { getLoanDmd } = require('../../modules/api/masterModule');
const { recovery_trans } = require('../../modules/api/recoveryModule');

const express = require('express'),
recoveryRouter = express.Router(),
dateFormat = require('dateformat');

// recoveryRouter.post("/search_group_app", async (req, res) => {
//     var data = req.body;

//     // var select = "a.group_code,b.group_name,SUM(a.prn_amt + a.od_prn_amt) AS total_prn_amt,SUM(a.intt_amt + a.od_intt_amt) AS total_intt_amt,c.status,b.group_type",
//     // table_name = "td_loan a JOIN md_group b ON a.branch_code = b.branch_code AND a.group_code = b.group_code  JOIN td_loan_transactions c ON a.branch_code = c.branch_id AND a.loan_id = c.loan_id",
//     // whr = `(b.group_code like '%${data.grp_dtls}%' OR b.group_name like '%${data.grp_dtls}%') AND c.status = 'A'`,
//     var select = "a.group_code,a.group_name,a.group_type,SUM(b.prn_amt + b.od_prn_amt) AS total_prn_amt,SUM(b.intt_amt + b.od_intt_amt) AS total_intt_amt,c.status",
//     table_name = "md_group a JOIN td_loan b ON a.branch_code = b.branch_code AND a.group_code = b.group_code JOIN td_loan_transactions c ON b.branch_code = c.branch_id AND b.loan_id = c.loan_id",
//     whr = `a.group_code like '%${data.grp_dtls}%' OR a.group_name like '%${data.grp_dtls}%' AND c.status = 'A'`
//     order = `GROUP BY a.group_code, a.group_name, a.group_type, c.status`;
//     var search_grp = await db_Select (select,table_name,whr,order);

//     if(search_grp.suc > 0 && search_grp.msg.length > 0){
//         for(let dt of search_grp.msg){
        
//             // var select = "a.loan_id,a.member_code,a.period,a.curr_roi,a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.od_prn_amt,a.intt_amt,a.od_intt_amt,a.prn_emi,a.intt_emi,a.tot_emi,a.period,a.period_mode,a.instl_paid,a.instl_end_dt,a.last_trn_dt,b.client_name,c.status, c.balance, c.intt_balance, c.payment_date",
//             // table_name = "td_loan a, md_member b, td_loan_transactions c",
//             // whr = `a.branch_code = b.branch_code 
//             // AND a.member_code = b.member_code
//             // AND a.group_code = ${dt.group_code}
//             // AND c.payment_date = (SELECT MAX(d.payment_date) FROM td_loan_transactions d WHERE a.branch_code = d.branch_id AND a.loan_id = d.loan_id)`,

//             var select = "a.loan_id,a.member_code,a.period,a.curr_roi,a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.od_prn_amt,a.intt_amt,a.od_intt_amt,a.prn_emi,a.intt_emi,a.tot_emi,a.period,a.period_mode,a.instl_paid,a.instl_end_dt,a.last_trn_dt,b.client_name,c.balance",
//             table_name = "td_loan a, md_member b, td_loan_transactions c",
//             whr = `a.branch_code = b.branch_code 
//             AND a.member_code = b.member_code
//             AND a.loan_id = c.loan_id
//             AND a.branch_code = c.branch_id
//             AND a.group_code = ${dt.group_code}
//             AND c.tr_type = 'D'`,
//             order = null;
//             var mem_dt = await db_Select(select,table_name,whr,order);

//        dt['memb_dtls'] = mem_dt.suc > 0 ? (mem_dt.msg.length > 0 ? mem_dt.msg : []) : [];
            
//         }
//     }

// res.send(search_grp)
// });

// recoveryRouter.post("/search_group_app", async (req, res) => {
//     var data = req.body;

//     var select = "a.group_code,a.group_name,a.group_type,SUM(b.prn_amt + b.od_prn_amt) AS total_prn_amt,SUM(b.intt_amt + b.od_intt_amt) AS total_intt_amt,c.status",
//     table_name = "md_group a JOIN td_loan b ON a.branch_code = b.branch_code AND a.group_code = b.group_code JOIN td_loan_transactions c ON b.branch_code = c.branch_id AND b.loan_id = c.loan_id",
//     whr = `a.group_code like '%${data.grp_dtls}%' OR a.group_name like '%${data.grp_dtls}%' AND c.status = 'A'`
//     order = `GROUP BY a.group_code, a.group_name, a.group_type, c.status`;
//     var search_grp = await db_Select (select,table_name,whr,order);

//     if(search_grp.suc > 0 && search_grp.msg.length > 0){
//         for(let dt of search_grp.msg){

//             var select = "a.loan_id,a.member_code,a.period,a.curr_roi,a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.od_prn_amt,a.intt_amt,a.od_intt_amt,a.prn_emi,a.intt_emi,a.tot_emi,a.period,a.period_mode,a.instl_paid,a.instl_end_dt,a.last_trn_dt,b.client_name,c.balance",
//             table_name = "td_loan a, md_member b, td_loan_transactions c",
//             whr = `a.branch_code = b.branch_code 
//             AND a.member_code = b.member_code
//             AND a.loan_id = c.loan_id
//             AND a.branch_code = c.branch_id
//             AND a.group_code = ${dt.group_code}
//             AND c.tr_type = 'D'`,
//             order = null;
//             var mem_dt = await db_Select(select,table_name,whr,order);

//        dt['memb_dtls'] = mem_dt.suc > 0 ? (mem_dt.msg.length > 0 ? mem_dt.msg : []) : [];
            
//         }
//     }

// res.send(search_grp)
// });

recoveryRouter.post("/search_group_app", async (req, res) => {
    var data = req.body;

    var select = "a.group_code,a.group_name,a.group_type,SUM(b.prn_amt + b.od_prn_amt) AS total_prn_amt,SUM(b.intt_amt + b.od_intt_amt) AS total_intt_amt,c.status",
        table_name = "md_group a JOIN td_loan b ON a.branch_code = b.branch_code AND a.group_code = b.group_code JOIN td_loan_transactions c ON b.branch_code = c.branch_id AND b.loan_id = c.loan_id",
        whr = `a.group_code like '%${data.grp_dtls}%' OR a.group_name like '%${data.grp_dtls}%' AND c.status = 'A'`,
        order = `GROUP BY a.group_code, a.group_name, a.group_type, c.status`;

    var search_grp = await db_Select(select, table_name, whr, order);

    if (search_grp.suc > 0 && search_grp.msg.length > 0) {
        for (let dt of search_grp.msg) {
            // var select = "a.loan_id,a.member_code,a.period,a.curr_roi,a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.od_prn_amt,a.intt_amt,a.od_intt_amt,a.prn_emi,a.intt_emi,a.tot_emi,a.period,a.period_mode,a.instl_paid,a.instl_end_dt,a.last_trn_dt,b.client_name,c.balance",
            //     table_name = "td_loan a, md_member b, td_loan_transactions c",
            //     whr = `a.branch_code = b.branch_code 
            //     AND a.member_code = b.member_code 
            //     AND a.loan_id = c.loan_id
            //     AND a.branch_code = c.branch_id
            //     AND a.group_code = ${dt.group_code}
            //     AND c.payment_date = (SELECT MAX(d.payment_date) FROM td_loan_transactions d WHERE a.loan_id=d.loan_id AND a.branch_code = d.branch_id)`,
            //     order = null;

            var select = "a.loan_id,a.member_code,a.period,a.curr_roi,a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.od_prn_amt,a.intt_amt,a.od_intt_amt,a.prn_emi,a.intt_emi,a.tot_emi,a.period,a.period_mode,a.instl_paid,a.instl_end_dt,a.last_trn_dt,b.client_name",
            table_name = "td_loan a, md_member b",
            whr = `a.branch_code = b.branch_code 
            AND a.member_code = b.member_code
            AND a.group_code = ${dt.group_code}`,
            order = null;

            var mem_dt = await db_Select(select, table_name, whr, order);
            dt['memb_dtls'] = mem_dt.suc > 0 ? (mem_dt.msg.length > 0 ? mem_dt.msg : []) : [];

           for(let dts of mem_dt.msg){
            var select = "balance",
            table_name = "td_loan_transactions",
            whr = `loan_id = '${dts.loan_id}'
            AND payment_date = (SELECT MAX(payment_date) FROM td_loan_transactions WHERE loan_id = '${dts.loan_id}'
            AND tr_type != 'I')`
            order = null;

            var balance_dt = await db_Select(select, table_name, whr, order);
            dt['balance_dtls'] = balance_dt.suc > 0 ? (balance_dt.msg.length > 0 ? balance_dt.msg : []) : [];
           }

            for (let memb of dt.memb_dtls) {
                var demandData = await getLoanDmd(memb.loan_id, data.get_date);
                memb['demand'] = demandData || {}; 
            }
        }

        res.send({ suc: 1, msg: search_grp.msg }); 
    } else {
        res.send({ suc: 0, msg: "No data found" });
    }
});

recoveryRouter.post("/recovery_transaction", async (req, res) => {
    var data = req.body,res_dt;
    recovery_trans(data).then(data => {
        res_dt = data
    }).catch(err => {
        res_dt = err
    }).finally (() => {
        res.send(res_dt)
    })

});

recoveryRouter.post("/view_transaction", async (req, res) => {
    var data = req.body;

    var select = "a.loan_id,a.member_code,a.period,a.curr_roi,a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.od_prn_amt,a.intt_amt,a.od_intt_amt,a.outstanding,a.prn_emi,a.intt_emi,a.tot_emi,a.recovery_day,a.period,a.period_mode,a.instl_paid,a.instl_start_dt,a.instl_end_dt,a.last_trn_dt,b.client_name,c.credit,c.debit,c.prn_recov,c.intt_recov,c.balance,c.intt_balance,c.recov_upto,c.tr_type,c.status,c.payment_date,c.trn_lat,c.trn_long,c.trn_addr",
    table_name = "td_loan a, md_member b, td_loan_transactions c",
    whr = `a.branch_code = b.branch_code 
        AND a.member_code = b.member_code
        AND a.branch_code = c.branch_id 
        AND a.loan_id = c.loan_id
        ${data.loan_id > 0 ? `AND a.loan_id = '${data.loan_id}'` : ''}
        AND c.status = '${data.approval_status}'
        AND c.tr_type = 'R'
        AND c.delete_status = 'N'`,
    order = "Order BY a.member_code";
    var view_dt = await db_Select(select,table_name,whr,order);

    res.send(view_dt)
});

recoveryRouter.post("/remove_trans", async (req, res) => {
    var data = req.body;
    console.log(data);
    

    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    
    var table_name = "td_loan_transactions",
    fields = `particulars = '${data.particulars.split("'").join("\\'")}', delete_status = 'Y', deleted_by = '${data.deleted_by}', deleted_at = '${datetime}'`,
    values = null,
    whr = `loan_id = '${data.loan_id}' AND status != 'A'`,
    flag = 1;
    var delete_dt = await db_Insert(table_name,fields,values,whr,flag);

    res.send(delete_dt);
});

recoveryRouter.post("/get_demand_data", async (req, res) => {
    try {
        var data = req.body;
        // console.log(data,'data');

        var dayQuery = `EXTRACT(DAY FROM '${dateFormat(data.get_date, "yyyy-mm-dd")}') AS recovday`;
        // console.log(dayQuery);
        var dayResult = await db_Select(dayQuery);
        // console.log(dayResult);
        var recov_day = dayResult.msg[0].recovday;
        // console.log(recov_day,'recov');
        
        var select = "a.loan_id,a.group_code,a.member_code,a.recovery_day,a.period_mode,b.group_name",
        table_name = "td_loan a JOIN md_group b ON a.branch_code = b.branch_code AND a.group_code = b.group_code",
        whr = `a.recovery_day = '${recov_day}' AND a.outstanding > 0`,
        order = null;
        var get_dmd_dt = await db_Select(select,table_name,whr,order);
        // console.log(get_dmd_dt);
        
        if (get_dmd_dt.suc > 0 && get_dmd_dt.msg.length > 0) {
            let demandResults = [];

            for (dt of get_dmd_dt.msg) {
                // console.log(dt,'dt');
                
                var loan_id = dt.loan_id;
                var group_code = dt.group_code;
                var group_name = dt.group_name;
                var member_code = dt.member_code;
                var recovery_day = dt.recovery_day;
                var period = dt.period_mode;

                // var grp_dt = `${group_code}(${group_name})`;

                var demandData = await getLoanDmd(loan_id,data.get_date);
                demandResults.push({ loan_id, recovery_day, group_name, group_code, member_code, period, demand: demandData });
            }
            let groupedResults = demandResults.reduce((acc, item) => {
                if (!acc[item.group_code]) {
                    acc[item.group_code] = [];
                }
                acc[item.group_code].push(item);
                return acc;
            }, {});
            
            res.send({ suc: 1, msg: groupedResults });
        }else {
            res.send({ suc: 0, msg: "No data found" });
        }
        }catch (error) {
            console.error("Error in demand data retrieval:", error);
            res.status(500).send({ suc: 0, msg: "Internal server error" });
        }
});

// recoveryRouter.post("/group_wise_recov_app", async (req, res) => {
//     var data = req.body, grp_recov_dt;
//     console.log(data,'group');


//     if(data.user_id == '1'){
//         var select = "a.group_code,a.member_code,b.credit,c.group_name,d.client_name",
//         table_name = "td_loan a JOIN td_loan_transactions b ON a.branch_code = b.branch_id AND a.loan_id = b.loan_id JOIN md_group c ON a.branch_code = c.branch_code AND a.group_code = c.group_code JOIN md_member d ON a.branch_code = d.branch_code AND a.member_code = d.member_code",
//         whr = `date(b.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'
//         AND b.tr_type= 'R' 
//         AND b.tr_mode = '${data.tr_mode}'
//         AND b.created_by = '${data.emp_id}'`,
//         order = null;
//         grp_recov_dt = await db_Select(select,table_name,whr,order);
//     }else if (data.user_id == '2' && data.flag == 'O'){
//         var select = "a.group_code,a.member_code,b.credit,c.group_name,d.client_name",
//         table_name = "td_loan a JOIN td_loan_transactions b ON a.branch_code = b.branch_id AND a.loan_id = b.loan_id JOIN md_group c ON a.branch_code = c.branch_code AND a.group_code = c.group_code JOIN md_member d ON a.branch_code = d.branch_code AND a.member_code = d.member_code",
//         whr = `date(b.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'
//         AND b.tr_type= 'R' 
//         AND b.tr_mode = '${data.tr_mode}'
//         AND b.created_by = '${data.emp_id}'`,
//         order = null;
//         grp_recov_dt = await db_Select(select,table_name,whr,order);
//     }else {
//         var select = "a.group_code,a.member_code,b.credit,c.group_name,d.client_name",
//         table_name = "td_loan a JOIN td_loan_transactions b ON a.branch_code = b.branch_id AND a.loan_id = b.loan_id JOIN md_group c ON a.branch_code = c.branch_code AND a.group_code = c.group_code JOIN md_member d ON a.branch_code = d.branch_code AND a.member_code = d.member_code",
//         whr = `date(b.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND b.tr_type= 'R'
//               AND b.tr_mode = '${data.tr_mode}' AND b.branch_id = '${data.branch_code}'`,
//         order = null;
//         grp_recov_dt = await db_Select(select,table_name,whr,order);
//     }
    
//     res.send(grp_recov_dt)
// });

recoveryRouter.post("/group_wise_recov_app", async (req, res) => {
    var data = req.body, grp_recov_dt;
    console.log(data,'group');


    if(data.user_id == '1'){
        var select = "SUM(a.credit) credit,SUM(a.balance) balance,b.group_code,c.group_name",
        table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code",
    whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'
         AND a.tr_type= 'R'
        AND a.tr_mode = '${data.tr_mode}'
        AND a.created_by = '${data.emp_id}'`,
        order = `GROUP BY b.group_code`;
        grp_recov_dt = await db_Select(select,table_name,whr,order);
    }else if (data.user_id == '2' && data.flag == 'O'){
        var select = "SUM(a.credit) credit,SUM(a.balance) balance,b.group_code,c.group_name",
        table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code",
    whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}'
         AND a.tr_type= 'R'
        AND a.tr_mode = '${data.tr_mode}'
        AND a.created_by = '${data.emp_id}'`,
        order = `GROUP BY b.group_code`;
        grp_recov_dt = await db_Select(select,table_name,whr,order);
    }else {
        var select = "SUM(a.credit) credit,SUM(a.balance) balance,b.group_code,c.group_name",
        table_name = "td_loan_transactions a JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code",
        whr = `date(a.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type= 'R'
              AND a.tr_mode = '${data.tr_mode}' AND a.branch_id = '${data.branch_code}'`,
        order = `GROUP BY b.group_code`;
        grp_recov_dt = await db_Select(select,table_name,whr,order);
    }
    
    res.send(grp_recov_dt)
});

recoveryRouter.post("/memb_wise_recov_app", async (req, res) => {
    var data = req.body;

    var select = "a.group_code,a.group_name,a.group_type,SUM(b.prn_amt + b.od_prn_amt) AS total_prn_amt,SUM(b.intt_amt + b.od_intt_amt) AS total_intt_amt,c.status",
    table_name = "md_group a JOIN td_loan b ON a.branch_code = b.branch_code AND a.group_code = b.group_code JOIN td_loan_transactions c ON b.branch_code = c.branch_id AND b.loan_id = c.loan_id",
    whr = `a.group_code like '%${data.grp_dtls_app}%' OR a.group_name like '%${data.grp_dtls_app}%' AND c.status = 'A'`
    order = `GROUP BY a.group_code, a.group_name, a.group_type, c.status`;
    var search_grp_app = await db_Select (select,table_name,whr,order);


    if(search_grp_app.suc > 0 && search_grp_app.msg.length > 0){
        for(let dt of search_grp_app.msg){

            var select = "a.loan_id,a.member_code,b.client_name,c.credit,c.balance",
            table_name = "td_loan a, md_member b, td_loan_transactions c",
            whr = `a.branch_code = b.branch_code 
            AND a.member_code = b.member_code
            AND a.loan_id = c.loan_id
            AND a.branch_code = c.branch_id
            AND a.group_code = ${dt.group_code}
            AND date(c.payment_date) BETWEEN '${data.from_dt}' AND '${data.to_dt}' 
            AND c.tr_type = 'R'`,
            order = null;
            var mem_dt_app = await db_Select(select,table_name,whr,order);

       dt['memb_dtls_app'] = mem_dt_app.suc > 0 ? (mem_dt_app.msg.length > 0 ? mem_dt_app.msg : []) : [];
            
        }
    }

res.send(search_grp_app)
});

module.exports = {recoveryRouter}