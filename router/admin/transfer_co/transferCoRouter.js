const { db_Select, db_Insert } = require('../../../model/mysqlModel');

const express = require('express'),
transferCoRouter = express.Router(),
dateFormat = require('dateformat');

transferCoRouter.post("/fetch_group_name_brnwise", async (req, res) => {
    var data = req.body;

    if(!data.grp || data.grp.trim() === "") {
        return res.send({ "suc": 0, "msg": "No records found" });
    }

    try {
    //get group details
    var select = "group_code,branch_code,group_name,group_type,co_id,phone1",
    table_name = "md_group",
    whr = `branch_code = '${data.branch_code}' AND open_close_flag = 'O' AND approval_status = 'A' AND (group_code like '%${data.grp}%' OR group_name like '%${data.grp}%')`,
    order = `ORDER BY group_name`;
    var group_dt = await db_Select(select,table_name,whr,order);

    if(group_dt.suc > 0 && group_dt.msg.length > 0){
        return res.send(group_dt);
    }else {
        return res.send({ "suc": 0, "msg": "No data found"});
    }
}catch{
    console.error("Error fetching when search group:", error);
    return res.send({ suc: 0, msg: "Internal server error" });
}
});

transferCoRouter.post("/fetch_grp_co_dtls_for_transfer", async (req, res) => {
    var data = req.body;

    //FETCH GROUP CO DETAILS FOR TRANSFER
    try {
            var select = "a.group_code,a.branch_code grp_brn,a.group_name,a.co_id,b.emp_name co_name,b.branch_id co_brn_id,c.branch_name co_brn_name";
            table_name = "md_group a, md_employee b, md_branch c";
            whr = `a.co_id = b.emp_id AND b.branch_id = c.branch_code AND a.branch_code = '${data.branch_code}' AND a.group_code = '${data.group_code}'`,
            order = null;
            var fetch_grp_co_dt = await db_Select(select, table_name, whr, order);
            if (fetch_grp_co_dt.suc > 0 && fetch_grp_co_dt.msg.length > 0) {
                // If employee details found
                return res.send({
                    suc: 1,
                    msg: fetch_grp_co_dt.msg
                });
            } else {
                // If no details found in 'md_employee'
                return res.send({
                    suc: 0,
                    msg: [],
                    details: "CO details not found"
                });
            }
    } catch (error) {
        // Handle errors gracefully
        console.error("Error fetching group co details:", error);
        return res.send({ suc: 0, msg: "Internal server error" });
    }
});

//FETCH CO NAME
transferCoRouter.post("/fetch_co_branch", async (req, res) => {
    var data = req.body;

    var select = "a.emp_id to_co_id,a.branch_id to_brn_id,a.emp_name to_co_name,b.user_type,c.branch_name to_brn_name",
    table_name = "md_employee a LEFT JOIN md_user b ON a.emp_id = b.emp_id LEFT JOIN md_branch c ON a.branch_id = c.branch_code",
    whr = `b.user_type = '1' AND b.user_status = 'A'`,
    order = null;
    var co_data = await db_Select(select,table_name,whr,order);

    res.send(co_data)
});

// TRANSFER CO 
transferCoRouter.post("/transfer_co", async (req, res) => {
    var data = req.body;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
        var table_name = "td_co_transfer",
                fields = `(trf_date,group_code,from_co,from_brn,to_co,to_brn,created_by,created_at)`,
                values = `('${datetime}','${data.group_code}','${data.from_co}','${data.from_brn}','${data.to_co}','${data.to_brn}','${data.created_by}','${datetime}')`,
                whr = null,
                flag = 0;
                var save_trans_co_dtls = await db_Insert(table_name,fields,values,whr,flag);  
                
                if(save_trans_co_dtls.suc > 0 && save_trans_co_dtls.msg.length > 0){
                    var table_name = "md_group",
                    fields = `co_id = '${data.to_co}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                    values = null,
                    whr = `group_code = '${data.group_code}'`,
                    flag = 1;
                    var update_grp_co_dtls = await db_Insert(table_name,fields,values,whr,flag);  
                }

                res.send(update_grp_co_dtls);

    }catch (error){
        res.send({"suc": 2, "msg": "Error occurred", details: error });
        
    }
});

//APPROVE TRANSFER CO DETAILS
transferCoRouter.post("/approve_co_trans_dt", async (req, res) => {
    var data = req.body;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
        var table_name = "td_co_transfer",
        fields = `remarks = '${data.remarks.split("'").join("\\'")}', approval_status = 'A', approved_by = '${data.approved_by}', approved_at = '${datetime}'`,
        values = null,
        whr = `group_code = '${data.group_code}'`,
        flag = 1;
        var approve_grp_co_dtls = await db_Insert(table_name,fields,values,whr,flag);

        res.send(approve_grp_co_dtls);
    }catch (error){
        res.send({"suc": 2, "msg": "Error occurred", details: error });
        
    }
});

// TRANSFER CO DETAILS FOR VIEW

transferCoRouter.post("/trans_co_view", async (req, res) => {
  var data = req.body;

  try{
    var select = "a.trf_date,a.group_code,a.from_co,a.from_brn,a.to_co,a.to_brn,a.remarks,a.approval_status",
    table_name = "td_co_transfer a LEFT JOIN md_group b ON a.group_code = b.group_code LEFT JOIN md_employee c ON a.from_co = c.emp_id LEFT JOIN md_employee d ON a.to_co = b.emp_id",
    whr = `a.group_code = '${data.group_code}'`,
    order = null;
    var view_co_trans_dt = await db_Select(select,table_name,whr,order);

    res.send(view_co_trans_dt)
  }catch (error) {
    res.send({"suc": 2, "msg": "Error occurred", error })
  }
});

module.exports = {transferCoRouter}