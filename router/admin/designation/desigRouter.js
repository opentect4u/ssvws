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
})
module.exports = {desigRouter}