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
    var select = "a.group_code,a.branch_code,a.group_name,a.group_type,a.co_id,a.phone1,b.branch_name",
    table_name = "md_group a LEFT JOIN md_branch b ON a.branch_code = b.branch_code",
    whr = `a.branch_code = '${data.branch_code}' AND a.open_close_flag = 'O' AND a.approval_status = 'A' AND (a.group_code like '%${data.grp}%' OR a.group_name like '%${data.grp}%')`,
    order = `ORDER BY a.group_name`;
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
            var select = "a.group_code,a.branch_code grp_brn,d.branch_name grp_brn_name,a.group_name,a.co_id,b.emp_name co_name,b.branch_id co_brn_id,c.branch_name co_brn_name";
            table_name = "md_group a LEFT JOIN md_employee b ON a.co_id = b.emp_id LEFT JOIN md_branch c ON b.branch_id = c.branch_code LEFT JOIN md_branch d ON a.branch_code = d.branch_code";
            whr = `a.branch_code = '${data.branch_code}' AND a.group_code = '${data.group_code}'`,
            order = null;
            var fetch_grp_co_dt = await db_Select(select, table_name, whr, order);
            if (fetch_grp_co_dt.suc > 0 && fetch_grp_co_dt.msg.length > 0) {
                // If employee details found
                return res.send({
                    suc: 1,
                    msg: fetch_grp_co_dt.msg
                });
            } 
            // else {
            //     return res.send({
            //         suc: 0,
            //         msg: [],
            //         details: "CO details not found"
            //     });
            // }
    } catch (error) {
        // Handle errors gracefully
        console.error("Error fetching group co details:", error);
        return res.send({ suc: 0, msg: "Internal server error" });
    }
});

//FETCH BRANCH NAME
transferCoRouter.post("/fetch_branch_name", async (req, res) => {
    var data = req.body;

    var select = "branch_code,branch_name",
    table_name = "md_branch",
    whr = `brn_status = 'O' AND (branch_code like '%${data.branch}%' OR branch_name like '%${data.branch}%')`,
    order = `ORDER BY branch_name`;
    var branch_data = await db_Select(select,table_name,whr,order);

    res.send(branch_data)
});

//FETCH CO NAME
transferCoRouter.post("/fetch_co_name_branchwise", async (req, res) => {
    var data = req.body;

    var select = "a.emp_id to_co_id,a.branch_id to_brn_id,a.emp_name to_co_name,b.user_type,c.branch_name to_brn_name",
    table_name = "md_employee a LEFT JOIN md_user b ON a.emp_id = b.emp_id LEFT JOIN md_branch c ON a.branch_id = c.branch_code",
    whr = `a.branch_id = '${data.branch_code}' AND b.user_type = '1' AND b.user_status = 'A'`,
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
                fields = `(trf_date,group_code,from_co,from_brn,to_co,to_brn,remarks,created_by,created_at)`,
                values = `('${datetime}','${data.group_code}','${data.from_co ? data.from_co : 0}','${data.from_brn}','${data.to_co}','${data.to_brn}','${data.remarks.split("'").join("\\'")}','${data.created_by}','${datetime}')`,
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
        fields = `to_co = '${data.to_co}', to_brn = '${data.to_brn}', remarks = '${data.remarks.split("'").join("\\'")}', approval_status = 'A', approved_by = '${data.approved_by}', approved_at = '${datetime}'`,
        values = null,
        whr = `group_code = '${data.group_code}'`,
        flag = 1;
        var approve_grp_co_dtls = await db_Insert(table_name,fields,values,whr,flag);

        if(approve_grp_co_dtls.suc > 0 && approve_grp_co_dtls.msg.length > 0){
            var table_name = "md_group",
            fields = `branch_code = '${data.to_brn}',co_id = '${data.to_co}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `group_code = '${data.group_code}'`,
            flag = 1;
            var update_grp_co_dtl = await db_Insert(table_name,fields,values,whr,flag);  

            var table_name = "td_loan",
            fields = `branch_code = '${data.to_brn}',modified_by = '${data.modified_by}', modified_dt = '${datetime}'`,
            values = null,
            whr = `group_code = '${data.group_code}'`,
            flag = 1;
            var update_td_loan_brn_dtl = await db_Insert(table_name,fields,values,whr,flag); 

            var member_sql = `SELECT form_no,member_code FROM td_grt_basic WHERE prov_grp_code = '${data.group_code}'`;
            var member_code_result = await db_Select("form_no,member_code", "td_grt_basic", `prov_grp_code = '${data.group_code}'`, null);
            const memberCodes = member_code_result.msg.map(row => `'${row.member_code}'`).join(",");
            const formNos = member_code_result.msg.map(row => `'${row.form_no}'`).join(",");
            
            var table_name = "md_member",
            fields = `branch_code = '${data.to_brn}',modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `member_code IN (${memberCodes})`,
            flag = 1;
            var update_md_member_brn_dtl = await db_Insert(table_name,fields,values,whr,flag);

            var table_name = "td_grt_basic",
            fields = `branch_code = '${data.to_brn}',modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `prov_grp_code = '${data.group_code}'`,
            flag = 1;
            var update_td_grt_basic_brn_dtl = await db_Insert(table_name,fields,values,whr,flag); 

            var table_name = "td_grt_occupation_household",
            fields = `branch_code = '${data.to_brn}',modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `form_no IN (${formNos})`,
            flag = 1;
            var update_td_grt_occup_brn_dtl = await db_Insert(table_name,fields,values,whr,flag); 
        }

        res.send(approve_grp_co_dtls);
    }catch (error){
        res.send({"suc": 2, "msg": "Error occurred", details: error });
        
    }
});

