const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
groupRouter = express.Router(),
dateFormat = require('dateformat');

// groupwise report active and inactive group

groupRouter.post("/active_inactive_group_report", async (req, res) => {
    try{
        var data = req.body;
        // console.log(data,'data');

            var select = `DISTINCT a.group_code,a.branch_code,c.branch_name,a.group_name,a.co_id,a.phone1,a.phone2,a.grp_addr,a.disctrict,a.block,a.pin_no,a.bank_name,a.branch_name bank_branch,a.ifsc,a.micr,a.acc_no1 savings_acc,a.acc_no2 loan_acc,a.grp_open_dt`;
            table_name = `md_group a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.group_code = b.prov_grp_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code`;
              // condition depending on group_flag
             const outstandingCond = data.group_flag === "A" ? "> 0" : "<= 0";
            whr = data.branch_code == '100' ? `a.grp_open_dt <= '${data.from_date}'
            AND a.group_code IN (
                SELECT d.group_code 
                FROM td_loan d 
                WHERE d.group_code = a.group_code 
                  AND d.outstanding ${outstandingCond}
            )
            AND b.approval_status = 'A'` : `a.branch_code IN (${data.branch_code}) AND a.grp_open_dt <= '${data.from_date}'
            AND a.group_code IN (
                SELECT d.group_code 
                FROM td_loan d 
                WHERE d.group_code = a.group_code 
                  AND d.outstanding ${outstandingCond}
            )
            AND b.approval_status = 'A'`,
            order = `ORDER BY a.group_code DESC`;
            var group_report = await db_Select(select,table_name,whr,order);
        res.send(group_report)
    }catch(error){
        console.error("Error fetching group report:", error);
        res.send("An error occurred");
    }
});

// cowise report active and inactive group

groupRouter.post("/active_inactive_co_report", async (req, res) => {
    try{
        var data = req.body;
        // console.log(data,'data');

            var select = `DISTINCT a.group_code,a.branch_code,c.branch_name,a.group_name,a.co_id,d.emp_name co_name,a.phone1,a.phone2,a.grp_addr,a.disctrict,a.block,a.pin_no,a.bank_name,a.branch_name bank_branch,a.ifsc,a.micr,a.acc_no1 savings_acc,a.acc_no2 loan_acc,a.grp_open_dt`;
            table_name = `md_group a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.group_code = b.prov_grp_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_employee d ON a.co_id = d.emp_id`;
              // condition depending on group_flag
             const outstandingCond = data.co_flag === "A" ? "> 0" : "<= 0";
            whr = data.branch_code == '100' ? `a.grp_open_dt <= '${data.from_date}'
            AND a.group_code IN (
                SELECT e.group_code 
                FROM td_loan e
                WHERE e.group_code = a.group_code 
                  AND e.outstanding ${outstandingCond}
            )
            AND b.approval_status = 'A' AND a.co_id IN (${data.co_id})` : `a.branch_code IN (${data.branch_code}) AND a.grp_open_dt <= '${data.from_date}'
            AND a.group_code IN (
                SELECT e.group_code 
                FROM td_loan e 
                WHERE e.group_code = a.group_code 
                  AND e.outstanding ${outstandingCond}
            )
            AND b.approval_status = 'A' AND a.co_id IN (${data.co_id})`,
            order = `ORDER BY a.co_id, a.group_code DESC;`;
            var group_report = await db_Select(select,table_name,whr,order);
        res.send(group_report)
    }catch(error){
        console.error("Error fetching co report:", error);
        res.send("An error occurred");
    }
});

// member report active and inactive 
groupRouter.post("/active_inactive_member_report", async (req, res) => {
    try{
        var data = req.body;
        // console.log(data,'data');

            var select = `b.form_no,b.grt_date,b.member_code,c.client_name,a.group_code,a.group_name,a.branch_code,e.branch_name,c.client_mobile,c.email_id,c.gurd_name,c.gurd_mobile,c.husband_name,c.client_addr,c.pin_no,c.nominee_name,c.aadhar_no,c.pan_no,c.voter_id,
            CASE WHEN c.religion = 'Others' THEN c.other_religion ELSE c.religion END AS religion,
            CASE WHEN c.caste = 'Others' THEN c.other_caste ELSE c.caste END AS caste,
            CASE WHEN c.education = 'Others' THEN c.other_education ELSE c.education END AS education,
            c.dob,a.co_id,a.phone1,a.phone2,a.grp_addr,a.disctrict,a.block,a.pin_no,a.bank_name,a.branch_name bank_branch,a.ifsc,a.micr,a.acc_no1 savings_acc,a.acc_no2 loan_acc,a.grp_open_dt,d.self_occu,d.self_income,d.spouse_occu,d.spouse_income,d.loan_purpose,d.applied_amt,
            CASE WHEN d.other_loan_flag = 'Y' THEN d.other_loan_amt ELSE NULL END AS other_loan_amt,
            CASE WHEN d.other_loan_flag = 'Y' THEN d.other_loan_emi ELSE NULL END AS other_loan_emi,
            d.other_loan_flag,
            d.house_type,d.own_rent,d.parental_addr,d.parental_phone`;
            table_name = `md_group a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.group_code = b.prov_grp_code LEFT JOIN md_member c ON b.branch_code = c.branch_code AND b.member_code = c.member_code LEFT JOIN td_grt_occupation_household d ON b.branch_code = d.branch_code AND b.form_no = d.form_no LEFT JOIN md_branch e ON a.branch_code = e.branch_code`;
              // condition depending on group_flag
             const outstandingCond = data.member_flag === "A" ? "> 0" : "<= 0";
            whr = data.branch_code == '100' ? `a.grp_open_dt <= '${data.from_date}'
            AND b.member_code IN (
                SELECT f.member_code 
                FROM td_loan f
                WHERE f.member_code = b.member_code 
                  AND f.outstanding ${outstandingCond}
            )
            AND b.approval_status = 'A'` : `a.branch_code IN (${data.branch_code}) AND a.grp_open_dt <= '${data.from_date}'
              AND b.member_code IN (
                SELECT f.member_code 
                FROM td_loan f
                WHERE f.member_code = b.member_code 
                  AND f.outstanding ${outstandingCond}
            )
            AND b.approval_status = 'A'`,
            order = `ORDER BY b.member_code DESC`;
            var group_report = await db_Select(select,table_name,whr,order);
        res.send(group_report)
    }catch(error){
        console.error("Error fetching member report:", error);
        res.send("An error occurred");
    }
});

module.exports = {groupRouter}