const { db_Select } = require('../../../model/mysqlModel');
const { purpose_save } = require('../../../modules/admin/purpose/purposeModule');

const express = require('express'),
purposeRouter = express.Router(),
dateFormat = require('dateformat');

//show all purpose details
purposeRouter.get("/show_all_purp", async (req, res) => {
try{
      var data = req.query;
  
      var select = "purp_id,CONCAT(purpose_id, '-', sub_purpose) purpose_name",
      table_name = "md_purpose",
      whr = null,
      order = null;
      var purp_data = await db_Select(select,table_name,whr,order);
      res.send(purp_data);
    }catch(err){
      console.log(err);
      res.send({ message: "An error occurred while showing all purpose details", error: err.message });
    }
});

//fetch all purpose details
purposeRouter.post("/fetch_purp_data", async (req, res) => {
 try{
      var data = req.body;
      var select = "purp_id,purpose_id,sub_purpose",
      table_name = "md_purpose",
      whr = `purp_id = '${data.purp_id}'`,
      order = null;
      var fetch_purp_dtls = await db_Select(select,table_name,whr,order);
  
      if (fetch_purp_dtls) {
          res.send(fetch_purp_dtls);
      } else {
          res.send({ message: "Purpose details not found." });
      }
   }catch(error){
      console.log("Error fetching purpose details:", error);
   }
});

//save purpose details
purposeRouter.post("/save_purpose", async (req, res) => {
    var data = req.body,res_dt;
    purpose_save(data).then(data => {
        res_dt = data
    }).catch(err => {
        res_dt = err
    }).finally (() => {
        res.send(res_dt)
    })
}); 
module.exports = {purposeRouter}