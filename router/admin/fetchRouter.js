const { db_Select, db_Insert } = require('../../model/mysqlModel');
const { edit_grp_web, edit_basic_dt_web, edit_occup_dt_web, edit_household_dt_web, edit_family_dt_web, fwd_mis_asst } = require('../../modules/admin/fetchModule');

const fetchRouter = require('express').Router();
dateFormat = require('dateformat');

// fetchRouter.post("/fetch_bmfwd_dtls_web", async (req, res) => {
//     var data = req.body;
//     console.log(data, 'dd');
    
//     var select = data.prov_grp_code > 0 ? 'a.prov_grp_code, b.*' : 'DISTINCT a.prov_grp_code, b.group_name, b.group_type',
//     table_name = 'td_grt_basic a, md_group b',
//     whr = `a.prov_grp_code = b.group_code
//            ${data.user_type == 2 && data.branch_code > 0 ? `AND a.approval_status = 'U' : a.approval_status = 'S'`}` 
//            ${data.prov_grp_code > 0 ? `AND a.prov_grp_code = ${data.prov_grp_code}` : ''} 
//            ${data.user_type == 2 && data.branch_code > 0 ? `AND a.branch_code = ${data.branch_code}` : ''}`,
//     order = null;
    
//     var res_dt = await db_Select(select, table_name, whr, order);

//     if (res_dt.suc > 0 && res_dt.msg.length > 0 && data.prov_grp_code > 0) {
//         var select = '*',
//         table_name = 'td_grt_basic',
//         whr = `approval_status = 'S' AND prov_grp_code = ${data.prov_grp_code}`,
//         order = null;
        
//         var mem_dt = await db_Select(select, table_name, whr, order);
//         res_dt.msg[0]['memb_dt'] = mem_dt.suc > 0 ? (mem_dt.msg.length > 0 ? mem_dt.msg : []) : []
//     }
//     res.send(res_dt);
// });

fetchRouter.post("/fetch_bmfwd_dtls_web", async (req, res) => {
    var data = req.body;
    console.log(data, 'dd');

    var select = data.prov_grp_code > 0 ? 'a.prov_grp_code, b.*' : 'DISTINCT a.prov_grp_code, b.group_name, b.group_type',
        table_name = 'td_grt_basic a, md_group b',
        whr = `a.prov_grp_code = b.group_code
               ${data.user_type == 2 && data.branch_code > 0 ? `AND a.approval_status = 'U'` : `AND a.approval_status = 'S'`}
               ${data.prov_grp_code > 0 ? `AND a.prov_grp_code = ${data.prov_grp_code}` : ''}
               ${data.user_type == 2 && data.branch_code > 0 ? `AND a.branch_code = ${data.branch_code}` : ''}`,
        order = null;
    
    var res_dt = await db_Select(select, table_name, whr, order);

    if (res_dt.suc > 0 && res_dt.msg.length > 0 && data.prov_grp_code > 0) {
        var select = '*',
            table_name = 'td_grt_basic',
            whr = `prov_grp_code = ${data.prov_grp_code} ${data.user_type == 3 ? `AND approval_status = 'S'` : `AND approval_status != ''`}`,
            order = null;
        
        var mem_dt = await db_Select(select, table_name, whr, order);
        res_dt.msg[0]['memb_dt'] = mem_dt.suc > 0 ? (mem_dt.msg.length > 0 ? mem_dt.msg : []) : [];
    }
    
    res.send(res_dt);
});

fetchRouter.get("/fetch_form_dtls_web", async (req, res) => {
    var data = req.query;

    var select = "a.branch_code,a.member_code,a.client_name,b.form_no,b.grt_date,b.approval_status,c.branch_name",
    table_name = "md_member a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code",
    whr = `a.branch_code = '${data.branch_code}' AND b.approval_status = '${data.approval_status}' AND b.delete_flag = 'N'`,
    order = null;
    var fetch_dtls_web = await db_Select(select,table_name,whr,order)

    res.send(fetch_dtls_web);
});

fetchRouter.post("/fetch_basic_dtls_web", async (req, res) => {
    var data = req.body;

    var select = "a.*,b.*",
    table_name = "md_member a, td_grt_basic b",
    whr = `a.branch_code = b.branch_code 
    AND a.member_code = b.member_code 
    AND a.branch_code IN (${data.branch_code})
    AND b.form_no = '${data.form_no}' 
    AND b.approval_status = '${data.approval_status}'`,
    order = null;
    var fetch_basic = await db_Select(select,table_name,whr,order)

    res.send(fetch_basic);
});


