const { db_Select, db_Insert } = require('../../model/mysqlModel');
const { save_basic_dtls, grp_save, save_occu_dtls, edit_grt_data, edit_basic_dt, edit_occup_dt, edit_household_dt, edit_family_dt, edit_grp_save, final } = require('../../modules/api/grtformModule');

const express = require('express'),
grtformRouter = express.Router(),
dateFormat = require('dateformat');

grtformRouter.post("/save_basic_dtls", async (req, res) =>{
    var data = req.body, res_data;
    // console.log(data,'grt dt');

    //save basic details
    save_basic_dtls(data).then(data => {
        // console.log(data);
        res_data = data
        // console.log(res_data,'ttttt');
        
        // res.send(data)
    }).catch(err => {
        // console.log(err);
        res_data = err
        // console.log(res_data);

        // res.send(err)
    }).finally(() => {
        res.send(res_data)
    })
    // console.log(basic_dt,'lo');
    
});

grtformRouter.post("/edit_grt_dtls", async (req, res) => {
    var data = req.body;

    //edit grt details
    var edit_grt_dt = await edit_grt_data(data)
    res.send(edit_grt_dt);
});

grtformRouter.get("/fetch_form_dtls", async (req, res) => {
    var data = req.query;

    //fetch form details
    var select = "a.branch_code,a.member_code,a.client_name,b.form_no,b.grt_date,b.prov_grp_code",
    table_name = "md_member a LEFT JOIN td_grt_basic b ON a.member_code = b.member_code",
    whr = `a.branch_code = '${data.branch_code}' AND b.approval_status = 'U' AND b.delete_flag = 'N'`,
    order = null;
    var fetch_dtls = await db_Select(select,table_name,whr,order)

    res.send(fetch_dtls);
});

grtformRouter.post("/fetch_basic_dtls", async (req, res) => {
    var data = req.body;

    //fetch basic details
    var select = "a.*,b.*,c.group_name",
    table_name = "md_member a LEFT JOIN td_grt_basic b ON a.member_code = b.member_code LEFT JOIN md_group c ON b.prov_grp_code = c.group_code",
    whr = `a.branch_code = '${data.branch_code}' 
    AND b.form_no = '${data.form_no}' 
    AND b.approval_status = '${data.approval_status}'`,
    order = null;
    var fetch_basic = await db_Select(select,table_name,whr,order)

    res.send(fetch_basic);
});

grtformRouter.post("/fetch_co_brnwise", async (req, res) => {
    var data = req.body;

    var select = "a.emp_id,a.brn_code,a.user_type,b.emp_name",
    table_name = "md_user a, md_employee b",
    whr = `a.brn_code = '${data.brn_code}' AND a.emp_id = b.emp_id AND a.user_type = '1'`,
    order = null;

    var fetch_co_data = await db_Select(select,table_name,whr,order);

    res.send(fetch_co_data);
});

grtformRouter.post("/fetch_member_dtls_cowise", async (req, res) => {
    var data = req.body;

    var select = "a.form_no,a.member_code,b.client_name",
    table_name = "td_grt_basic a, md_member b",
    whr = `a.member_code = b.member_code 
    AND a.created_by = b.created_by
    AND a.prov_grp_code = '0'
    AND a.approval_status = 'U'
    AND a.branch_code = '${data.branch_code}' 
    AND a.created_by = '${data.co_id}'`,
    order = null;
    var fetch_mem_co = await db_Select(select,table_name,whr,order);

    res.send(fetch_mem_co)
});

grtformRouter.post("/save_group", async (req, res) => {
    var data = req.body;
    // console.log(data,'grp_dt');

    //save group details
    var grp_dt = await grp_save(data);
    // console.log(grp_dt,'grp');
    
    res.send(grp_dt);
});

grtformRouter.post("/edit_group", async (req, res) => {
    var data = req.body;
    // console.log(data,'edit_grp_dt');

    //edit group details
    var edit_grp_dt = await edit_grp_save(data);
    // console.log(edit_grp_dt,'grp');
    
    res.send(edit_grp_dt);
});

