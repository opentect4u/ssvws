const express = require('express'),
demandReportRouter = express.Router(),
dateFormat = require('dateformat');

const {db_Select} = require('../../model/mysqlModel');

//LOAN DEMAND REPORT 
demandReportRouter.post("/loan_demand_report_app_cowise", async (req, res) => {
    try {
        var data = req.body;
        // console.log(data,'co_app_data');
            
    
        var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 
    
        var dateResult = await db_Select(date_query);
        // console.log(dateResult, 'dmy');
        var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');
        // console.log("Created date:", create_date);
    
        var select = `a.group_cd,d.group_name,b.member_code,f.client_name,b.period_mode, 
        CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode IN ('Weekly','Fortnight') THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,b.week_no,(a.dmd_amt)dmd_amt`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_group d ON a.group_cd = d.group_code LEFT JOIN md_member f ON b.member_code = f.member_code",
        whr = `a.branch_code = '${data.branch_code}' AND d.co_id = '${data.co_id}' AND a.demand_date = '${create_date}'`,
        order = `ORDER BY a.branch_code,a.group_cd`;
        var cowise_demand_data = await db_Select(select,table_name,whr,order);
        res.send({cowise_demand_data})
            // Separate demand_date fetch
            // var demand_date_result = await db_Select("MAX(demand_date) AS demand_date", "td_loan_month_demand", `branch_code IN (${data.branch_code})`);
            // var demand_date = dateFormat(demand_date_result.msg[0].demand_date,'yyyy-mm-dd');
        }catch(error){
            console.error("Error fetching demand report cowise:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
});

// loan demand report cowise via day
demandReportRouter.post("/filter_dayawise_dmd_report_app_cowise", async (req, res) => {
    try {
        var data = req.body;
        // console.log(data,'filter co');

        var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 

        var dateResult = await db_Select(date_query);
        // console.log(dateResult, 'dmy');
        var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');
        // console.log("Created date:", create_date);

        var select = `a.group_cd,d.group_name,b.member_code,f.client_name,b.period_mode, 
        CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode IN ('Weekly','Fortnight') THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,b.week_no,(a.dmd_amt) dmd_amt`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_group d ON a.group_cd = d.group_code LEFT JOIN md_member f ON b.member_code = f.member_code",
        whr = data.period_mode == 'Fortnight' ? `b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}' AND b.week_no = '${data.week_no}' AND a.demand_date = '${create_date}' AND a.branch_code IN (${data.branch_code})` : `b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}' AND a.demand_date = '${create_date}' AND a.branch_code IN (${data.branch_code})`,
        order = `ORDER BY a.branch_code,a.group_cd`;
        var cowise_demand_data_day = await db_Select(select,table_name,whr,order);
        res.send({cowise_demand_data_day})
    }catch(error){
        console.error("Error fetching demand report cowise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

// LOAN DEMAND REPORT VIA BM
demandReportRouter.post("/loan_demand_report_app_bmwise", async (req, res) => {
    try {
        var data = req.body;
        // console.log(data,'bm_app_data');
            
    
        var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 
    
        var dateResult = await db_Select(date_query);
        // console.log(dateResult, 'dmy');
        var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');
        // console.log("Created date:", create_date);
    
        var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,c.area_code,a.group_cd,d.group_name,b.member_code,f.client_name,d.co_id,e.emp_name co_name,b.period_mode, 
        CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode IN ('Weekly','Fortnight') THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,b.week_no,(a.dmd_amt)dmd_amt`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON a.group_cd = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_member f ON b.member_code = f.member_code",
        whr = `a.branch_code = '${data.branch_code}' AND a.demand_date = '${create_date}'`,
        order = `ORDER BY a.branch_code,a.group_cd`;
        var bmwise_demand_data = await db_Select(select,table_name,whr,order);
        res.send({bmwise_demand_data})
            // Separate demand_date fetch
            // var demand_date_result = await db_Select("MAX(demand_date) AS demand_date", "td_loan_month_demand", `branch_code IN (${data.branch_code})`);
            // var demand_date = dateFormat(demand_date_result.msg[0].demand_date,'yyyy-mm-dd');
        }catch(error){
            console.error("Error fetching demand report cowise:", error);
            res.send({ suc: 0, msg: "An error occurred" });
        }
});

// filter wise
demandReportRouter.post("/filter_dayawise_dmd_report_app_bmwise", async (req, res) => {
    try {
        var data = req.body;
        // console.log(data,'filter co');

        var date_query = `LAST_DAY(CONCAT('${data.send_year}', '-', '${data.send_month}', '-01')) AS month_last_date`; 

        var dateResult = await db_Select(date_query);
        // console.log(dateResult, 'dmy');
        var create_date = dateFormat(dateResult.msg[0].month_last_date,'yyyy-mm-dd');
        // console.log("Created date:", create_date);

        var select = `DATE_FORMAT(a.demand_date, '%M %Y') AS demand_date,a.branch_code,c.branch_name,c.area_code,a.group_cd,d.group_name,b.member_code,f.client_name,d.co_id,e.emp_name co_name,b.period_mode, 
        CASE 
        WHEN b.period_mode = 'Monthly' THEN b.recovery_day
        WHEN b.period_mode IN ('Weekly','Fortnight') THEN 
        CASE b.recovery_day
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
        ELSE 'Unknown'
        END
        ELSE 'N/A'
        END AS recovery_day,b.week_no,(a.dmd_amt)dmd_amt`,
        table_name = "td_loan_month_demand a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON a.group_cd = d.group_code LEFT JOIN md_employee e ON d.co_id = e.emp_id LEFT JOIN md_member f ON b.member_code = f.member_code",
        whr = data.period_mode == 'Fortnight' ? `b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}' AND b.week_no = '${data.week_no}' AND a.demand_date = '${create_date}' AND a.branch_code IN (${data.branch_code})` : `b.period_mode = '${data.period_mode}' AND b.recovery_day BETWEEN '${data.from_day}' AND '${data.to_day}' AND a.demand_date = '${create_date}' AND a.branch_code IN (${data.branch_code})`,
        order = `ORDER BY a.branch_code,a.group_cd`;
        var bmwise_demand_data_day = await db_Select(select,table_name,whr,order);
        res.send({bmwise_demand_data_day})
    }catch(error){
        console.error("Error fetching demand report cowise:", error);
        res.send({ suc: 0, msg: "An error occurred" });
    }
});

module.exports = {demandReportRouter}