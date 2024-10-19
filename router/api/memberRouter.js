const { db_Select } = require('../../model/mysqlModel');
const { edit_search_basic } = require('../../modules/api/memberModule');

const express = require('express'),
memberRouter = express.Router(),
dateFormat = require('dateformat');

memberRouter.post("/search_member", async (req, res) => {
    var data = req.body;

    // var select = "a.*, b.group_name",
    var select = "a.*",
    // table_name = "md_member a LEFT JOIN md_group b ON a.branch_code = b.branch_code",
    table_name = "md_member a",
    // whr = `a.branch_code = '${data.branch_code}' 
    // AND a.approval_status = '${data.flag}'
    // AND a.client_name like '%${data.search}%' OR a.client_mobile like '%${data.search}%' OR a.aadhar_no like '%${data.search}%' OR a.pan_no like '%${data.search}%'`,
    whr = `a.client_name like '%${data.search}%' OR a.client_mobile like '%${data.search}%' OR a.aadhar_no like '%${data.search}%' OR a.pan_no like '%${data.search}%'`,
    order = null;
    var search_mem = await db_Select(select,table_name,whr,order);

res.send(search_mem)
});

memberRouter.get("/get_grt_dtls", async (req, res) => {
    var data = req.query;

    var select = "a.form_no,a.grt_date,a.branch_code,a.prov_grp_code,a.member_code,a.approval_status,a.co_lat_val,a.co_long_val,a.co_gps_address,b.branch_name",
    table_name = "td_grt_basic a LEFT JOIN md_branch b ON a.branch_code = b.branch_code",
    whr = `a.member_code = '${data.member_code}'`,
    order = null;
    var dt_fetch = await db_Select(select,table_name,whr,order);

    res.send(dt_fetch)
})

memberRouter.post("/edit_search_basic_dtls", async (req, res) => {
    var data = req.body;

    var edit_dtls = await edit_search_basic(data);
    res.send(edit_dtls)
});

module.exports = {memberRouter}