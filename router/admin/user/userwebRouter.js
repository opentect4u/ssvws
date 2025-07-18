const { decrypt } = require('dotenv');
const { db_Select, db_Insert } = require('../../../model/mysqlModel');
const { save_user_dtls, edit_user_dt, change_pass_data, finance_login_data } = require('../../../modules/admin/user/userwebModule');

const express = require('express'),
userwebRouter = express.Router(),
dateFormat = require('dateformat');
const bcrypt = require("bcrypt");
const crypto  = require("crypto");

const key = process.env.AES_KEY;
const iv = process.env.AES_IV;

function decryptAES(encryptedText) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

userwebRouter.post("/finance_login_validate", async (req, res) => {
  try {
     var data = req.body;
      // Decrypt emp_id and password
        let decryptedEmpId, decryptedPassword;
         try {
            decryptedEmpId = decryptAES(data.emp_id);
            decryptedPassword = decryptAES(data.password);
            // console.log(decryptedEmpId,decryptedPassword,'kiki');
            
        } catch (decryptErr) {
            return res.send({ suc: 0, msg: "Decryption failed. Possibly incorrect key/IV or corrupted data." });
        }

         // Fetch user details (you need to ensure this function uses decryptedEmpId)
          const fin_log_dt = await finance_login_data({ emp_id: decryptedEmpId });

      if (fin_log_dt.suc > 0 && fin_log_dt.msg.length > 0) {
            const user = fin_log_dt.msg[0];
            const passwordMatch = await bcrypt.compare(decryptedPassword, user.password);
            if (passwordMatch) {
                return res.send({ suc: 1, msg: `${user.user_type_name} Login successfully`, user_dtls: user });
            } else {
                return res.send({ suc: 0, msg: "Incorrect user ID or password" });
            }
        } else {
            return res.send({ suc: 2, msg: "No user data found", dt: fin_log_dt });
        }
  } catch (error) {
      console.error("Login Error:", error);
      return res.send({ suc: 0, msg: "An unexpected error occurred while login please try again." });
  }
});


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

// userwebRouter.post("/fetch_empl_dtls", async (req, res) => {
//     var data = req.body;

//     //fetch employee details
//     try {
//         var select = "a.emp_id,a.brn_code,a.user_type,b.emp_name,b.designation desig_code,c.desig_type";
//         table_name = "md_user a, md_employee b, md_designation c";
//         whr = `a.brn_code = b.branch_id AND a.emp_id = b.emp_id AND b.designation = c.desig_code AND a.emp_id = '${data.emp_id}'`,
//         order = null;
//         var user_dt = await db_Select(select, table_name, whr, order);

//         if (user_dt.suc > 0 && Array.isArray(user_dt.msg) && user_dt.msg.length > 0) {
//           // Employee ID already exists in 'md_user'
//           return res.send({
//               suc: 1,
//               msg: user_dt.msg,
//               details: "Employee already exists in md_user"
//           });
//       }

//             // var select = "a.branch_assign_id code,b.branch_name name",
//             // table_name = "td_assign_branch_user a, md_branch b",
//             // whr = `a.branch_assign_id = b.branch_code`,
//             // order = null;
//             // var user_dtls = await db_Select(select,table_name,whr,order);
        

//             var select = "a.branch_id, a.emp_name, b.branch_name,a.designation, c.desig_type";
//             table_name = "md_employee a, md_branch b, md_designation c";
//             whr = `a.branch_id = b.branch_code AND a.designation = c.desig_code AND a.emp_id = '${data.emp_id}'`,
//             order = null;
//             var fetch_emp_dt = await db_Select(select, table_name, whr, order);
//             if (fetch_emp_dt.suc > 0 && fetch_emp_dt.msg.length > 0) {
//                 // If employee details found
//                 return res.send({
//                     suc: 1,
//                     msg: fetch_emp_dt.msg,
//                     // user_dtls: user_dtls.msg
//                 });
//             } else {
//                 // If no details found in 'md_employee'
//                 return res.send({
//                     suc: 0,
//                     msg: [],
//                     details: "Employee details not found"
//                 });
//             }
//     } catch (error) {
//         // Handle errors gracefully
//         console.error("Error fetching employee details:", error);
//         return res.send({ suc: 0, msg: "Internal server error" });
//     }
// });

