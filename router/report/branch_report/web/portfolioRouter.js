const { db_Delete, db_Select } = require('../../../../model/mysqlModel');
const { publishPortfolioReportJob } = require('../../../../model/queue/producer');

const express = require('express'),
portfolioRouter = express.Router(),
dateFormat = require('dateformat');

portfolioRouter.post("/call_proc_portfolio", async (req, res) => {
    try {
         var data = req.body;
         console.log(data,'juju');

        if (!data.branches || !Array.isArray(data.branches) || data.branches.length === 0) {
            return res.send({ suc: 0, msg: "Invalid input data" });
        }

         // ✅ Publish job to RabbitMQ 15.10.2025
        //  await publishPortfolioReportJob(data);
        //  console.log("Portfolio job sent to RabbitMQ queue:", data);
         
        //Delete existing data against branch_code
        const branchCodes = data.branches.map(b => `'${b.branch_code}'`).join(",");
        console.log(branchCodes,'branch');
        
        var delete_data = await db_Delete('tt_portfolio',null);

        //Call procedure in a loop for each branch_code
        for (let dt of data.branches) {
            var insert_portfolio_data = await db_Select(null,null,null,null,true,`CALL p_portfolio('${dt.branch_code}','${data.from_dt}','${data.to_dt}')`);
        }

        res.send({ suc: 1, msg: "Portfolio process request submitted successfully" });
    }catch (error) {
        console.error("Error sending portfolio job:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

// portfolioRouter.post("/call_proc_portfolio", async (req, res) => {
//     try {
//          var data = req.body;
//          console.log(data,'juju');

//         if (!data.branches || !Array.isArray(data.branches) || data.branches.length === 0) {
//             return res.send({ suc: 0, msg: "Invalid input data" });
//         }
         
//         //Delete existing data against branch_code
//         const branchCodes = data.branches.map(b => `'${b.branch_code}'`).join(",");
//         console.log(branchCodes,'branch');
        
//         var delete_data = await db_Delete('tt_portfolio',null);

//         let procQuery;

//         // ✅ Check if any branch_code is 'A'
//             if (branchCodes.length === 1 && branchCodes[0] === 'A') {
//              // If only 'A', call specific procedure
//              procQuery = `CALL p_portfolio_all('${data.from_dt}', '${data.to_dt}')`;
//             } else {
//             // Otherwise (1 or many branches, not 'A'), call another procedure
//             procQuery = `CALL p_portfolio(${branchCodes}, '${data.from_dt}', '${data.to_dt}')`;
//             }

//             console.log("Executing procedure:", procQuery);

//             // Execute the procedure
//           const result = await db_Select(null, null, null, null, true, procQuery)

//         //Call procedure in a loop for each branch_code
//         // for (let dt of data.branches) {
//         //     var insert_portfolio_data = await db_Select(null,null,null,null,true,`CALL p_portfolio('${dt.branch_code}','${data.from_dt}','${data.to_dt}')`);
//         // }

//         res.send({ suc: 1, msg: "Portfolio process request submitted successfully" });
//     }catch (error) {
//         console.error("Error sending portfolio job:", error);
//         res.send({ suc: 0, msg: "An error occurred" });
//     }
// });

//groupwise portfolio report 05.06.2025

portfolioRouter.post("/groupwise_portfolio_report", async (req, res) => {
    try {
        var data = req.body;
        console.log(data,'data_grp');

        // ✅ Validate input
                if (!data.branch_code || !data.from_dt || !data.to_dt) {
                    return res.send({
                        suc: 2,
                        msg: {
                            suc: 2,
                            msg: ["Please provide valid input"]
                        }
                    });
                }

        var select = `a.from_dt, a.to_dt, a.branch_cd, b.scheme_name, a.cust_type, a.group_cd, c.group_name, a.sb_ac_no,a.loan_ac_no, g.bank_name, a.applied_dt, SUM(a.applied_amt) AS applied_amt, a.disb_dt,
        SUM(a.disb_amt) AS disb_amt, SUM(a.proc_charge) AS proc_charge, SUM(a.service_charge) AS service_charge,
        a.intt_rt, SUM(a.tot_emi) AS tot_emi, e.fund_name, f.purpose_id, a.co_id, a.co_name,
        SUM(a.demand) AS demand, SUM(a.open_bal) AS open_bal,
        SUM(a.dr_amt) AS Disbursement_in_the_period,
        SUM(a.prn_recov) AS prn_recov, SUM(a.intt_recov) AS intt_recov,
        SUM(a.prn_recov) + SUM(a.intt_recov) AS Recovery_in_the_period,
        SUM(a.prn_amt) AS prn_amt, SUM(a.intt_amt) AS intt_amt,
        SUM(a.prn_amt) + SUM(a.intt_amt) AS Outstanding,
        SUM(a.overdue_amt) AS overdue_amt,
        a.od_dt AS First_overdue_date,
        a.od_trf_dt AS Overdue_transfer_date,
        a.loan_end_dt AS Loan_end_date`;
        table_name = "td_portfolio a LEFT JOIN md_scheme b ON a.scheme_id = b.scheme_id LEFT JOIN md_group c ON a.group_cd  = c.group_code LEFT JOIN md_fund e ON a.fund_id   = e.fund_id LEFT JOIN md_purpose f ON a.purpose   = f.purp_id LEFT JOIN md_bank g ON c.bank_name = g.bank_code",
        whr = `a.branch_cd IN (${data.branch_code}) AND a.from_dt = '${data.from_dt}' AND a.to_dt = '${data.to_dt}'`,
        order =  `GROUP BY a.from_dt,a.to_dt,a.branch_cd,b.scheme_name,a.cust_type,a.group_cd,c.group_name,a.sb_ac_no,a.loan_ac_no,g.bank_name,a.applied_dt,
       a.disb_dt,a.intt_rt,e.fund_name,f.purpose_id,a.co_id,a.co_name,a.od_dt,a.od_trf_dt,a.loan_end_dt
       ORDER BY a.disb_dt`;
        var group_portfolio_data = await db_Select(select,table_name,whr,order);

        if (!group_portfolio_data.msg || group_portfolio_data.msg.length === 0) {
            group_portfolio_data.suc = 0;
            group_portfolio_data.msg = [];
         return res.send({ suc: 1, msg: group_portfolio_data});
        }

        res.send({suc : 1, msg: group_portfolio_data});
    }catch (error){
        console.error("Error fetching on groupwise portfolio report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

//fundwise portfolio report 05.06.2025
portfolioRouter.post("/fundwise_portfolio_report", async (req, res) => {
 try{
    var data = req.body;
    console.log(data,'data_fund');

     // ✅ Validate input
                if (!data.branch_code || !data.fund_id || !data.from_dt || !data.to_dt) {
                    return res.send({
                        suc: 2,
                        msg: {
                            suc: 2,
                            msg: ["Please provide valid input"]
                        }
                    });
                }

    var select = "a.from_dt,a.to_dt,a.branch_cd,a.cust_type,a.group_cd,c.group_name,a.applied_dt,SUM(a.applied_amt)applied_amt,a.disb_dt,SUM(a.disb_amt)disb_amt,a.intt_rt,SUM(a.tot_emi)tot_emi,e.fund_name,a.co_id,a.co_name,SUM(a.demand)demand,SUM(a.open_bal)open_bal,SUM(a.dr_amt)Disbursement_within_the_period,SUM(a.prn_recov) + SUM(a.intt_recov) Recovery_within_the_period,SUM(a.prn_amt)prn_amt,SUM(a.intt_amt)intt_amt,SUM(a.prn_amt) + SUM(a.intt_amt) Outstanding,SUM(a.overdue_amt)overdue_amt,a.od_dt First_overdue_date,a.od_trf_dt Overdue_transfer_date,a.loan_end_dt Loan_end_date,a.last_trn_dt Last_tranaction_date",
    table_name = "td_portfolio a LEFT JOIN md_group c ON a.group_cd  = c.group_code LEFT JOIN md_fund e ON a.fund_id   = e.fund_id",
    whr = `a.branch_cd IN (${data.branch_code}) AND a.fund_id IN (${data.fund_id}) AND a.from_dt = '${data.from_dt}' AND a.to_dt = '${data.to_dt}'`,
    order = `GROUP BY a.from_dt,a.to_dt,a.branch_cd,a.cust_type,a.group_cd,c.group_name,a.applied_dt,
       a.disb_dt,a.intt_rt,e.fund_name,a.co_id,a.co_name,a.od_dt,a.od_trf_dt,a.loan_end_dt,a.last_trn_dt
       ORDER BY a.disb_dt`;
    var fund_portfolio_data = await db_Select(select,table_name,whr,order);

     if (!fund_portfolio_data.msg || fund_portfolio_data.msg.length === 0) {
            fund_portfolio_data.suc = 0;
            fund_portfolio_data.msg = [];
         return res.send({ suc: 1, msg: fund_portfolio_data});
        }

    res.send({suc : 1, msg: fund_portfolio_data}); 
 }catch(error){
    console.error("Error fetching on fundwise portfolio report:", error);
    res.send({ suc: 0, msg: "An error occurred"})
 }
});

//cowise portfolio report 05.06.2025
portfolioRouter.post("/cowise_portfolio_report", async (req, res) => {
try{
    var data = req.body;
    console.log(data,'data_cowise');

    // ✅ Validate input
                if (!data.branch_code || !data.co_id || !data.from_dt || !data.to_dt) {
                    return res.send({
                        suc: 2,
                        msg: {
                            suc: 2,
                            msg: ["Please provide valid input"]
                        }
                    });
                }

    var select = "a.from_dt,a.to_dt,a.branch_cd,a.cust_type,a.group_cd,c.group_name,a.applied_dt,SUM(a.applied_amt)applied_amt,a.disb_dt,SUM(a.disb_amt)disb_amt,a.intt_rt,SUM(a.tot_emi)tot_emi,a.co_id,a.co_name,SUM(a.demand)demand,SUM(a.open_bal)open_bal,SUM(a.dr_amt)Disbursement_within_the_period,SUM(a.prn_recov) + SUM(a.intt_recov) Recovery_within_the_period,SUM(a.prn_amt)prn_amt,SUM(a.intt_amt)intt_amt,SUM(a.prn_amt) + SUM(a.intt_amt) Outstanding,SUM(a.overdue_amt)overdue_amt,a.od_dt First_overdue_date,a.od_trf_dt Overdue_transfer_date,a.loan_end_dt Loan_end_date,a.last_trn_dt Last_tranaction_date",
    table_name = "td_portfolio a LEFT JOIN md_group c ON a.group_cd  = c.group_code",
    whr = `a.branch_cd IN (${data.branch_code}) AND a.co_id IN (${data.co_id}) AND a.from_dt = '${data.from_dt}' AND a.to_dt = '${data.to_dt}'`,
    order = `GROUP BY a.from_dt,a.to_dt,a.branch_cd,a.cust_type,a.group_cd,c.group_name,a.applied_dt,
       a.disb_dt,a.intt_rt,a.co_id,a.co_name,a.od_dt,a.od_trf_dt,a.loan_end_dt,a.last_trn_dt
       ORDER BY a.disb_dt`;
    var co_portfolio_data = await db_Select(select,table_name,whr,order);

     if (!co_portfolio_data.msg || co_portfolio_data.msg.length === 0) {
            co_portfolio_data.suc = 0;
            co_portfolio_data.msg = [];
         return res.send({ suc: 1, msg: co_portfolio_data});
        }

    res.send({suc : 1, msg: co_portfolio_data});    
}catch (error){
    console.error("Error fetching on cowise portfolio report:", error);
    res.send({ suc: 0, msg: "An error occurred"})
}
});

//memberwise portfolio report 05.06.2025
portfolioRouter.post("/memberwise_portfolio_report", async (req, res) => {
    try {
        var data = req.body;
        console.log(data,'data_mbr');

        // ✅ Validate input
                if (!data.branch_code || !data.from_dt || !data.to_dt) {
                    return res.send({
                        suc: 2,
                        msg: {
                            suc: 2,
                            msg: ["Please provide valid input"]
                        }
                    });
                }

        var select = "a.from_dt,a.to_dt,a.branch_cd,g.form_no,a.loan_id,b.scheme_name,a.cust_type,a.group_cd,c.group_name,a.memb_id,d.client_name,d.client_mobile,d.gurd_name,d.dob,d.religion,d.caste,d.husband_name,CONCAT(d.client_addr,'-Pin:',d.pin_no) Address,d.aadhar_no,d.pan_no,d.voter_id,c.acc_no1 sb_ac_no,c.acc_no2 loan_ac_no,h.bank_name,a.applied_dt,a.applied_amt,a.disb_dt,a.disb_amt,a.proc_charge,a. service_charge,a.intt_rt,a.tot_emi,e.fund_name,f.purpose_id,a.co_id,a.co_name,a.demand,a.open_bal,a.dr_amt Disbursement_within_the_period,a.prn_recov,a.intt_recov,(a.prn_recov + a.intt_recov) Recovery_within_the_period,a.prn_amt,a.intt_amt,(a.prn_amt + a.intt_amt) Outstanding,a.overdue_amt,a.od_dt First_overdue_date,a.od_trf_dt Overdue_transfer_date,a.loan_end_dt Loan_end_date,a.last_trn_dt Last_tranaction_date",
        table_name = "td_portfolio a LEFT JOIN md_scheme b ON a.scheme_id = b.scheme_id LEFT JOIN md_group c ON a.group_cd  = c.group_code LEFT JOIN md_member d ON a.memb_id   = d.member_code LEFT JOIN md_fund e ON a.fund_id   = e.fund_id LEFT JOIN md_purpose f ON a.purpose = f.purp_id LEFT JOIN td_grt_basic g ON a.memb_id = g.member_code LEFT JOIN md_bank h ON c.bank_name = h.bank_code",
        whr = `a.branch_cd IN (${data.branch_code}) AND a.from_dt = '${data.from_dt}' AND a.to_dt = '${data.to_dt}'`,
        order = `ORDER BY a.disb_dt`;
        var member_portfolio_data = await db_Select(select,table_name,whr,order);

        if (!member_portfolio_data.msg || member_portfolio_data.msg.length === 0) {
            member_portfolio_data.suc = 0;
            member_portfolio_data.msg = [];
         return res.send({ suc: 1, msg: member_portfolio_data});
        }

        res.send({suc : 1, msg: member_portfolio_data});
    }catch (error) {
        console.error("Error fetching on memberwise portfolio report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }    
});

//branchwise portfolio report 05.06.2025
portfolioRouter.post("/branchwise_portfolio_report", async (req, res) => {
    try{
        var data = req.body;
        console.log(data,'data_bran');

        // ✅ Validate input
                if (!data.branch_code || !data.from_dt || !data.to_dt) {
                    return res.send({
                        suc: 2,
                        msg: {
                            suc: 2,
                            msg: ["Please provide valid input"]
                        }
                    });
                }

        // var select = "a.from_dt,a.to_dt,a.branch_cd,d.branch_name,a.cust_type,a.group_cd,c.group_name,SUM(a.disb_amt)disb_amt,SUM(a.demand)demand,SUM(a.demand)demand,SUM(a.open_bal)open_bal,SUM(a.dr_amt)Disbursement_within_the_period,SUM(a.prn_recov) + SUM(a.intt_recov) Recovery_within_the_period,SUM(a.prn_amt)prn_amt,SUM(a.intt_amt)intt_amt,SUM(a.prn_amt) + SUM(a.intt_amt) Outstanding,SUM(a.overdue_amt)overdue_amt",
         var select = "a.from_dt,a.to_dt,a.branch_cd,d.branch_name,SUM(a.disb_amt)disb_amt,SUM(a.demand)demand,SUM(a.open_bal)open_bal,SUM(a.dr_amt)Disbursement_within_the_period,SUM(a.prn_recov) + SUM(a.intt_recov) Recovery_within_the_period,SUM(a.prn_amt)prn_amt,SUM(a.intt_amt)intt_amt,SUM(a.prn_amt) + SUM(a.intt_amt) Outstanding,SUM(a.overdue_amt)overdue_amt",
        table_name = "td_portfolio a LEFT JOIN md_branch d ON a.branch_cd = d.branch_code",
        whr = `a.branch_cd IN (${data.branch_code}) AND a.from_dt = '${data.from_dt}' AND a.to_dt = '${data.to_dt}'`,
        order = `GROUP BY a.from_dt,a.to_dt,a.branch_cd,d.branch_name`;
        var branch_portfolio_data = await db_Select(select,table_name,whr,order);

        if (!branch_portfolio_data.msg || branch_portfolio_data.msg.length === 0) {
            branch_portfolio_data.suc = 0;
            branch_portfolio_data.msg = [];
         return res.send({ suc: 1, msg: branch_portfolio_data});
        }

        res.send({suc : 1, msg: branch_portfolio_data});
    }catch (error) {
        console.error("Error fetching on branchwise portfolio report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }    
})
module.exports = {portfolioRouter}