grtformRouter.post("/search_group", async (req, res) => {
    var data = req.body;

    //search group
if(data.user_type == 1){
    var select = "a.*, b.block_name",
    table_name = "md_group a LEFT JOIN md_block b ON a.block = b.block_id",
    // whr = `a.branch_code = '${data.branch_code}' AND a.co_id = '${data.co_id}' AND a.approval_status = '${data.flag}' AND a.group_name like '%${data.group_name}%'`,
    whr = `a.co_id = '${data.co_id}' AND a.group_name like '%${data.group_name}%'`,
    order = null;
    var search_grp = await db_Select(select,table_name,whr,order);
} else {
    var select = "a.*, b.block_name",
    table_name = "md_group a LEFT JOIN md_block b ON a.block = b.block_id",
    // whr = `a.branch_code = '${data.branch_code}' AND a.approval_status = '${data.flag}' AND a.group_name like '%${data.group_name}%'`,
    whr = `a.group_name like '%${data.group_name}%'`,
    order = null;
    var search_grp = await db_Select(select,table_name,whr,order);
}
//    console.log(search_grp);
   

    // if(data.grp_code > 0){
    //     var select = "*",
    //     table_name = "td_grt_basic",
    //     whr = `prov_grp_code = '${data.grp_code}' AND branch_code = '${data.branch_code}' AND approval_status = 'U'`,
    //     order = null;
    //     var member_dt = await db_Select(select, table_name, whr, order);
    
    //     search_grp.msg[0]["member_dt"] = member_dt.suc > 0 ? (member_dt.msg.length > 0 ? member_dt.msg : []) : [];
    // }

res.send(search_grp)
});

grtformRouter.post("/member_dt", async (req, res) => {
    var data = req.body;

    //member details
    var select = "*",
        table_name = "td_grt_basic",
        whr = `prov_grp_code = '${data.grp_code}' AND branch_code = '${data.branch_code}' AND approval_status = '${data.flag}'`,
        order = null;
        var member_dtls = await db_Select(select, table_name, whr, order);

        res.send(member_dtls)
});

grtformRouter.post("/delete_form", async (req, res) => {
    var data = req.body;
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    //delete form
    var table_name = "td_grt_basic",
    fields = `remarks = '${data.remarks.split("'").join("\\'")}', delete_flag = 'Y', deleted_by = '${data.deleted_by}', deleted_at = '${datetime}'`,
    values = null,
    whr = `form_no = '${data.form_no}' AND member_code = '${data.member_code}' AND branch_code = '${data.branch_code}'`,
    flag = 1;
    var delete_dt = await db_Insert(table_name, fields, values, whr, flag);
    res.send(delete_dt)
});

grtformRouter.post("/edit_basic_dtls", async (req, res) => {
    var data = req.body;

    //edit basic details
    var basic_dt = await edit_basic_dt(data)
    res.send(basic_dt);
});

grtformRouter.post("/save_occup_dtls", async (req, res) => {
    var data = req.body;

    //save occupation details
    var occup_dt = await edit_occup_dt(data)
    // console.log(occup_dt);
    res.send(occup_dt);
});

grtformRouter.post("/save_household_dtls", async (req, res) => {
    var data = req.body;

    //save household details
    var household_dt = await edit_household_dt(data)
    res.send(household_dt);
});

grtformRouter.post("/save_family_dtls", async (req, res) => {
    var data = req.body, res_data;

    //edit family details
    edit_family_dt(data).then(data => {
        res_data = data
    }).catch(err => {
        res_data = err
    }).finally(() => {
    res.send(res_data);
})
});

grtformRouter.get("/fetch_occup_dtls", async (req, res) => {
    var data = req.query;

    //fetch occupation details
    var select = "a.form_no,a.branch_code,a.self_occu,a.self_income,a.spouse_occu,a.spouse_income,a.loan_purpose,a.applied_amt,a.other_loan_flag,a.other_loan_amt,a.other_loan_emi,b.purpose_id",
    table_name = "td_grt_occupation_household a, md_purpose b",
    whr = `a.loan_purpose = b.purp_id
    AND a.form_no = '${data.form_no}' AND a.branch_code = '${data.branch_code}'`,
    order = null;
    var occup_dtls = await db_Select(select,table_name,whr,order)
    res.send(occup_dtls)
});

grtformRouter.get("/fetch_household_dtls", async (req, res) => {
    var data = req.query;

    //fetch household details
    var select = "form_no,branch_code,house_type,own_rent,no_of_rooms,land,tv_flag,bike_flag,fridge_flag,wm_flag,poltical_flag,parental_addr,parental_phone",
    table_name = "td_grt_occupation_household",
    whr = `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}'`,
    order = null;
    var household_dtls = await db_Select(select,table_name,whr,order)
    res.send(household_dtls)
});

