const { db_Select } = require('../../../model/mysqlModel');

const express = require('express'),
transferUserRouter = express.Router(),
dateFormat = require('dateformat');

transferUserRouter.post("/fetch_user_dtls_fr_transfer", async (req, res) => {
    var data = req.body;

    try {
            var select = "a.branch_id,a.emp_name,b.user_type,c.user_type type_name,d.branch_name";
            table_name = "md_employee a, md_user b, md_user_type c, md_branch d";
            whr = `a.branch_id = b.brn_code AND a.emp_id = b.emp_id AND b.user_type = c.type_code AND a.branch_id = d.branch_code AND a.emp_id = '${data.emp_id}'`,
            order = null;
            var fetch_user_dt = await db_Select(select, table_name, whr, order);
            if (fetch_user_dt.suc > 0 && fetch_user_dt.msg.length > 0) {
                // If employee details found
                return res.status(200).send({
                    suc: 1,
                    msg: fetch_user_dt.msg
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
        console.error("Error fetching employee details:", error);
        return res.send({ suc: 0, msg: "Internal server error" });
    }
})

module.exports = {transferUserRouter}