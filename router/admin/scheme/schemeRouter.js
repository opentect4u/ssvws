const { db_Select } = require('../../../model/mysqlModel');
const { scheme_save } = require('../../../modules/admin/scheme/schemeModule');

const express = require('express'),
schemeRouter = express.Router(),
dateFormat = require('dateformat');

schemeRouter.get("/show_all_scheme_details_depend_on_status", async (req, res) => {
    try{
    var data = req.query;
    //  res.send(data);
    //validation
     if (
      data.scheme_id !== undefined &&
      (isNaN(data.scheme_id) || Number(data.scheme_id) < 0)
    ) {
      return res.send({
        message: "Invalid scheme id It must be a positive number.",
      });
    }

     if (
      data.status !== undefined &&  data.status !== '' &&
      !['A', 'D'].includes(data.status.toUpperCase())
    ) {
      return res.send({
        message: "Invalid status It must be either 'A' or 'D'",
      });
    }

    var select = "scheme_id,scheme_name,effective_from,effective_to,min_amt,max_amt,min_period,max_period,min_period_week,max_period_week,payment_mode,roi,active_flag",
    table_name = "md_scheme",
    // whr = (data.scheme_id !== undefined && Number(data.scheme_id) > 0 && data.status !== undefined) ? `scheme_id = '${Number(data.scheme_id)}' AND active_flag = '${data.status}'` : `active_flag = '${data.status}'`,
    whr = "";
    if (data.scheme_id !== undefined && Number(data.scheme_id) > 0 && data.status !== undefined) {
      whr = `scheme_id = '${Number(data.scheme_id)}' AND active_flag = '${data.status}'`;
    } else if (data.scheme_id !== undefined && Number(data.scheme_id) > 0) {
      whr = `scheme_id = '${Number(data.scheme_id)}'`;
    } else if (data.status !== undefined) {
      whr = `active_flag = '${data.status}'`;
    }
    order = `ORDER BY scheme_id ASC`;
    var scheme_data = await db_Select(select,table_name,whr,order);
    res.send(scheme_data);
    }catch (error) {
    console.log(error);
    res.send({ message: "An error occurred while showing all fund details", error: error.message });
    }
});

schemeRouter.post("/save_scheme", async (req, res) => {
    var data = req.body,res_dt;
    scheme_save(data).then(data => {
        res_dt = data
    }).catch(err => {
        res_dt = err
    }).finally (() => {
        res.send(res_dt)
    })
});

module.exports = {schemeRouter}