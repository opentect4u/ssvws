const { db_Select } = require('../../../model/mysqlModel');
const { district_save } = require('../../../modules/admin/district/districtModule');

const express = require('express'),
districtRouter = express.Router(),
dateFormat = require('dateformat');

//show all district details
districtRouter.get("/show_all_district", async (req, res) => {
  try{
    var data = req.query;

    var select = "b.state,a.dist_id,a.dist_name",
    table_name = "md_district a LEFT JOIN md_state b ON a.state_id = b.sl_no",
    whr = null,
    order = null;
    var district_data = await db_Select(select,table_name,whr,order);
    res.send(district_data);
  }catch(err){
    console.log(err);
  }
});

//fetch all district details
districtRouter.post("/fetch_district_data", async (req, res) => {
 try{
    var data = req.body;
    var select = "a.state_id,b.state,a.dist_name",
    table_name = "md_district a LEFT JOIN md_state b ON a.state_id = b.sl_no",
    whr = `a.dist_id = '${data.dist_id}'`,
    order = null;
    var fetch_district_dtls = await db_Select(select,table_name,whr,order);

    if (fetch_district_dtls) {
        res.send(fetch_district_dtls);
    } else {
        res.send({ message: "District details not found." });
    }
 }catch(error){
    console.log("Error fetching district details:", error);
 }
});

//get state
districtRouter.get("/get_states", async (req, res) => {
    var data = req.query;
       var select = "sl_no,state",
    table_name = "md_state",
    whr = null,
    order = null;
    var state_data = await db_Select(select,table_name,whr,order);
    res.send(state_data) 
});

//save district details
districtRouter.post("/save_district", async (req, res) => {
    var data = req.body,res_dt;
    district_save(data).then(data => {
        res_dt = data
    }).catch(err => {
        res_dt = err
    }).finally (() => {
        res.send(res_dt)
    })
});

module.exports = {districtRouter}