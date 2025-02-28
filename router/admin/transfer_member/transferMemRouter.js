const { db_Select } = require('../../../model/mysqlModel');

const express = require('express'),
transferMemRouter = express.Router(),
dateFormat = require('dateformat');

transferMemRouter.post("/fetch_group_name_fr_mem_trans", async (req, res) => {
    var data = req.body;

    if(!data.grp_mem || data.grp_mem.trim() === "") {
        return res.send({ "suc": 0, "msg": "No records found" });
    }

    try {
    //get group details
    var select = "group_code,branch_code,group_name,group_type,co_id,phone1",
    table_name = "md_group",
    whr = `branch_code = '${data.branch_code}' AND open_close_flag = 'O' AND approval_status = 'A' AND (group_code like '%${data.grp_mem}%' OR group_name like '%${data.grp_mem}%')`,
    order = `ORDER BY group_name`;
    var group_dt_mem_trans = await db_Select(select,table_name,whr,order);

    if(group_dt_mem_trans.suc > 0 && group_dt_mem_trans.msg.length > 0){
        return res.send(group_dt_mem_trans);
    }else {
        return res.send({ "suc": 0, "msg": "No data found"});
    }
}catch{
    console.error("Error fetching when search group:", error);
    return res.send({ suc: 0, msg: "Internal server error" });
}
});

transferMemRouter.post("/fetch_grp_dtls", async (req, res) => {
  var data = req.body;

  //FETCH GROUP DETAILS
  try{
     var select = "a.group_code,a.group_name,a.co_id,b.emp_name co_name,b.branch_id,c.branch_name",
     table_name = "md_group a LEFT JOIN md_employee b ON a.co_id = b.emp_id LEFT JOIN md_branch c ON b.branch_id = c.branch_code",
     whr = `a.branch_code = '${data.branch_code}' AND a.group_code = '${data.group_code}'`,
     order = null;
     var fetch_grp_details = await db_Select(select,table_name,whr,order);
     if (fetch_grp_details.suc > 0 && fetch_grp_details.msg.length > 0) {
        // If employee details found
        return res.send({
            suc: 1,
            msg: fetch_grp_details.msg
        });
    } else {
        // If no details found in 'md_employee'
        return res.send({
            suc: 0,
            msg: [],
            details: "CO details not found"
        });
    }
  } catch(error){
    // Handle errors gracefully
    console.error("Error fetching details:", error);
    return res.send({ suc: 0, msg: "Internal server error" });
  }
});

transferMemRouter.post("/fetch_grp_member_dtls_for_transfer", async (req, res) => {
    var data = req.body;

    //FETCH GROUP MEMBER DETAILS FOR TRANSFER
    try {
            var select = "a.loan_id,a.group_code,c.group_name,a.member_code,b.client_name,SUM(a.prn_amt + a.od_prn_amt + a.intt_amt + a.od_intt_amt) outstanding";
            table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN md_group c ON a.group_code = c.group_code";
            whr = ``,
            order = null;
            var fetch_grp_co_dt = await db_Select(select, table_name, whr, order);
            if (fetch_grp_co_dt.suc > 0 && fetch_grp_co_dt.msg.length > 0) {
                // If employee details found
                return res.send({
                    suc: 1,
                    msg: fetch_grp_co_dt.msg
                });
            } else {
                // If no details found in 'md_employee'
                return res.send({
                    suc: 0,
                    msg: [],
                    details: "CO details not found"
                });
            }
    } catch (error) {
        // Handle errors gracefully
        console.error("Error fetching details:", error);
        return res.send({ suc: 0, msg: "Internal server error" });
    }
});

module.exports = {transferMemRouter}