userwebRouter.post("/fetch_empl_dtls", async (req, res) => {
  var data = req.body;

  //fetch employee details
  try {
      var select = "a.emp_id,a.brn_code,a.user_type,a.finance_toggle,b.emp_name,b.designation desig_code,c.desig_type";
      table_name = "md_user a LEFT JOIN md_employee b ON a.brn_code = b.branch_id AND a.emp_id = b.emp_id LEFT JOIN md_designation c ON b.designation = c.desig_code";
      whr = `a.emp_id = '${data.emp_id}'`,
      order = null;
      var user_dt = await db_Select(select, table_name, whr, order);

      if (user_dt.suc > 0 && Array.isArray(user_dt.msg) && user_dt.msg.length > 0) {
        // Employee ID already exists in 'md_user'
        return res.send({
            suc: 1,
            msg: user_dt.msg,
            details: "Employee already exists"
        });
    }

          // var select = "a.branch_assign_id code,b.branch_name name",
          // table_name = "td_assign_branch_user a, md_branch b",
          // whr = `a.branch_assign_id = b.branch_code`,
          // order = null;
          // var user_dtls = await db_Select(select,table_name,whr,order);
      

          var select = "a.branch_id, a.emp_name, b.branch_name,a.designation, c.desig_type";
          table_name = "md_employee a LEFT JOIN md_branch b ON a.branch_id = b.branch_code LEFT JOIN md_designation c ON a.designation = c.desig_code";
          whr = `a.emp_id = '${data.emp_id}'`,
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


// userwebRouter.post("/save_user_dt", async (req, res) => {
//     var data = req.body;

//     save user details
//     var save_dt = await save_user_dtls(data);
    
//     res.send(save_dt);

// });

userwebRouter.post("/save_user_dt", async (req, res) => {
    var data = req.body;
  //  console.log(data,'data');
   
    try {
        var result = await save_user_dtls(data);
        // console.log("Success:", result);
        res.send(result);
    } catch (err) {
        console.error("Error saving user:", err);
        res.send({ error: true, message: "Failed to save user", details: err.message || err });
    }
});


userwebRouter.post("/fetch_user_details", async (req, res) => {
    var data = req.body;

    //fetch user details
    var select = "a.emp_id,a.brn_code,a.user_type,a.user_status,a.finance_toggle,a.deactive_remarks,b.emp_name,b.designation desig_code,c.branch_name,d.desig_type",
    table_name = "md_user a LEFT JOIN md_employee b ON a.brn_code = b.branch_id AND a.emp_id = b.emp_id LEFT JOIN md_branch c ON a.brn_code = c.branch_code LEFT JOIN md_designation d ON b.designation = d.desig_code",
    whr = null,
    order = null;
    var fetch_user = await db_Select(select,table_name,whr,order);

    res.send(fetch_user)
});

userwebRouter.post("/fetch_assign_branch", async (req, res) => {
  var data = req.body;

    var select = "a.branch_assign_id code,b.branch_name name",
    table_name = "td_assign_branch_user a, md_branch b",
    whr = `a.branch_assign_id = b.branch_code AND brn_status = 'O' AND a.ho_user_id = '${data.emp_id}'`,
    order = `ORDER BY branch_name`;
    var fetch_user_dtls = await db_Select(select,table_name,whr,order);

    res.send(fetch_user_dtls)
});

userwebRouter.post("/edit_user_dt", async (req, res) => {
    var data = req.body;

    //edit user details
    var edit_dt = await edit_user_dt(data);

    res.send(edit_dt);
});

userwebRouter.post("/get_emp_dtls_fr_finance", async (req, res) => {
 try{
   var data = req.body;
    // console.log(data,'data');
    
   //Get finance_toggle
   var fetching_fin_flag = await db_Select(
                "finance_toggle",
                "md_user",
                `emp_id = '${data.emp_id}'`,
                null
            );
            
    var finance_toggle = fetching_fin_flag.msg[0].finance_toggle;
    
    // Get user_type
    var fetch_user_type = await db_Select(
                "user_type",
                "md_user",
                `emp_id = '${data.emp_id}'`,
                null
            );
    
    var user_type = fetch_user_type.msg[0].user_type;      
    
    // If finance_toggle is 'Y' AND user_type is 4, return all branches
    if (finance_toggle === 'Y' && parseInt(user_type) === 4) {
      let fetch_all_branches = await db_Select("branch_code branch_assign_id,branch_name branch_assign_name", "md_branch", null, null);
      let all_branch_data = fetch_all_branches.msg || [];

      return res.send({
        suc: 1,
        finance_toggle,
        user_type,
        branch_assign_data: all_branch_data
      });
    }

    // If finance_toggle is 'Y' AND user_type is 1,2,5 return all branches
    if (finance_toggle === 'Y' && parseInt(user_type) === 1 || parseInt(user_type) === 2 || parseInt(user_type) === 5) {
      let fetch_all_branches_data = await db_Select("a.brn_code branch_assign_id,b.branch_name branch_assign_name", "md_user a LEFT JOIN md_branch b ON a.brn_code = b.branch_code", `a.emp_id = '${data.emp_id}'`, null);
      let all_branchs_data = fetch_all_branches_data.msg || [];

      return res.send({
        suc: 1,
        finance_toggle,
        user_type,
        branch_assign_data: all_branchs_data
      });
    }

    // If finance_toggle is 'Y' for other user types
    if (finance_toggle === 'Y' && parseInt(user_type) === 3 || parseInt(user_type) === 10 || parseInt(user_type) === 11) {  
      // Fetch assigned branch details
      var select = "a.user_type,a.branch_assign_id,b.branch_name branch_assign_name",
      table_name = "td_assign_branch_user a LEFT JOIN md_branch b ON a.branch_assign_id = b.branch_code",
      whr = `a.ho_user_id = '${data.emp_id}'`,
      order = null;
      var fetch_branch_data = await db_Select(select,table_name,whr,order);
      const branch_assign_data_raw = fetch_branch_data.msg || [];

      let user_type = null;
      const branch_assign_data = branch_assign_data_raw.map((item, index) => {
      if (index === 0) user_type = parseInt(item.user_type);
      return {
      branch_assign_id: item.branch_assign_id,
      branch_assign_name: item.branch_assign_name
      };
      });

    // Send response with all details
    res.send({
        suc: 1,
        finance_toggle: finance_toggle,
        user_type: user_type,
        // user_data: user_data,
        branch_assign_data : branch_assign_data
      });      
    } else {
      // finance_toggle not 'Y'
      res.send({
        suc: 1,
        finance_toggle: finance_toggle
      });
    }        
 }catch (err) {
        console.error("Error fetching user:", err);
        res.send({ suc: 0, message: "Failed to fetch user" });
    }
});

userwebRouter.post("/encrypted_data_validate", async (req, res) => {
  try {
    var data = req.body;
  }catch(err){
      console.error("Error in validation:", err);
    }
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
    if(data.id == '3' || data.id == '10' || data.id == '11'){
      var select = "a.emp_id,a.user_type,b.emp_name,c.user_type type_name,d.branch_name,e.branch_assign_id",
      table_name = "md_user a, md_employee b, md_user_type c, md_branch d, td_assign_branch_user e",
      whr = `a.brn_code = b.branch_id AND a.emp_id = b.emp_id AND a.user_type = c.type_code AND a.emp_id = e.ho_user_id AND e.branch_assign_id = d.branch_code AND a.emp_id = '${data.emp_id}'`,
      order = null;
  
      var profile_dtls = await db_Select(select,table_name,whr,order);
    }else {
      var select = "a.emp_id,a.brn_code,a.user_type,b.emp_name,c.user_type type_name, d.branch_name",
      table_name = "md_user a, md_employee b, md_user_type c, md_branch d",
      whr = `a.brn_code = b.branch_id AND a.emp_id = b.emp_id AND a.user_type = c.type_code AND a.brn_code = d.branch_code AND a.emp_id = '${data.emp_id}'`,
      order = null;
  
      var profile_dtls = await db_Select(select,table_name,whr,order);
    }

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

});

userwebRouter.post("/fetch_data_same_pass", async (req, res) => {
  var data = req.body;
  
  var select = "a.emp_id,b.emp_name",
  table_name = "md_user a LEFT JOIN md_employee b ON a.emp_id = b.emp_id",
  whr = `password = '$2b$10$GKfgEjJu9WuKkOUWzg28VOMWS6E214C3K.VizYE2Z3UXGTe/UaCEC'`,
  order = null;
  var res_dt = await db_Select(select,table_name,whr,order);
  res.send(res_dt);
});

module.exports = {userwebRouter}