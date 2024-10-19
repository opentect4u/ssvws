const { db_Select, db_Insert } = require('../../model/mysqlModel');
const { save_basic_dtls, grp_save, save_occu_dtls, edit_grt_data, edit_basic_dt, edit_occup_dt, edit_household_dt, edit_family_dt, edit_grp_save, final } = require('../../modules/api/grtformModule');

const express = require('express'),
grtformRouter = express.Router(),
dateFormat = require('dateformat');

grtformRouter.post("/save_basic_dtls", async (req, res) =>{
    var data = req.body, res_data;
    console.log(data,'dt');
    save_basic_dtls(data).then(data => {
        console.log(data);
        res_data = data
        console.log(res_data,'ttttt');
        
        // res.send(data)
    }).catch(err => {
        // console.log(err);
        res_data = err
        console.log(res_data);

        // res.send(err)
    }).finally(() => {
        res.send(res_data)
    })
    // console.log(basic_dt,'lo');
    
});

grtformRouter.post("/edit_grt_dtls", async (req, res) => {
    var data = req.body;

    var edit_grt_dt = await edit_grt_data(data)
    res.send(edit_grt_dt);
});

grtformRouter.get("/fetch_form_dtls", async (req, res) => {
    var data = req.query;

    var select = "a.branch_code,a.form_no,a.prov_grp_code,a.member_code,a.client_name,b.group_name",
    table_name = "td_grt_basic a, md_group b",
    whr = `a.prov_grp_code = b.group_code
    AND a.branch_code = '${data.branch_code}' AND a.approval_status = 'U' AND a.delete_flag = 'N'`,
    order = null;
    var fetch_dtls = await db_Select(select,table_name,whr,order)

    res.send(fetch_dtls);
});

grtformRouter.post("/fetch_basic_dtls", async (req, res) => {
    var data = req.body;

    var select = "a.*,b.group_name prov_grp_name",
    table_name = "td_grt_basic a, md_group b",
    whr = `a.prov_grp_code = b.group_code 
    AND a.branch_code = b.branch_code
    AND a.branch_code = '${data.branch_code}' 
    AND a.form_no = '${data.form_no}'` 
    // AND a.approval_status = 'U'`,
    order = null;
    var fetch_basic = await db_Select(select,table_name,whr,order)

    res.send(fetch_basic);
});


grtformRouter.post("/save_group", async (req, res) => {
    var data = req.body;
    // console.log(data,'grp_dt');

    var grp_dt = await grp_save(data);
    // console.log(grp_dt,'grp');
    
    res.send(grp_dt);
});

grtformRouter.post("/edit_group", async (req, res) => {
    var data = req.body;
    console.log(data,'edit_grp_dt');

    var edit_grp_dt = await edit_grp_save(data);
    console.log(edit_grp_dt,'grp');
    
    res.send(edit_grp_dt);
});

grtformRouter.post("/search_group", async (req, res) => {
    var data = req.body;

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

    var basic_dt = await edit_basic_dt(data)
    res.send(basic_dt);
});

grtformRouter.post("/save_occup_dtls", async (req, res) => {
    var data = req.body;

    var occup_dt = await edit_occup_dt(data)
    console.log(occup_dt);
    res.send(occup_dt);
});

grtformRouter.post("/save_household_dtls", async (req, res) => {
    var data = req.body;

    var household_dt = await edit_household_dt(data)
    res.send(household_dt);
});

grtformRouter.post("/save_family_dtls", async (req, res) => {
    var data = req.body, res_data;

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

    var select = "a.form_no,a.grt_date,a.self_occu,a.self_income,a.spouse_occu,a.spouse_income,a.loan_purpose,a.sub_pupose,a.applied_amt,a.other_loan_flag,a.other_loan_amt,a.other_loan_emi,b.purpose_id,c.sub_purp_name",
    table_name = "td_grt_occupation_household a, md_purpose b, md_sub_purpose c",
    whr = `a.loan_purpose = b.purp_id 
    AND a.sub_pupose = c.sub_purp_id 
    AND a.form_no = '${data.form_no}' AND a.branch_code = '${data.branch_code}'`,
    order = null;
    var occup_dtls = await db_Select(select,table_name,whr,order)
    res.send(occup_dtls)
});

grtformRouter.get("/fetch_household_dtls", async (req, res) => {
    var data = req.query;

    var select = "form_no,house_type,own_rent,no_of_rooms,land,tv_flag,bike_flag,fridge_flag,wm_flag,poltical_flag,parental_addr,parental_phone",
    table_name = "td_grt_occupation_household",
    whr = `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}'`,
    order = null;
    var household_dtls = await db_Select(select,table_name,whr,order)
    res.send(household_dtls)
});

grtformRouter.get("/fetch_family_dtls", async (req, res) => {
    var data = req.query;

    var select = "form_no,sl_no,grt_date,family_name name,relation,age,sex,education,stu_work_flag studyingOrWorking,monthly_income monthlyIncome",
    table_name = "td_grt_family",
    whr = `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}'`,
    order = null;
    var family_dtls = await db_Select(select,table_name,whr,order)
    res.send(family_dtls)
});

grtformRouter.post("/final_submit", async (req, res) => {
    var data = req.body;

    var final_dt = await final(data);
    res.send(final_dt)
});

module.exports = {grtformRouter}