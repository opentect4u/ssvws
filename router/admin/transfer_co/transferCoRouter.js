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
            var select = "a.group_code,a.branch_code grp_brn,a.group_name,a.co_id,b.emp_name co_name,b.branch_id co_brn_id,c.branch_name co_brn_name";
            table_name = "md_group a, md_employee b, md_branch c";
            whr = `a.co_id = b.emp_id AND b.branch_id = c.branch_code AND a.branch_code = '${data.branch_code}' AND a.group_code = '${data.group_code}'`,
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
        console.error("Error fetching group co details:", error);
        return res.send({ suc: 0, msg: "Internal server error" });
    }
});

transferCoRouter.post("/fetch_co_brnwise", async (req, res) => {
    var data = req.body;

    var select = "a.emp_id,a.emp_name,b.user_type",
    table_name = "md_employee a LEFT JOIN md_user b ON a.emp_id = b.emp_id",
    whr = `a.branch_id = '${data.branch_code}' AND b.user_type = '1' AND b.user_status = 'A'`,
    order = null;
    var co_data = await db_Select (select,table_name,whr,order);

    res.send(co_data)
});

module.exports = {transferCoRouter}