const { db_Select } = require('../../../model/mysqlModel');
const { block_save } = require('../../../modules/admin/block/blockModule');

const express = require('express'),
blockRouter = express.Router(),
dateFormat = require('dateformat');

//show all block details
blockRouter.get("/show_all_block", async (req, res) => {
    try{
      var data = req.query;
  
      var select = "a.block_id,a.block_name,a.dist_id,b.dist_name,b.state_id,c.state",
      table_name = "md_block a LEFT JOIN md_district b ON a.dist_id = b.dist_id LEFT JOIN md_state c ON b.state_id = c.sl_no",
      whr = null,
      order = null;
      var block_data = await db_Select(select,table_name,whr,order);
      res.send(block_data);
    }catch(err){
      console.log(err);
      res.send({ message: "An error occurred while showing all district details", error: err.message });
    }
  });

  //fetch all block details
  blockRouter.post("/fetch_block_data", async (req, res) => {
   try{
      var data = req.body;
      var select = "a.block_id,a.block_name,a.dist_id,b.dist_name,b.state_id,c.state",
      table_name = "md_block a LEFT JOIN md_district b ON a.dist_id = b.dist_id LEFT JOIN md_state c ON b.state_id = c.sl_no",
      whr = `a.block_id = '${data.block_id}'`,
      order = null;
      var fetch_block_dtls = await db_Select(select,table_name,whr,order);
  
      if (fetch_block_dtls) {
          res.send(fetch_block_dtls);
      } else {
          res.send({ message: "Block details not found." });
      }
   }catch(error){
      console.log("Error fetching block details:", error);
   }
  });

// get district
blockRouter.post("/get_districts", async (req, res) => {
    var data = req.body;

    var select = "dist_id,dist_name",
    table_name = "md_district",
    whr = null,
    order = null;
    var district_datas = await db_Select(select,table_name,whr,order);
    res.send(district_datas) 
   });

//save block details
blockRouter.post("/save_block", async (req, res) => {
    var data = req.body,res_dt;
    block_save(data).then(data => {
        res_dt = data
    }).catch(err => {
        res_dt = err
    }).finally (() => {
        res.send(res_dt)
    })
});   

module.exports = {blockRouter}