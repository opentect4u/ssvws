var dateFormat = require("dateformat");
const { db_Select } = require("../../model/mysqlModel");

module.exports = {
    app_login_data : (data) => {
        return new Promise(async (resolve, reject) => {
          // var select = "a.emp_id,a.brn_code, a.user_type, a.password, b.user_type, c.emp_name, c.phone_home, c.phone_mobile, c.email, c.gender, c.active_flag, d.branch_name, d.dist_code, c.area_code, e.area_name, f.state_code, f.dist_id, f.block_id, f.zone_name",
          // table_name = "md_user a, md_user_type b,  md_employee c, md_branch d, md_area e, md_zone f",
          // whr = `a.emp_id=c.emp_id
          // AND  a.user_type=b.type_code
          // AND a.brn_code=d.branch_code
          // AND c.area_code=e.area_code 
          // AND e.zone_code=f.zone_code
          // AND a.emp_id = '${data.emp_id}'
          // AND a.user_status = 'A'`
          // order = null;

          if(data.flag == 'A'){
          var select = "a.emp_id,a.brn_code, a.user_type id, a.password, b.user_type, c.emp_name, c.phone_home, c.phone_mobile, c.email, c.gender, c.active_flag, c.area_code, d.branch_name, d.dist_code",
          table_name = "md_user a, md_user_type b,  md_employee c, md_branch d",
          whr = `a.emp_id=c.emp_id
          AND  a.user_type=b.type_code
          AND a.brn_code=d.branch_code
          AND a.emp_id = '${data.emp_id}'
          AND a.user_status = 'A'`
          order = null;
        var login_dt = await db_Select(select, table_name, whr, order);
        resolve(login_dt);
          }else {
            var select = "a.emp_id,a.brn_code, a.user_type id, a.password, b.user_type, c.emp_name, c.phone_home, c.phone_mobile, c.email, c.gender, c.active_flag, c.area_code, d.branch_name, d.dist_code",
            table_name = "md_user a, md_user_type b,  md_employee c, md_branch d",
            whr = `a.emp_id=c.emp_id
            AND  a.user_type=b.type_code
            AND a.brn_code=d.branch_code
            AND a.emp_id = '${data.emp_id}'
            AND a.user_status = 'A'`
            order = null;
          var login_dt = await db_Select(select, table_name, whr, order);
          resolve(login_dt);
          }
        });
},

// bm_login_data : (data) => {
//   return new Promise(async (resolve, reject) => {

//     var select = "a.emp_id,a.brn_code, a.user_type id, a.password, b.user_type, c.emp_name, c.phone_home, c.phone_mobile, c.email, c.gender, c.active_flag, c.area_code, d.branch_name, d.dist_code",
//     table_name = "md_user a, md_user_type b,  md_employee c, md_branch d",
//     whr = `a.emp_id=c.emp_id
//     AND  a.user_type=b.type_code
//     AND a.brn_code=d.branch_code
//     AND a.emp_id = '${data.emp_id}'
//     AND a.user_status = 'A'`
//     order = null;
//   var bm_login_dt = await db_Select(select, table_name, whr, order);
//   resolve(bm_login_dt);
//   });
// }

}