// TRANSFER CO DETAILS FOR VIEW

// transferCoRouter.post("/trans_co_view", async (req, res) => {
//   var data = req.body;

//   try{
//     if(data.flag == 'P'){
//         var select = "a.trf_date,a.group_code,a.from_co,a.to_co,b.group_name,a.approval_status",
//         table_name = "td_co_transfer a, md_group b",
//         whr = `a.group_code = b.group_code AND a.approval_status = 'U'`,
//         order = `ORDER BY a.group_code,b.group_name`;
//         var view_data = await db_Select(select,table_name,whr,order);
       
//         res.send(view_data)
//     }else {
//     var select = "a.trf_date,a.group_code,a.from_co,a.to_co,b.group_name,a.approval_status",
//     table_name = "td_co_transfer a, md_group b",
//     whr = `a.group_code = b.group_code AND a.approval_status = 'A'`,
//     order = `ORDER BY a.group_code,b.group_name`;
//     var view_data = await db_Select(select,table_name,whr,order);
   
//     res.send(view_data)
//     }
//   }catch (error) {
//     res.send({"suc": 2, "msg": "Error occurred", error })
//   }
// });

transferCoRouter.post("/trans_co_view", async (req, res) => {
  var data = req.body;

  try{
    const isPending = data.flag === 'P';
    const isAllBranch = data.branch_code == '100';

    const select = "a.trf_date,a.group_code,a.from_co,a.to_co,b.group_name,a.approval_status";
    const table_name = "td_co_transfer a, md_group b";
    let whr = `a.group_code = b.group_code 
               AND a.from_brn = b.branch_code 
               AND a.approval_status = '${isPending ? 'U' : 'A'}'`;
    if (!isAllBranch) {
      // Add branch filter only if not 100
      whr += ` AND a.from_brn IN (${data.branch_code})`;
    }
    const order = `ORDER BY a.group_code,b.group_name`;
    const view_data = await db_Select(select,table_name,whr,order);
    res.send(view_data)
  }catch (error) {
    res.send({"suc": 2, "msg": "Error occurred", error })
  }
});


