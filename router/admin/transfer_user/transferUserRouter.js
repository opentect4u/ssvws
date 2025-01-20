const { db_Select, db_Insert } = require('../../../model/mysqlModel');

const express = require('express'),
transferUserRouter = express.Router(),
dateFormat = require('dateformat');

transferUserRouter.post("/fetch_user_dtls_fr_transfer", async (req, res) => {
    var data = req.body;

    //FETCH USER DETAILS FOR TRANSFER
    try {
            var select = "a.branch_id,a.emp_name,b.user_type,c.user_type type_name,d.branch_name";
            table_name = "md_employee a, md_user b, md_user_type c, md_branch d";
            whr = `a.branch_id = b.brn_code AND a.emp_id = b.emp_id AND b.user_type = c.type_code AND a.branch_id = d.branch_code AND a.emp_id = '${data.emp_id}'`,
            order = null;
            var fetch_user_dt = await db_Select(select, table_name, whr, order);
            if (fetch_user_dt.suc > 0 && fetch_user_dt.msg.length > 0) {
                // If employee details found
                return res.send({
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
});

transferUserRouter.post("/tranfer_user", async (req, res) => {
    var data = req.body;
      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    
      //TRANSFER BRANCH
    try {
        var table_name = "md_user_branch",
                fields = `(user_dt,emp_id,branch_code,remarks,modified_by,modified_at)`,
                values = `('${datetime}','${data.emp_id}','${data.branch_code}','${data.remarks.split("'").join("\\'")}','${data.modified_by}','${datetime}')`,
                whr = null,
                flag = 0;
                var save_trans_dtls = await db_Insert(table_name,fields,values,whr,flag);  
                
                if(save_trans_dtls.suc > 0 && save_trans_dtls.msg.length > 0){
                    var table_name = "md_user",
                    fields = `brn_code = '${data.branch_code}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                    values = null,
                    whr = `emp_id = '${data.emp_id}'`,
                    flag = 1;
                    var update_trans_dtls = await db_Insert(table_name,fields,values,whr,flag);  

                    var table_name = "md_employee",
                    fields = `branch_id = '${data.branch_code}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'`,
                    values = null,
                    whr = `emp_id = '${data.emp_id}'`,
                    flag = 1;
                    var updates_trans_dtls = await db_Insert(table_name,fields,values,whr,flag);  
                }

                res.send(updates_trans_dtls)

    }catch (error){
        res.send({"suc": 2, "msg": "Error occurred during fetching user details", details: error });
        
    }

});

module.exports = {transferUserRouter}