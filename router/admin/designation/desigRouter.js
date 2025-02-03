const { db_Select } = require('../../../model/mysqlModel');
const { designation_save } = require('../../../modules/admin/designation/desigModule');

const express = require('express'),
desigRouter = express.Router(),
dateFormat = require('dateformat');

desigRouter.post("/save_designation", async (req, res) => {
    //save designation details

    var data = req.body,res_dt;
    designation_save(data).then(data => {
        res_dt = data
    }).catch(err => {
        res_dt = err
    }).finally (() => {
        res.send(res_dt)
    })
});

desigRouter.get("/show_all_designation", async (req, res) => {
    var data = req.query;

    var select = "desig_code, desig_type",
    table_name = "md_designation",
    whr = null,
    order = null;
    var desig_dt = await db_Select(select, table_name,whr,order);
    
    res.send(desig_dt)
});

desigRouter.post("/fetch_designation", async (req, res) => {
    try {
        var data = req.body;
    
        //fetch all designation details
        var select = "desig_type",
        table_name = "md_designation",
        whr = `desig_code = '${data.desig_code}'`,
        order = null;
        var fetch_desig_dtls = await db_Select(select,table_name,whr,order);
    
        // res.send(fetch_emp_dtls)
        if (fetch_desig_dtls) {
            res.send(fetch_desig_dtls);
        } else {
            res.send({ message: "Designation details not found." });
        }
    } catch (error) {
        console.error("Error fetching designation details:", error);
        res.send({ message: "An error occurred while fetching designation details.", error: error.message });
    }
})
module.exports = {desigRouter}