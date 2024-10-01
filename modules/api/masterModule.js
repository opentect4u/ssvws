const { db_Select, db_Insert } = require("../../model/mysqlModel");

const getFormNo = () => {
    return new Promise(async (resolve, reject) => {
        year = new Date().getFullYear();

        var select = "IF(MAX(SUBSTRING(form_no, -6)) > 0, LPAD(MAX(cast(SUBSTRING(form_no, -6) as unsigned))+1, 6, '0'), '000001') max_form",
        table_name = "td_grt_basic",
        whr = `SUBSTRING(form_no, 1, 4) = YEAR(now())`,
        order = null;
        var res_dt = await db_Select(select, table_name, whr, order);
        var newId = `${year}${res_dt.msg[0].max_form}`        
      resolve(newId);
    });
  };

  const groupCode = () => {
    return new Promise(async (resolve, reject) => {

        var select = "IF(COUNT(group_code) > 0, MAX(group_code)+1, 1) group_code",
        table_name = "md_group",
        whr = null,
        order = null;
        var res_dt = await db_Select(select, table_name, whr, order);
      resolve(res_dt);
    });
  };

  const getMemberCode = () => {
    return new Promise(async (resolve, reject) => {

        var select = "IF(COUNT(member_code) > 0, MAX(member_code)+1, 1) member_code",
        table_name = "td_grt_basic",
        whr = null,
        order = null;
        var res_dt = await db_Select(select, table_name, whr, order);
      resolve(res_dt);
    });
  };

  module.exports = {getFormNo, groupCode, getMemberCode}