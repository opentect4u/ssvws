const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
receipt_summaryRouter = express.Router(),
dateFormat = require('dateformat');

//GROUPWISE RECEIPT SUMMARY REPORT
receipt_summaryRouter.post("/groupwise_receipt_summary", async (req, res) => {
    try{
        var data = req.body;
        // console.log(data,'group receipt');
        
        var select = `a.payment_date,b.branch_code,d.branch_name,b.group_code,c.group_name,COUNT(a.payment_id) AS no_of_receipts,GROUP_CONCAT(a.payment_id ORDER BY a.payment_id SEPARATOR ',') AS payment_ids`,
        table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_branch d ON b.branch_code = d.branch_code",
        whr = data.branch_code == 100 ? `a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'` : `a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND b.branch_code IN (${data.branch_code})`,
        order = `GROUP BY a.payment_date,b.branch_code,d.branch_name,b.group_code,c.group_name
                 ORDER BY a.payment_date, b.group_code`;
        var groupwise_receipt = await db_Select(select,table_name,whr,order);
        res.send(groupwise_receipt)
    }catch(error){
        console.error("Error while fetching groupwise receipt summary report:", error);
        res.send("An error occurred");
    }
});

//COWISE RECEIPT SUMMARY REPORT
receipt_summaryRouter.post("/cowise_receipt_summary", async (req, res) => {
    try{
        var data = req.body;
        // console.log(data,'co receipt');
        
        var select = `a.payment_date,b.branch_code,d.branch_name,c.co_id,e.emp_name,b.group_code,c.group_name,COUNT(a.payment_id) AS no_of_receipts,GROUP_CONCAT(a.payment_id ORDER BY a.payment_id SEPARATOR ',') AS payment_ids`,
        table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_branch d ON b.branch_code = d.branch_code LEFT JOIN md_employee e ON c.co_id = e.emp_id",
        whr = data.branch_code == 100 ? `a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND c.co_id IN (${data.co_id})` : `a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND b.branch_code IN (${data.branch_code}) AND c.co_id IN (${data.co_id})`,
        order = `GROUP BY a.payment_date,b.branch_code,d.branch_name,c.co_id,e.emp_name,b.group_code,c.group_name
                 ORDER BY a.payment_date, b.group_code`;
        var cowise_receipt = await db_Select(select,table_name,whr,order);
        res.send(cowise_receipt)
    }catch(error){
        console.error("Error while fetching cowise receipt summary report:", error);
        res.send("An error occurred");
    }
});

//BRANCHWISE RECEIPT SUMMARY REPORT
receipt_summaryRouter.post("/branchwise_receipt_summary", async (req, res) => {
    try{
        var data = req.body;
        // console.log(data,'branch receipt');
        
        var select = `a.payment_date,b.branch_code,d.branch_name,GROUP_CONCAT(DISTINCT b.group_code ORDER BY b.group_code SEPARATOR ', ') AS group_code,GROUP_CONCAT(DISTINCT c.group_name ORDER BY c.group_name SEPARATOR ', ') AS group_name,COUNT(a.payment_id) AS no_of_receipts,GROUP_CONCAT(a.payment_id ORDER BY a.payment_id SEPARATOR ',') AS payment_ids`,
        table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_branch d ON b.branch_code = d.branch_code",
        whr = data.branch_code == 100 ? `a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'` : `a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND b.branch_code IN (${data.branch_code})`,
        order = `GROUP BY a.payment_date,b.branch_code,d.branch_name
                 ORDER BY a.payment_date, b.branch_code`;
        var branchwise_receipt = await db_Select(select,table_name,whr,order);
        res.send(branchwise_receipt)
    }catch(error){
        console.error("Error while fetching branchwise receipt summary report:", error);
        res.send("An error occurred");
    }
});

module.exports = {receipt_summaryRouter}