const { db_Insert, db_Select, db_Delete } = require("../../../model/mysqlModel");
const axios = require('axios')
module.exports = {
//     save_user_dtls: (data) => {
//             let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
//         return new Promise(async (resolve, reject) => {

//             //SAVE USER DETAILS
//             try {
//                 // console.log(data,'lolo');
                
//                 var table_name = "md_user",
//                 fields = `(emp_id,brn_code,user_type,password,user_status,finance_toggle,created_by,created_at)`,
//                 values = `('${data.emp_id}','${data.brn_code}','${data.user_type}','$2b$10$GKfgEjJu9WuKkOUWzg28VOMWS6E214C3K.VizYE2Z3UXGTe/UaCEC','A','${data.finance_toggle}','${data.created_by}','${datetime}')`,
//                 whr = null,
//                 flag = 0;
//                 var save_dtls_user = await db_Insert(table_name,fields,values,whr,flag);

//                 if(save_dtls_user.suc > 0 && save_dtls_user.msg.length > 0){

//                     var table_name = "md_employee",
//                     fields = `designation = '${data.designation}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'`,
//                     values = null,
//                     whr = `emp_id = '${data.emp_id}'`,
//                     flag = 1;

//                     var edit_user_dtls = await db_Insert(table_name, fields, values, whr, flag);
                    
//                     if(data.user_type == '3' || data.user_type == '10' || data.user_type == '11'){
                        
//                         for (let dt of data.assigndtls) {
//                             // console.log(dt,'kiki');
                            
//                             var table_name = "td_assign_branch_user",
//                             fields = `(ho_user_id,user_type,branch_assign_id,created_by,created_at)`,
//                             values = `('${data.emp_id}','${data.user_type}','${dt.branch_assign_id}','${data.created_by}','${datetime}')`,
//                             whr = null,
//                             flag = 0;
//                         var assign_dt = await db_Insert(table_name, fields, values, whr, flag);
//                         }
//                     }
//                 }

//                 resolve({"suc": 1, "msg": "Branch details assigned successfully.", assign_dt})

//             }catch (error){
//                 reject({"suc": 2, "msg": "Error occurred during saving user details", details: error });
                
//             }
//     });
// },


save_user_dtls: (data) => {
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    return new Promise(async (resolve, reject) => {
        try {
            let externalResponse = null;

            // If finance_toggle is 'Y', push to external API first
            if (data.finance_toggle === 'Y') {
                const payload = {
                    emp_id: data.emp_id,
                    brn_code: data.brn_code,
                    user_type: data.user_type,
                    password: '$2b$10$GKfgEjJu9WuKkOUWzg28VOMWS6E214C3K.VizYE2Z3UXGTe/UaCEC',
                    user_status: 'A',
                    created_by: data.created_by,
                    created_at: datetime
                };

                try {
                    const response = await axios.post(
                        'https://ssvws.opentech4u.co.in/ssvws_fin/index.php/Apiterminal/userinfo',
                        payload
                    );
                    externalResponse = response.data;
                } catch (err) {
                    reject({ suc: 2, msg: "Failed to push data to external system", details: err.message });
                    return;
                }
            }

            // Local DB insert (always happens)
            let table_name = "md_user",
                fields = `(emp_id,brn_code,user_type,password,user_status,finance_toggle,created_by,created_at)`,
                values = `('${data.emp_id}','${data.brn_code}','${data.user_type}','$2b$10$GKfgEjJu9WuKkOUWzg28VOMWS6E214C3K.VizYE2Z3UXGTe/UaCEC','A','${data.finance_toggle}','${data.created_by}','${datetime}')`,
                whr = null,
                flag = 0;
            let save_dtls_user = await db_Insert(table_name, fields, values, whr, flag);

            if (save_dtls_user.suc > 0 && save_dtls_user.msg.length > 0) {
                // Update md_employee
                table_name = "md_employee";
                fields = `designation = '${data.designation}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'`;
                whr = `emp_id = '${data.emp_id}'`;
                flag = 1;
                let edit_user_dtls = await db_Insert(table_name, fields, null, whr, flag);

                // Assign branches if applicable
                let assign_dt = [];

                if (['3', '10', '11'].includes(data.user_type)) {
                    for (let dt of data.assigndtls) {
                        table_name = "td_assign_branch_user";
                        fields = `(ho_user_id,user_type,branch_assign_id,created_by,created_at)`;
                        values = `('${data.emp_id}','${data.user_type}','${dt.branch_assign_id}','${data.created_by}','${datetime}')`;
                        whr = null;
                        flag = 0;

                        let assignResult = await db_Insert(table_name, fields, values, whr, flag);
                        assign_dt.push(assignResult);
                    }
                }

                resolve({
                    suc: 1,
                    msg: `User saved ${data.finance_toggle === 'Y' ? "and pushed to external system" : "locally only"} successfully.`,
                    external_response: externalResponse,
                    assign_dt
                });
            } else {
                reject({ suc: 0, msg: "Failed to insert user details locally" });
            }
        } catch (error) {
            reject({ suc: 2, msg: "Error occurred during saving user details", details: error });
        }
    });
},



// save_user_dtls: (data) => {
//     let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
// return new Promise(async (resolve, reject) => {

//     //SAVE USER DETAILS
//     try {
//         var table_name = "md_user",
//         fields = `(emp_id,brn_code,user_type,password,user_status,created_by,created_at)`,
//         values = `('${data.emp_id}','${data.brn_code}','${data.user_type}','$2b$10$GKfgEjJu9WuKkOUWzg28VOMWS6E214C3K.VizYE2Z3UXGTe/UaCEC','A','${data.created_by}','${datetime}')`,
//         whr = null,
//         flag = 0;
//         var save_dtls_user = await db_Insert(table_name,fields,values,whr,flag);

//         if(save_dtls_user.suc > 0 && save_dtls_user.msg.length > 0){
//             var table_name = "md_user_branch",
//             fields = `(user_dt,emp_id,branch_code,created_by,created_at)`,
//             values = `('${datetime}','${data.emp_id}','${data.brn_code}','${data.created_by}','${datetime}')`,
//             whr = null,
//             flag = 0;
//             var save_dtls_users = await db_Insert(table_name,fields,values,whr,flag);
//         }

//         resolve({"suc": 1, "msg": save_dtls_users})

//     }catch (error){
//         reject({"suc": 2, "msg": "Error occurred during saving user details", details: error });
        
//     }
// });
// },

edit_user_dt : (data) => {
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        return new Promise(async (resolve, reject) => {

            //EDIT USER DETAILS
            try {
                var table_name = "md_user",
                fields = `user_type = '${data.user_type}', user_status = '${data.user_status}', finance_toggle = '${data.finance_toggle}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`;
                        if (data.user_status === 'I') {
                        fields += `,
                            deactive_remarks = '${data.remarks.split("'").join("\\'")}', 
                            deactivated_by = '${data.deactivated_by}', 
                            deactivated_at = '${datetime}'`;
                        }
            
                var values = null, // For `UPDATE` queries, this remains null
                whr = `emp_id = '${data.emp_id}' AND brn_code = '${data.branch_code}'`,
                flag = 1;
            
                var edit_dtls_user = await db_Insert(table_name, fields, values, whr, flag);

                if(edit_dtls_user.suc > 0 && edit_dtls_user.msg.length > 0){
                var table_name = "md_employee",
                fields = `designation = '${data.designation}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'`,
                values = null,
                whr = `emp_id = '${data.emp_id}' AND branch_id = '${data.branch_code}'`,
                flag = 1;

                var edit_user_dtls = await db_Insert(table_name,fields,values,whr,flag);
            
                if (data.user_type == '3' || data.user_type == '10' || data.user_type == '11') {
                    // Get the currently assigned branches for the user

                    var select = "branch_assign_id";
                    var table_name = "td_assign_branch_user";
                    var whr = `ho_user_id = '${data.emp_id}'`;
                    var assign_brn = await db_Select(select, table_name, whr, null);

                    let existing_brn_dt = assign_brn.msg.map(row => row.branch_assign_id);
                    let new_brn_id = data.assigndtls.map(dt => dt.branch_assign_id);

                    // Find branches to DELETE (unselected by user)
                    let brn_del = existing_brn_dt.filter(id => !new_brn_id.includes(id));

                    if (brn_del.length > 0) {
                        let delete_brn = await db_Delete('td_assign_branch_user', `ho_user_id = '${data.emp_id}' AND branch_assign_id IN (${brn_del.map(id => `'${id}'`).join(",")})`)
                    }

                    // Find branches to INSERT (newly selected by user)
                    let brn_add = data.assigndtls.filter(dt => !existing_brn_dt.includes(dt.branch_assign_id));

                    for (let dt of brn_add) {
                        var table_name = "td_assign_branch_user",
                            fields = `(ho_user_id,user_type,branch_assign_id,created_by,created_at)`,
                            values = `('${data.emp_id}','${data.user_type}','${dt.branch_assign_id}','${data.created_by}','${datetime}')`,
                            whr = null,
                            flag = 0;

                        await db_Insert(table_name, fields, values, whr, flag);
                    }
                }

                resolve({ "suc": 1, "msg": "User details updated successfully" });
            } else {
                reject({ "suc": 2, "msg": "Failed to update user details" });
            }
        } catch (error) {
            reject({ "suc": 2, "msg": "Error occurred during saving user details", details: error });
        }
    });
},

change_pass_data : (data) => {
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        return new Promise(async (resolve, reject) => {
              //FETCH USER DETAILS
              try {
                var select = "emp_id,password",
                table_name = "md_user",
                whr = `emp_id='${data.emp_id}'`,
                order = null;
              var pwd_dt = await db_Select(select, table_name, whr, order);
              resolve(pwd_dt);            

            }catch (error){
                reject({"suc": 2, "msg": "Error occurred during fetching user details", details: error });
                
            }
    });
}
}