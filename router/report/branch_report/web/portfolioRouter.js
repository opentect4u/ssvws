const { db_Delete, db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
portfolioRouter = express.Router(),
dateFormat = require('dateformat');

portfolioRouter.post("/call_proc_portfolio", async (req, res) => {
    try {
         var data = req.body;
        //  console.log(data,'juju');

        if (!data.branches || !Array.isArray(data.branches) || data.branches.length === 0) {
            return res.send({ suc: 0, msg: "Invalid input data" });
        }

        //Delete existing data against branch_code
        const branchCodes = data.branches.map(b => `'${b.branch_code}'`).join(",");
        var delete_data = await db_Delete('tt_portfolio',null);

        //Call procedure in a loop for each branch_code
        for (let dt of data.branches) {
            var insert_portfolio_data = await db_Select(null,null,null,null,true,`CALL p_portfolio('${dt.branch_code}','${data.from_dt}','${data.to_dt}')`);
        }
        res.send({ suc: 1, msg: "Portfolio Procedure called successfully" });
    }catch (error) {
        console.error("Error fetching on portfolio procedure:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

//groupwise portfolio report 05.06.2025

portfolioRouter.post("/groupwise_portfolio_report", async (req, res) => {
    try {
        var data = req.body;
        console.log(data,'data_grp');

        var select = "a.from_dt,a.to_dt,a.branch_cd,b.scheme_name,a.cust_type,a.group_cd,c.group_name,a.sb_ac_no,a.loan_ac_no,c.bank_name,a.applied_dt,SUM(a.applied_amt)applied_amt,a.disb_dt,SUM(a.disb_amt)disb_amt,SUM(a.proc_charge)proc_charge,SUM(a.service_charge)service_charge,a.intt_rt,SUM(a.tot_emi)tot_emi,e.fund_name,f.purpose_id,a.co_id,a.co_name,SUM(a.demand)demand,SUM(a.open_bal)open_bal,SUM(a.dr_amt)Disbursement within the period,SUM(a.prn_recov)prn_recov,SUM(a.intt_recov)intt_recov,SUM(a.prn_recov) + SUM(a.intt_recov)Recovery within the period,SUM(a.prn_amt)prn_amt,SUM(a.intt_amt)intt_amt,SUM(a.prn_amt) + SUM(a.intt_amt) Outstanding,SUM(a.overdue_amt),a.od_dt First overdue date,a.od_trf_dt Overdue transfer date,a.loan_end_dt Loan end date,a.last_trn_dt Last tranaction date",
        table_name = "tt_portfolio a LEFT JOIN md_scheme b ON a.scheme_id = b.scheme_id LEFT JOIN md_group c ON a.group_cd  = c.group_code LEFT JOIN md_fund e ON a.fund_id   = e.fund_id LEFT JOIN md_purpose f ON a.purpose   = f.purp_id",
        whr = `a.branch_cd IN (${data.branch_code})`,
        order =  `GROUP BY a.from_dt,a.branch_cd,b.scheme_name,a.cust_type,a.group_cd,c.group_name,a.sb_ac_no,a.loan_ac_no,c.bank_name,a.applied_dt,
       a.disb_dt,a.intt_rt,e.fund_name,f.purpose_id,a.co_id,a.co_name,a.od_dt,a.od_trf_dt,a.loan_end_dt,a.last_trn_dt
       ORDER BY a.disb_dt`;
        var group_portfolio_data = await db_Select(select,table_name,whr,order);
        res.send({suc : 1, msg: group_portfolio_data});
    }catch (error){
        console.error("Error fetching on groupwise portfolio report:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

module.exports = {portfolioRouter}