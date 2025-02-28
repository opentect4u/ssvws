const { db_Select, db_Insert } = require('../../../model/mysqlModel');

const express = require('express'),
transferMemRouter = express.Router(),
dateFormat = require('dateformat');

//get group details
transferMemRouter.post("/fetch_group_name_fr_mem_trans", async (req, res) => {
    var data = req.body;

    if(!data.grp_mem || data.grp_mem.trim() === "") {
        return res.send({ "suc": 0, "msg": "No records found" });
    }

    try {
    var select = "group_code,branch_code,group_name,group_type,co_id,phone1",
    table_name = "md_group",
    whr = `branch_code = '${data.branch_code}' AND open_close_flag = 'O' AND approval_status = 'A' AND (group_code like '%${data.grp_mem}%' OR group_name like '%${data.grp_mem}%')`,
    order = `ORDER BY group_name`;
    var group_dt_mem_trans = await db_Select(select,table_name,whr,order);

    if(group_dt_mem_trans.suc > 0 && group_dt_mem_trans.msg.length > 0){
        return res.send(group_dt_mem_trans);
    }else {
        return res.send({ "suc": 0, "msg": "No data found"});
    }
}catch{
    console.error("Error fetching when search group:", error);
    return res.send({ suc: 0, msg: "Internal server error" });
}
});

//FETCH GROUP DETAILS
transferMemRouter.post("/fetch_grp_dtls", async (req, res) => {
  var data = req.body;

  try{
     var select = "a.group_code,a.group_name,a.co_id,b.emp_name co_name,b.branch_id,c.branch_name",
     table_name = "md_group a LEFT JOIN md_employee b ON a.co_id = b.emp_id LEFT JOIN md_branch c ON b.branch_id = c.branch_code",
     whr = `a.branch_code = '${data.branch_code}' AND a.group_code = '${data.group_code}'`,
     order = null;
     var fetch_grp_details = await db_Select(select,table_name,whr,order);
     if (fetch_grp_details.suc > 0 && fetch_grp_details.msg.length > 0) {
        // If employee details found
        return res.send({
            suc: 1,
            msg: fetch_grp_details.msg
        });
    } else {
        // If no details found in 'md_employee'
        return res.send({
            suc: 0,
            msg: [],
            details: "CO details not found"
        });
    }
  } catch(error){
    // Handle errors gracefully
    console.error("Error fetching details:", error);
    return res.send({ suc: 0, msg: "Internal server error" });
  }
});

//FETCH GROUP MEMBER DETAILS FOR TRANSFER
transferMemRouter.post("/fetch_group_member_dtls", async (req, res) => {
    var data = req.body;

    try {
            var select = "a.loan_id,a.group_code,c.group_name,a.member_code,b.client_name,SUM(a.prn_amt + a.od_prn_amt + a.intt_amt + a.od_intt_amt) outstanding";
            table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN md_group c ON a.group_code = c.group_code";
            whr = `a.group_code = '${data.group_code}'`,
            order = `GROUP BY a.loan_id,a.group_code,a.member_code,b.client_name,c.group_name`;
            var fetch_grp_mem_dt = await db_Select(select, table_name, whr, order);
            if (fetch_grp_mem_dt.suc > 0 && fetch_grp_mem_dt.msg.length > 0) {
                // If member details found
                return res.send({
                    suc: 1,
                    msg: fetch_grp_mem_dt.msg
                });
            } else {
                // If no details found
                return res.send({
                    suc: 0,
                    msg: [],
                    details: "Member details not found"
                });
            }
    } catch (error) {
        // Handle errors gracefully
        console.error("Error fetching details:", error);
        return res.send({ suc: 0, msg: "Internal server error" });
    }
});

const isValidDate = (dateString) => {
    const date = new Date(dateString)
    return date.toString() !== 'Invalid Date' && !isNaN(date)
}

