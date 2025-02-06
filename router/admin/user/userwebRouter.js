const { db_Select, db_Insert } = require('../../../model/mysqlModel');
const { save_user_dtls, edit_user_dt, change_pass_data } = require('../../../modules/admin/user/userwebModule');

const express = require('express'),
userwebRouter = express.Router(),
dateFormat = require('dateformat');
const bcrypt = require("bcrypt");


userwebRouter.get("/get_user_type", async (req, res) => {
    var data = req.query;

    //get user type
    var select = "type_code,user_type",
    table_name = "md_user_type",
    whr = null,
    order = null;
    var type_dt = await db_Select(select,table_name,whr,order);

    res.send(type_dt)
});

userwebRouter.post("/fetch_empl_dtls", async (req, res) => {
    var data = req.body;

    //fetch employee details
    try {
        var select = "a.emp_id,a.brn_code,a.user_type,b.emp_name,b.designation desig_code,c.desig_type";
        table_name = "md_user a, md_employee b, md_designation c";
        whr = `a.brn_code = b.branch_id AND a.emp_id = b.emp_id AND b.designation = c.desig_code AND a.emp_id = '${data.emp_id}'`,
        order = null;
        var user_dt = await db_Select(select, table_name, whr, order);

        if (user_dt.suc > 0 && Array.isArray(user_dt.msg) && user_dt.msg.length > 0) {
          // Employee ID already exists in 'md_user'
          return res.send({
              suc: 1,
              msg: user_dt.msg,
              details: "Employee already exists in md_user"
          });
      }

            // var select = "a.branch_assign_id code,b.branch_name name",
            // table_name = "td_assign_branch_user a, md_branch b",
            // whr = `a.branch_assign_id = b.branch_code`,
            // order = null;
            // var user_dtls = await db_Select(select,table_name,whr,order);
        

            var select = "a.branch_id, a.emp_name, b.branch_name,a.designation, c.desig_type";
            table_name = "md_employee a, md_branch b, md_designation c";
            whr = `a.branch_id = b.branch_code AND a.designation = c.desig_code AND a.emp_id = '${data.emp_id}'`,
            order = null;
            var fetch_emp_dt = await db_Select(select, table_name, whr, order);
            if (fetch_emp_dt.suc > 0 && fetch_emp_dt.msg.length > 0) {
                // If employee details found
                return res.send({
                    suc: 1,
                    msg: fetch_emp_dt.msg,
                    // user_dtls: user_dtls.msg
                });
            } else {
                // If no details found in 'md_employee'
                return res.send({
                    suc: 0,
                    msg: [],
                    details: "Employee details not found"
                });
            }
    } catch (error) {
        // Handle errors gracefully
        console.error("Error fetching employee details:", error);
        return res.send({ suc: 0, msg: "Internal server error" });
    }
});


userwebRouter.post("/save_user_dt", async (req, res) => {
    var data = req.body;

    //save user details
    var save_dt = await save_user_dtls(data);
    
    res.send(save_dt);
});

userwebRouter.post("/fetch_user_details", async (req, res) => {
    var data = req.body;

    //fetch user details
    var select = "a.emp_id,a.brn_code,a.user_type,a.user_status,a.deactive_remarks,b.emp_name,b.designation desig_code,c.branch_name,d.desig_type",
    table_name = "md_user a, md_employee b, md_branch c, md_designation d",
    whr = `a.brn_code = b.branch_id
    AND a.brn_code = c.branch_code
    AND a.emp_id = b.emp_id
    AND b.designation = d.desig_code`,
    order = null;
    var fetch_user = await db_Select(select,table_name,whr,order);

    if(fetch_user.suc > 0 && fetch_user.msg.length > 0){
       var select = "a.branch_assign_id code,b.branch_name name",
       table_name = "td_assign_branch_user a, md_branch b",
       whr = `a.branch_assign_id = b.branch_code`,
       order = null;
       var user_dtls = await db_Select(select,table_name,whr,order);

       fetch_user['brn_assign_dt'] = user_dtls.suc > 0 ? (user_dtls.msg.length > 0 ? user_dtls.msg : []) : [];
    }

    res.send(fetch_user)
});

userwebRouter.post("/edit_user_dt", async (req, res) => {
    var data = req.body;

    //edit user details
    var edit_dt = await edit_user_dt(data);

    res.send(edit_dt);
});

userwebRouter.post("/reset_password", async (req, res) => {
    var data = req.body;
    // console.log(data,'data');
    
    //reset password
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var table_name = "md_user",
    fields = `password = '$2b$10$GKfgEjJu9WuKkOUWzg28VOMWS6E214C3K.VizYE2Z3UXGTe/UaCEC',modified_by = '${data.modified_by}',modified_at = '${datetime}'`,
    values = null,
    whr = `brn_code  = '${data.branch_code}' AND emp_id = '${data.emp_id}'`,
    flag = 1;
    var reset_dtls_user = await db_Insert(table_name,fields,values,whr,flag);

    res.send(reset_dtls_user)

});

userwebRouter.post("/user_profile_details", async (req, res) => {
    var data = req.body;

    //fetch user profile details
    var select = "a.emp_id,a.brn_code,a.user_type,b.emp_name,c.user_type type_name, d.branch_name",
    table_name = "md_user a, md_employee b, md_user_type c, md_branch d",
    whr = `a.brn_code = b.branch_id AND a.emp_id = b.emp_id AND a.user_type = c.type_code AND a.brn_code = d.branch_code AND a.emp_id = '${data.emp_id}'`,
    order = null;

    var profile_dtls = await db_Select(select,table_name,whr,order);

    res.send(profile_dtls)
});

userwebRouter.post("/change_password", async (req, res) => {
    var data = req.body, result;
//   console.log(data);

//change password
  const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  var change_pwd_dt = await change_pass_data(data);
//   console.log(change_pwd_dt);

  if(change_pwd_dt.suc > 0) {
    if(change_pwd_dt.msg.length > 0) {
        // console.log(data.old_pwd, change_pwd_dt.msg[0].password, await bcrypt.compare(data.old_pwd, change_pwd_dt.msg[0].password))
      if (await bcrypt.compare(data.old_pwd, change_pwd_dt.msg[0].password)) {
        var pass = bcrypt.hashSync(data.new_pwd, 10);
        // console.log(pass,'pass');
        
        var table_name = "md_user",
        fields = `password = '${pass}', modified_by = '${data.modified_by}', modified_at='${datetime}'`,
        where = `emp_id = '${data.emp_id}'`,
        flag = 1;
        var change_pass = await db_Insert(table_name,fields,null,where,flag)
        result = change_pass
        result = {
          suc: 1,
          msg: "Password changed successfully",
          data: change_pwd_dt.msg,
        };
      }else {
        result = {
          suc: 0,
          msg: "Please check your password",
          data: [],
        };
      }
    }else {
      result = { suc: 0, msg: "No data found",  data: [], };
    }
  }else {
    result = { suc: 0, msg: change_pwd_dt.msg };
  }
  res.send(result);

})

module.exports = {userwebRouter}