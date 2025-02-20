const { db_Select } = require('../../../model/mysqlModel');

const express = require('express'),
transferCoRouter = express.Router(),
dateFormat = require('dateformat');

transferCoRouter.get("/fetch_group_name_brnwise", async (req, res) => {
    var data = req.query;

    //get group details
    var select = "group_code,branch_code,group_name,group_type,co_id,phone1",
    table_name = "md_group",
    whr = `branch_code = '${data.branch_code}'`,
    order = `ORDER BY group_name`;
    var group_dt = await db_Select(select,table_name,whr,order);
    res.send(group_dt) 
})

transferCoRouter.post("/fetch_grp_co_dtls_for_transfer", async (req, res) => {
    var data = req.body;

    //FETCH GROUP CO DETAILS FOR TRANSFER
    try {
            var select = "a.branch_code grp_brn,a.group_name,a.co_id,b.branch_id,b.emp_name";
            table_name = "md_group a, md_employee b";
            whr = `a.branch_code = '${data.branch_code}' AND a.group_code = '${data.group_code}'`,
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
                    details: "Employee details not found"
                });
            }
    } catch (error) {
        // Handle errors gracefully
        console.error("Error fetching group co details:", error);
        return res.send({ suc: 0, msg: "Internal server error" });
    }
});

module.exports = {transferCoRouter}