// TRANSFER MEMBER ONE GROUP TO ANOTHER GROUP
transferMemRouter.post("/transfer_member", async (req, res) => {
    var data = req.body;
    console.log(data, 'data');

    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    try {
        if (data.trans_mem_dtls && data.trans_mem_dtls.length > 0) {
            console.log(data.trans_mem_dtls, 'trans_mem_dtls');

            for (let dt of data.trans_mem_dtls) {
                console.log(dt, 'dts');

                var member_code_arr = data.trans_mem_dtls.map(pdt => `'${pdt.member_code}'`);

                console.log(member_code_arr, 'poiu');

                var table_name = "td_member_transfer",
                    fields = `(mem_trans_date,member_code,from_group,from_branch,from_co,to_group,to_branch,to_co,remarks,created_by,created_at)`,
                    values = `('${data.mem_trans_date}','${dt.member_code}','${data.from_group}','${data.from_branch}','${data.from_co}','${data.to_group}','${data.to_branch}','${data.to_co}','${data.remarks.split("'").join("\\'")}','${data.created_by}','${datetime}')`,
                    whr = null,
                    flag = 0;

                var save_trans_mem_dtls = await db_Insert(table_name, fields, values, whr, flag);

                if (save_trans_mem_dtls.suc > 0 && save_trans_mem_dtls.msg.length > 0) {
                    var select = "form_no,grt_date,branch_code,prov_grp_code,member_code,approval_status,remarks,grp_added_by,grp_added_at,delete_flag,deleted_by,deleted_at,created_by,created_at,modified_by,modified_at,approved_by,approved_at,rejected_by,rejected_at,co_lat_val,co_long_val,co_gps_address,bm_lat_val,bm_long_val,bm_gps_address",
                        table_name = "td_grt_basic",
                        whr = `prov_grp_code = '${data.from_group}' AND member_code IN (${member_code_arr.join(',')})`,
                        order = null;

                    var fetch_member = await db_Select(select, table_name, whr, order);
                    console.log(fetch_member, 'fetch_member');

                    if (fetch_member.suc > 0 && fetch_member.msg.length > 0) {
                        for (let member of fetch_member.msg) {
                            console.log(member, 'member data');

                            grt_date = isValidDate(member.grt_date) ? dateFormat(member.grt_date, "yyyy-mm-dd") : null;
                            grp_added_at = isValidDate(member.grp_added_at) ? dateFormat(member.grp_added_at, "yyyy-mm-dd") : null;
                            // deleted_at = isValidDate(member.deleted_at) ? dateFormat(member.deleted_at, "yyyy-mm-dd") : null;
                            created_at = isValidDate(member.created_at) ? dateFormat(member.created_at, "yyyy-mm-dd") : null;
                            modified_at = isValidDate(member.modified_at) ? dateFormat(member.modified_at, "yyyy-mm-dd") : null;
                            approved_at = isValidDate(member.approved_at) ? dateFormat(member.approved_at, "yyyy-mm-dd") : null;
                            rejected_at = isValidDate(member.rejected_at) ? dateFormat(member.rejected_at, "yyyy-mm-dd") : null;

                            var table_name = "td_grt_basic_rep",
                                fields = `(form_no,grt_date,branch_code,prov_grp_code,member_code,approval_status,remarks,grp_added_by,grp_added_at,delete_flag,deleted_by,deleted_at,created_by,created_at,modified_by,modified_at,approved_by,approved_at,rejected_by,rejected_at,co_lat_val,co_long_val,co_gps_address,bm_lat_val,bm_long_val,bm_gps_address)`,
                                values = `('${member.form_no}',${member.grt_date && member.grt_date !== '0000-00-00' ? `'${member.grt_date}'` : 'NULL'},'${member.branch_code}','${member.prov_grp_code}','${member.member_code}','${member.approval_status}',${member.remarks ?  `'${member.remarks}'` : 'NULL'},'${member.grp_added_by}',${member.grp_added_at ? `'${member.grp_added_at}'` : 'NULL'},'${member.delete_flag}','${member.deleted_by}','${dateFormat(member.deleted_at, "yyyy-mm-dd")}','${member.created_by}',${member.created_at ? `'${member.created_at}'` : 'NULL'},'${member.modified_by}',${member.modified_at ? `'${member.modified_at}'` : 'NULL'},'${member.approved_by}',${member.approved_at ? `'${member.approved_at}'` : 'NULL'},'${member.rejected_by}',${member.rejected_at ? `'${member.rejected_at}'` : 'NULL'},'${member.co_lat_val}','${member.co_long_val}','${member.co_gps_address}','${member.bm_lat_val}','${member.bm_long_val}','${member.bm_gps_address}')`,
                                whr = null,
                                flag = 0;

                            var member_data = await db_Insert(table_name, fields, values, whr, flag);
                            console.log(member_data, 'member_data');
                        }
                    }
                }
            }
            res.send({ "suc": 1, "msg": "Transfer completed successfully" });
        } else {
            res.send({ "suc": 0, "msg": "No member details provided" });
        }
    } catch (error) {
        console.error(error);
        res.send({ "suc": 0, "msg": "Error occurred", details: error });
    }
});


