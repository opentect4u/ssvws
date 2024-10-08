const { db_Select } = require('../../model/mysqlModel');

const fetchRouter = require('express').Router();
dateFormat = require('dateformat');

fetchRouter.get("/fetch_bmfwd_dtls_web", async (req, res) => {
    var data = req.query;
    console.log(data,'dd');
    
    var select = 'DISTINCT a.prov_grp_code, b.group_name',
    table_name = 'td_grt_basic a, md_group b',
    whr = `a.prov_grp_code = b.group_code
    AND a.approval_status = 'S' ${data.prov_grp_code > 0 ? `AND a.prov_grp_code = ${data.prov_grp_code}` : ''}`,
    order = null;
    var res_dt = await db_Select(select,table_name,whr,order);
    res.send(res_dt)
});

module.exports = {fetchRouter}