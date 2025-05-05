const { db_Select } = require('../../../model/mysqlModel');
const { emp_details_save } = require('../../../modules/admin/employee/empModule');

const express = require('express'),
empRouter = express.Router(),
dateFormat = require('dateformat');

empRouter.get("/fetch_all_branch_dt", async (req, res) => {
    var data = req.query;

    //fetch all branch details
    var select = "branch_code,branch_name,brn_status",
    table_name = "md_branch",
    whr = `brn_status = 'O' AND branch_code <> 100`,
    order = `ORDER BY branch_name`;
    var fetch_branch_dtls = await db_Select(select,table_name,whr,order);

    res.send(fetch_branch_dtls)
});

empRouter.post("/save_employee", async (req, res) => {

    //save employee details
    var data = req.body,res_dt;
    emp_details_save(data).then(data => {
        res_dt = data
    }).catch(err => {
        res_dt = err
    }).finally (() => {
        res.send(res_dt)
    })

});

empRouter.get("/show_all_emp", async (req, res) => {
    var data = req.query;

    //show all employee details
    var select = "a.branch_id,a.emp_id,a.emp_name,a.active_flag,b.branch_name",
    table_name = "md_employee a, md_branch b",
    whr = `a.branch_id = b.branch_code`,
    order = null;
    var show_emp_dtls = await db_Select(select,table_name,whr,order);

    res.send(show_emp_dtls)
});

empRouter.post("/fetch_emp", async (req, res) => {
    try {
    var data = req.body;

    //fetch all employee details with employee id
    var select = "a.*,b.branch_name",
    table_name = "md_employee a, md_branch b",
    whr = `a.branch_id = b.branch_code
           AND a.branch_id = '${data.branch_code}' AND a.emp_id = '${data.emp_id}'`,
    order = null;
    var fetch_emp_dtls = await db_Select(select,table_name,whr,order);

    // res.send(fetch_emp_dtls)
    if (fetch_emp_dtls) {
        res.send(fetch_emp_dtls);
    } else {
        res.send({ message: "Employee details not found." });
    }
} catch (error) {
    console.error("Error fetching employee details:", error);
    res.send({ message: "An error occurred while fetching employee details.", error: error.message });
}
});

module.exports = {empRouter}