const { db_Select } = require('../../model/mysqlModel');

const fetchRouter = require('express').Router();
dateFormat = require('dateformat');

fetchRouter.post("/fetch_bmfwd_dtls_web", async (req, res) => {
    var data = req.post;
    // console.log(data,'dd');
    
    var select = 'a.*, b.group_name',
    table_name = 'td_grt_basic a, md_group b',
    whr = `a.prov_grp_code = b.group_code
    AND a.approval_status = 'S'`,
    order = null;
    var res_dt = await db_Select(select,table_name,whr,order);
    res.send(res_dt)
});

module.exports = {fetchRouter}