fetchRouter.get("/fetch_occup_dt_web", async (req, res) => {
    var data = req.query;

    var select = "a.form_no,a.self_occu,a.self_income,a.spouse_occu,a.spouse_income,a.loan_purpose,a.sub_pupose,a.applied_amt,a.other_loan_flag,a.other_loan_amt,a.other_loan_emi,b.purpose_id,c.sub_purp_name",
    table_name = "td_grt_occupation_household a, md_purpose b, md_sub_purpose c",
    whr = `a.loan_purpose = b.purp_id 
    AND a.sub_pupose = c.sub_purp_id 
    AND a.branch_code IN (${data.branch_code})
    AND a.form_no = '${data.form_no}'`,
    order = null;
    var occup_dt = await db_Select(select,table_name,whr,order)
    res.send(occup_dt)
});

fetchRouter.get("/fetch_household_dt_web", async (req, res) => {
    var data = req.query;

    var select = "form_no,house_type,own_rent,no_of_rooms,land,tv_flag,bike_flag,fridge_flag,wm_flag,poltical_flag,parental_addr,parental_phone",
    table_name = "td_grt_occupation_household",
    whr = `branch_code IN (${data.branch_code}) AND form_no = '${data.form_no}'`,
    order = null;
    var household_dt = await db_Select(select,table_name,whr,order)
    res.send(household_dt)
});

fetchRouter.get("/fetch_family_dt_web", async (req, res) => {
    var data = req.query;

    var select = "form_no,sl_no,family_name name,relation,family_dob,age,sex,education,stu_work_flag studyingOrWorking,monthly_income monthlyIncome",
    table_name = "td_grt_family",
    whr = `branch_code IN (${data.branch_code}) AND form_no = '${data.form_no}'`,
    order = null;
    var family_dt = await db_Select(select,table_name,whr,order)
    res.send(family_dt)
});

fetchRouter.post("/edit_group_web", async (req, res) => {
    var data = req.body;
    // console.log(data,'grp_dt');

    var edit_grp_dt = await edit_grp_web(data);
    // console.log(grp_dt,'grp');
    
    res.send(edit_grp_dt);
});

fetchRouter.post("/edit_basic_dtls_web", async (req, res) => {
    var data = req.body;
  
    var basic_dt_web = await edit_basic_dt_web(data);
    res.send(basic_dt_web);
  });
  
  fetchRouter.post("/edit_occup_dtls_web", async (req, res) => {
    var data = req.body;
  
    var occup_dt_web = await edit_occup_dt_web(data);
    res.send(occup_dt_web);
  });
  
  fetchRouter.post("/edit_household_dtls_web", async (req, res) => {
    var data = req.body;
  
    var household_dt_web = await edit_household_dt_web(data);
    res.send(household_dt_web);
  });

  fetchRouter.post("/edit_family_dtls_web", async (req, res) => {
    var data = req.body, res_data;

    edit_family_dt_web(data).then(data => {
        res_data = data
    }).catch(err => {
        res_data = err
    }).finally(() => {
    res.send(res_data);
})
  });

  fetchRouter.get("/fetch_form_fwd_bm_web", async (req, res) => {
    var data = req.query;

    var select = "a.branch_code,a.member_code,a.client_name,b.form_no,b.grt_date,b.approval_status,b.remarks,b.rejected_by,b.rejected_at,c.branch_name",
    table_name = "md_member a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code",
    whr = `a.branch_code IN (${data.branch_code}) AND b.approval_status = '${data.approval_status}' AND b.delete_flag = 'N'`,
    order = null;
    var fetch_bm_fwd_dt = await db_Select(select,table_name,whr,order)

    res.send(fetch_bm_fwd_dt);
  });

  fetchRouter.post("/delete_member_mis", async (req, res) => {
    var data = req.body;
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var table_name = "td_grt_basic",
    fields = `approval_status = '${data.approval_status}', remarks = '${data.remarks.split("'").join("\\'")}', rejected_by = '${data.rejected_by}', rejected_at = '${datetime}'`,
    values = null,
    whr = `form_no = '${data.form_no}' AND member_code = '${data.member_code}'`,
    flag = 1;
    var delete_mem_dt = await db_Insert(table_name, fields, values, whr, flag);
    res.send(delete_mem_dt)
});  

fetchRouter.post("/forward_mis_asst", async (req, res) => {
    var data = req.body;

    var fwd_dt = await fwd_mis_asst(data);
    res.send(fwd_dt)
});

fetchRouter.post("/verify_by_mis", async (req, res) => {
    const data = req.body;
    let value = '';
    
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    switch (data.flag) {
        case "PH":
            value = `phone_verify_flag = '${data.verify_value}'`;
            break;
        case "A":
            value = `aadhar_verify_flag = '${data.verify_value}'`;
            break;
        case "P":
            value = `pan_verify_flag = '${data.verify_value}'`;
            break;
        default:
            return res.status(400).send({ suc: 0, msg: [], status: 'Invalid flag provided' });
    }

    try {
        var verify_dtls = await db_Insert('md_member', value, null,
            `member_code = '${data.member_id}'`, 1
        );

        if (verify_dtls.suc > 0) {
            return res.send({ suc: 1, msg: 'Verification details updated successfully', data: verify_dtls.msg });
        } else {
            return res.send(verify_dtls);
        }
    } catch (error) {
        return res.send({ suc: 0, msg: 'Error occurred', error: error.message });
    }
});