grtformRouter.get("/fetch_family_dtls", async (req, res) => {
    var data = req.query;

    //fetch_family_details
    var select = "form_no,sl_no,branch_code,family_name name,relation,family_dob,age,sex,education,stu_work_flag studyingOrWorking,monthly_income monthlyIncome",
    table_name = "td_grt_family",
    whr = `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}'`,
    order = null;
    var family_dtls = await db_Select(select,table_name,whr,order)
    res.send(family_dtls)
});

grtformRouter.post("/final_submit", async (req, res) => {
    var data = req.body;

    //final submit
    var final_dt = await final(data);
    res.send(final_dt)
});

grtformRouter.post("/search_co", async (req, res) => {
    var data = req.body;

    //search via co
    var select = "a.emp_id,a.emp_name,a.guardian_name,a.addr,a.pin_code",
    table_name = "md_employee a LEFT JOIN md_user b ON a.branch_id = b.brn_code AND a.emp_id = b.emp_id",
    whr = `a.branch_id = '${data.branch_code}' AND (a.emp_id like '%${data.co_search}%' OR a.emp_name like '%${data.co_search}%')`,
    order = null;
    var search_co_dt = await db_Select(select,table_name,whr,order);

res.send(search_co_dt)
});

grtformRouter.post("/get_form_against_co", async (req, res) => {
    var data = req.body;

    //grt details form against co
    var select = "a.*,b.*",
    table_name = "md_member a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code",
    whr = `a.branch_code = '${data.branch_code}' AND a.created_by = '${data.created_by}'`,
    order = null;
    var search_co = await db_Select(select,table_name,whr,order);

res.send(search_co)
});

// grtformRouter.post("/bm_search_pending_form", async (req, res) => {
//     var data = req.body;

//     //branch manager search pending form
//     var select = "a.branch_code,a.member_code,a.client_name,b.form_no,b.grt_date,b.approval_status,b.prov_grp_code",
//     table_name = "md_member a LEFT JOIN td_grt_basic b ON a.member_code = b.member_code",
//     whr = `a.branch_code = '${data.branch_code}' AND b.approval_status = 'U'   AND b.delete_flag = 'N'; 
//     AND (a.member_code like '%${data.bm_search_pending}%' OR a.client_name like '%${data.bm_search_pending}%' OR a.client_mobile like '%${data.bm_search_pending}%' OR a.aadhar_no like '%${data.bm_search_pending}%' OR a.pan_no like '%${data.bm_search_pending}%')`,
//     order = null;
//     var search_bm_pending = await db_Select(select,table_name,whr,order);

//     if(search_bm_pending.suc > 0 && search_bm_pending.msg.length > 0){
//         let group_code = search_bm_pending.msg[0].prov_grp_code || 0;
//         console.log("Total members in group:", group_code);

//         if (group_code == 0) {
//             return res.send({ "suc": 0, "msg": "Please assign Group through Web" });
//         }
//     }

//     res.send(search_bm_pending);

// })

grtformRouter.post("/bm_search_pending_form", async (req, res) => {
    var data = req.body;

    //branch manager search pending form
    var select = "a.branch_code,a.member_code,a.client_name,b.form_no,b.grt_date,b.approval_status,b.prov_grp_code",
    table_name = "md_member a LEFT JOIN td_grt_basic b ON a.member_code = b.member_code",
    whr = `a.branch_code = '${data.branch_code}' AND b.approval_status = 'U'   AND b.delete_flag = 'N'`,
    order = null;
    var search_bm_pending = await db_Select(select,table_name,whr,order);

    if (data.bm_search_pending && data.bm_search_pending.trim() !== "") {
        whr += ` AND (a.member_code LIKE '%${data.bm_search_pending}%' 
            OR a.client_name LIKE '%${data.bm_search_pending}%' 
            OR a.client_mobile LIKE '%${data.bm_search_pending}%' 
            OR a.aadhar_no LIKE '%${data.bm_search_pending}%' 
            OR a.pan_no LIKE '%${data.bm_search_pending}%')`;
    } else {
        // If bm_search_pending is empty, return no data
        return res.send({ "suc": 0, "msg": "No records found" });
    }

    if(search_bm_pending.suc > 0 && search_bm_pending.msg.length > 0){
        let group_code = search_bm_pending.msg[0].prov_grp_code || 0;
        console.log("Total members in group:", group_code);

        if (group_code == 0) {
            return res.send({ "suc": 0, "msg": "Please assign Group through Web" });
        }
    }

    res.send(search_bm_pending);

})

module.exports = {grtformRouter}