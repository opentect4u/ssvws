const { db_Select } = require('../../../model/mysqlModel');
const { fund_save } = require('../../../modules/admin/fund/fundModule');

const express = require('express'),
fundRouter = express.Router(),
dateFormat = require('dateformat');

fundRouter.post("/show_all_fund_details", async (req, res) => {
    try{
    var data = req.body;
    // console.log(data,'fund_data');

    //validation
     if (
      data.fund_id !== undefined &&
      (isNaN(data.fund_id) || Number(data.fund_id) < 0)
    ) {
      return res.send({
        message: "Invalid fund_id It must be a positive number.",
      });
    }

    var select = "fund_id,fund_name",
    table_name = "md_fund",
    // whr = data.fund_id > 0 ? `fund_id = '${data.fund_id}'` : null,
    whr = (data.fund_id !== undefined && Number(data.fund_id) > 0) ? `fund_id = '${Number(data.fund_id)}'` : null,
    order = `ORDER BY fund_id ASC`;
    var fund_data = await db_Select(select,table_name,whr,order);
    res.send(fund_data);
    }catch (error) {
    console.log(err);
    res.send({ message: "An error occurred while showing all fund details", error: err.message });
    }
});

fundRouter.post("/save_fund", async (req, res) => {
    var data = req.body,res_dt;
    fund_save(data).then(data => {
        res_dt = data
    }).catch(err => {
        res_dt = err
    }).finally (() => {
        res.send(res_dt)
    })
});

module.exports = {fundRouter}