fetchRouter.get("/fetch_verify_flag", async (req, res) => {
    var data = req.query;

    var select = "phone_verify_flag,aadhar_verify_flag,pan_verify_flag",
    table_name = "md_member",
    // whr = `form_no = '${data.form_no}' AND member_code = '${data.member_code}'`,
    whr = `member_code = '${data.member_code}'`,
    order = null;
    var fetch_dt = await db_Select(select,table_name,whr,order);
    res.send(fetch_dt)
});

fetchRouter.get("/mis_approve_dtls", async (req, res) => {
    var data = req.query

    var select = "member_code,client_name,remarks",
    table_name = "td_grt_basic",
    whr = `approval_status = 'A' AND form_no = '${data.form_no}' AND member_code = '${data.member_code}' AND approved_by = '${data.approved_by}'`,
    order = null;

    var res_dt = await db_Select(select,table_name,whr,order);
    res.send(res_dt)
});

fetchRouter.post("/approved_dtls", async (req, res) => {
    var data = req.body

    if(data.user_type == '2' && data.approval_status == 'U'){
        var select = "created_by,created_at,co_gps_address",
        table_name = "td_grt_basic",
        whr = `form_no = '${data.form_no}'`,
        order = null;
        var approve_dt = await db_Select(select,table_name,whr,order);

    } else if (data.user_type == '2' && data.approval_status == 'S'){
        var select = "created_by,created_at,co_gps_address,modified_by,modified_at,bm_gps_address",
        table_name = "td_grt_basic",
        whr = `form_no = '${data.form_no}'`,
        order = null;
        var approve_dt = await db_Select(select,table_name,whr,order);

    }else if (data.user_type == '3' && data.approval_status == 'S'){
        var select = "created_by,created_at,co_gps_address,modified_by,modified_at,bm_gps_address",
        table_name = "td_grt_basic",
        whr = `form_no = '${data.form_no}'`,
        order = null;
        var approve_dt = await db_Select(select,table_name,whr,order);

    } else if (data.approval_status == 'A'){
        var select = "created_by,created_at,co_gps_address,modified_by,modified_at,bm_gps_address,approved_by,approved_at",
        table_name = "td_grt_basic",
        whr = `form_no = '${data.form_no}'`,
        order = null;
        var approve_dt = await db_Select(select,table_name,whr,order);
    }
    else {
        var select = "created_by,created_at,co_gps_address,modified_by,modified_at,bm_gps_address,rejected_by,rejected_at",
        table_name = "td_grt_basic",
        whr = `form_no = '${data.form_no}'`,
        order = null;
        var approve_dt = await db_Select(select,table_name,whr,order);

    }

    res.send(approve_dt);
});


fetchRouter.post("/search_application", async (req, res) => {
    var data = req.body;

    var select = "a.*,b.*,c.branch_name",
    table_name = "md_member a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code",
    whr = `a.client_name like '%${data.search_appl}%' OR a.client_mobile like '%${data.search_appl}%' OR a.member_code like '%${data.search_appl}%' OR b.form_no like '%${data.search_appl}%'`,
    order = null;
    var search_app = await db_Select(select,table_name,whr,order);

    res.send(search_app)
});

fetchRouter.post("/search_group_web", async (req, res) => {
    var data = req.body;

    var select = "group_code,group_name,group_type",
    table_name = "md_group",
    whr = `group_name like '%${data.group_name}%'`,
    order = null;
    var search_group_web = await db_Select(select,table_name,whr,order);

    res.send(search_group_web)
});

fetchRouter.post("/edit_search_group_web", async (req, res) => {
    var data = req.body;

    var select = "a.*, b.block_name,c.emp_name",
    table_name = "md_group a LEFT JOIN md_block b ON a.block = b.block_id LEFT JOIN md_employee c ON a.co_id = c.emp_id",
    whr = `a.group_code = '${data.group_code}'`,
    order = null;
    var edit_search_group_web = await db_Select(select,table_name,whr,order);

    if(edit_search_group_web.suc > 0){
        var select = "a.member_code,a.client_name,b.form_no",
        table_name = "md_member a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code",
        whr = `a.branch_code IN (${data.branch_code}) AND b.prov_grp_code = '${data.group_code}'`,
        order = null;
        var grp_mem_dt = await db_Select(select,table_name,whr,order);
    }

    res.send(edit_search_group_web)
});

fetchRouter.post("/search_member_web", async (req, res) => {
    var data = req.body;

    var select = "member_code,client_name",
    table_name = "md_member",
    whr = `client_name like '%${data.client_name}%'`,
    order = null;
    var search_member_web = await db_Select(select,table_name,whr,order);

    res.send(search_member_web)
});

module.exports = {fetchRouter}