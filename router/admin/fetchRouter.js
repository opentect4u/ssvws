const { db_Select } = require('../../model/mysqlModel');

const fetchRouter = require('express').Router();
dateFormat = require('dateformat');

fetchRouter.get("/fetch_bmfwd_dtls_web", async (req, res) => {
    var data = req.query;
    console.log(data,'dd');
    
    var select = 'a.prov_grp_code, b.*, c.user_type',
    table_name = 'td_grt_basic a, md_group b, md_user c',
    whr = `a.prov_grp_code = b.group_code
    AND a.approval_status = 'S'
    AND c.user_type = '${data.id}'`,
    order = null;
    var res_dt = await db_Select(select,table_name,whr,order);
    res.send(res_dt)
});

module.exports = {fetchRouter}