//APPROVE TRANSFER MEMBER DETAILS
transferMemRouter.post("/approve_member_trans_dt", async (req, res) => {
    var data = req.body;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
        var table_name = "td_member_transfer",
        fields = `to_group = '${data.to_group}', to_branch = '${data.to_branch}', to_co = '${data.to_co}', remarks = '${data.remarks.split("'").join("\\'")}', approval_status = 'A', approved_by = '${data.approved_by}', approved_at = '${datetime}'`,
        values = null,
        whr = `member_code = '${data.member_code}'`,
        flag = 1;
        var approve_grp_member_dtls = await db_Insert(table_name,fields,values,whr,flag);

        if(approve_grp_member_dtls.suc > 0 && approve_grp_member_dtls.msg.length > 0){
            var table_name = "td_grt_basic",
            fields = `prov_grp_code = '${data.to_group}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `member_code IN (${member_code_arr.join(',')})`,
            flag = 1;
            var update_grt_group_dtls = await db_Insert(table_name,fields,values,whr,flag);  
        }

        res.send(update_grt_group_dtls);
    }catch (error){
        res.send({"suc": 2, "msg": "Error occurred", details: error });
        
    }
});

transferMemRouter.post("/transfer_member_view", async (req, res) => {
  var data = req.body;

  try{
    if(data.flag == 'P'){
        var select = "a.mem_trans_date,a.member_code,a.from_group from_group_code,b.from_co from_co_id,a.to_group from_group_code,a.to_co to_co_id,a.approval_status,b.client_name,c.group_name from_group,d.emp_name from_co,e.group_name to_group,f.emp_name to_co",
        table_name = "td_member_transfer a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN md_group c ON a.from_group = c.group_code LEFT JOIN md_employee d ON a.from_co = d.emp_id LEFT JOIN md_group e ON a.to_group = e.group_code LEFT JOIN md_employee f ON a.to_co = f.emp_id",
        whr = `a.approval_status = 'U'`,
        order = `ORDER BY a.mem_trans_date`;
        var view_data = await db_Select(select,table_name,whr,order);
       
        res.send(view_data)
    }else {
    var select = "a.mem_trans_date,a.member_code,a.from_group from_group_code,b.from_co from_co_id,a.to_group from_group_code,a.to_co to_co_id,a.approval_status,b.client_name,c.group_name from_group,d.emp_name from_co,e.group_name to_group,f.emp_name to_co",
    table_name = "td_member_transfer a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN md_group c ON a.from_group = c.group_code LEFT JOIN md_employee d ON a.from_co = d.emp_id LEFT JOIN md_group e ON a.to_group = e.group_code LEFT JOIN md_employee f ON a.to_co = f.emp_id",
    whr = `a.approval_status = 'A'`,
    order = `ORDER BY a.mem_trans_date`;
    var view_data = await db_Select(select,table_name,whr,order);
   
    res.send(view_data)
    }
  }catch (error) {
    res.send({"suc": 2, "msg": "Error occurred", error })
  }
});

module.exports = {transferMemRouter}