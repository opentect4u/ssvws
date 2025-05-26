const express = require('express'),
duplicate_printRouter = express.Router(),
dateFormat = require('dateformat');

const {db_Select} = require('../../model/mysqlModel');

//fetch group details and total collection of this particular group for duplicate print
duplicate_printRouter.post("/fetch_group_dtls_fr_duplicate_print", async (req, res) => {
    try{
     var data = req.body;
    //  console.log(data,'dupdata');
     
     var select = "a.payment_date,a.upload_on,b.group_code,c.group_name,SUM(a.credit) tot_collection",
     table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code",
     whr = `a.branch_id = '${data.branch_code}' 
            AND a.payment_date BETWEEN '${data.from_date}' AND '${data.to_date}' 
            AND a.tr_type = 'R' 
            AND a.created_by = '${data.created_by}'`,
     order = `GROUP BY a.payment_date,a.upload_on,b.group_code,c.group_name`;
     var group_dtls_fr_duplicate = await db_Select(select,table_name,whr,order);
     res.send({ suc: 1, msg: group_dtls_fr_duplicate})
    }catch(error){
         console.error("Error fetching duplicate print:", error);
         res.send({ suc: 0, msg: "An error occurred" });
    }
});

//fetch groupwise member collection details
duplicate_printRouter.post("/fetch_grpwise_member_collec", async (req, res) => {
 try{
    var data = req.body;
    console.log(data,'data');

    var select = `a.loan_id,a.member_code,a.branch_code,a.group_code,b.payment_id tnx_id,b.payment_date tnx_date,b.tr_mode,b.credit,b.upload_on,b.created_by collec_code,c.group_name,d.branch_name,e.emp_name collec_name,f.client_name, (SELECT ROUND(SUM(j.balance + j.intt_balance),2)
                                    FROM td_loan i LEFT JOIN td_loan_transactions j ON i.loan_id = j.loan_id
                                    WHERE i.group_code = '${data.group_code}' AND j.payment_date BETWEEN '${data.from_date}' AND '${data.to_date}' AND j.upload_on = '${data.upload_on}' AND j.tr_type = 'R'
                                    ) outstanding`,
                      table_name =
                        "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON a.branch_code = c.branch_code AND a.group_code = c.group_code JOIN md_branch d ON a.branch_code = d.branch_code JOIN md_employee e ON b.created_by = e.emp_id JOIN md_member f ON a.branch_code = f.branch_code AND a.member_code = f.member_code",
                      whr = `a.group_code = '${data.group_code}' AND b.tr_type = 'R' AND b.payment_date BETWEEN '${data.from_date}' AND '${data.to_date}' AND b.upload_on = '${data.upload_on}'`,
                      order = `GROUP BY a.loan_id,a.member_code,a.branch_code,a.group_code,b.payment_id,b.payment_date,b.credit,b.tr_mode,b.created_by,c.group_name,d.branch_name,e.emp_name,f.client_name`;
    var grpwise_member_collec_print = await db_Select(select,table_name,whr,order);
    res.send(grpwise_member_collec_print )
 }catch(error){
    console.error("Error fetching groupwise member collection:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

module.exports = {duplicate_printRouter}