transferCoRouter.post("/transfer_co_view_all_details", async (req, res) => {
 var data = req.body;

 try{
    if(data.flag == 'P'){
    var select = "a.trf_date,a.group_code,a.from_co,a.from_brn,a.to_co,a.to_brn,a.remarks,a.approval_status,a.created_by created_code,a.created_at,a.modified_by modified_code,b.modified_at,a.approved_by approved_code,a.approved_at,b.group_name,c.emp_name from_co_name,d.emp_name to_co_name,e.branch_name from_brn_name,f.branch_name to_brn_name,g.emp_name created_by,h.emp_name modified_by,i.emp_name approved_by",
    table_name = "td_co_transfer a LEFT JOIN md_group b ON a.group_code = b.group_code LEFT JOIN md_employee c ON a.from_co = c.emp_id LEFT JOIN md_employee d ON a.to_co = d.emp_id LEFT JOIN md_branch e ON a.from_brn = e.branch_code LEFT JOIN md_branch f ON a.to_brn = f.branch_code LEFT JOIN md_employee g ON a.created_by = g.emp_id LEFT JOIN md_employee h ON a.modified_by = h.emp_id LEFT JOIN md_employee i ON a.approved_by = i.emp_id",
    whr = `a.group_code = '${data.group_code}' AND a.from_co = '${data.from_co}' AND a.approval_status = 'U'`,
    order = `ORDER BY a.group_code,b.group_name`;
    var view_co_trans_dt = await db_Select(select,table_name,whr,order);
   
    res.send(view_co_trans_dt)
    }else {
        var select = "a.trf_date,a.group_code,a.from_co,a.from_brn,a.to_co,a.to_brn,a.remarks,a.approval_status,a.created_by created_code,a.created_at,a.modified_by modified_code,b.modified_at,a.approved_by approved_code,a.approved_at,b.group_name,c.emp_name from_co_name,d.emp_name to_co_name,e.branch_name from_brn_name,f.branch_name to_brn_name,g.emp_name created_by,h.emp_name modified_by,i.emp_name approved_by",
        table_name = "td_co_transfer a LEFT JOIN md_group b ON a.group_code = b.group_code LEFT JOIN md_employee c ON a.from_co = c.emp_id LEFT JOIN md_employee d ON a.to_co = d.emp_id LEFT JOIN md_branch e ON a.from_brn = e.branch_code LEFT JOIN md_branch f ON a.to_brn = f.branch_code LEFT JOIN md_employee g ON a.created_by = g.emp_id LEFT JOIN md_employee h ON a.modified_by = h.emp_id LEFT JOIN md_employee i ON a.approved_by = i.emp_id",
        whr = `a.group_code = '${data.group_code}' AND a.from_co = '${data.from_co}' AND a.approval_status = 'A'`,
        order = `ORDER BY a.group_code,b.group_name`;
        var view_co_trans_dt = await db_Select(select,table_name,whr,order); 
        res.send(view_co_trans_dt)
    }
  }catch (error) {
    res.send({"suc": 2, "msg": "Error occurred", error })
  }
});

// transferCoRouter.post("/transfer_co_view_all_details", async (req, res) => {
//  var data = req.body;

//  try{
//     const isPending = data.flag === 'P';
//     const isAllBranch = data.branch_code == '100';


//     const select = "a.trf_date,a.group_code,a.from_co,a.from_brn,a.to_co,a.to_brn,a.remarks,a.approval_status,a.created_by created_code,a.created_at,a.modified_by modified_code,b.modified_at,a.approved_by approved_code,a.approved_at,b.group_name,c.emp_name from_co_name,d.emp_name to_co_name,e.branch_name from_brn_name,f.branch_name to_brn_name,g.emp_name created_by,h.emp_name modified_by,i.emp_name approved_by";
//     const table_name = "td_co_transfer a LEFT JOIN md_group b ON a.group_code = b.group_code LEFT JOIN md_employee c ON a.from_co = c.emp_id LEFT JOIN md_employee d ON a.to_co = d.emp_id LEFT JOIN md_branch e ON a.from_brn = e.branch_code LEFT JOIN md_branch f ON a.to_brn = f.branch_code LEFT JOIN md_employee g ON a.created_by = g.emp_id LEFT JOIN md_employee h ON a.modified_by = h.emp_id LEFT JOIN md_employee i ON a.approved_by = i.emp_id";
//     let whr = `a.group_code = '${data.group_code}' 
//                AND a.from_co = '${data.from_co}' 
//                AND a.approval_status = '${isPending ? 'U' : 'A'}'`;
//     if (!isAllBranch) {
//       // Add branch filter only if not 100
//       whr += `AND a.from_brn = '${data.from_brn}'`;
//     }           
//     const order = `ORDER BY a.group_code,b.group_name`;
//     const view_co_trans_dt = await db_Select(select,table_name,whr,order);
//     res.send(view_co_trans_dt)
//   }catch (error) {
//     res.send({"suc": 2, "msg": "Error occurred", error })
//   }
// });

transferCoRouter.post("/groupwise_mem_details", async (req, res) => {
    var data = req.body;

    var select = "a.loan_id,a.group_code,a.member_code,SUM(a.prn_amt + a.od_prn_amt + a.intt_amt + a.od_intt_amt) outstanding,b.client_name,c.group_name",
    table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN md_group c ON a.group_code = c.group_code",
    whr = `a.group_code = '${data.group_code}'`,
    order = `GROUP BY a.loan_id,a.group_code,a.member_code,b.client_name,c.group_name`;
    var grp_mem_details = await db_Select(select,table_name,whr,order);

    res.send(grp_mem_details);
});

module.exports = {transferCoRouter}