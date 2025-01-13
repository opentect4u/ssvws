const { db_Insert, db_Select } = require("../../../model/mysqlModel");

module.exports = {
    save_user_dtls: (data) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        return new Promise(async (resolve, reject) => {

            //SAVE USER DETAILS
            try {
                var table_name = "md_user",
                fields = `(emp_id,brn_code,user_type,password,user_status,created_by,created_at)`,
                values = `('${data.emp_id}','${data.brn_code}','${data.user_type}','$2b$10$GKfgEjJu9WuKkOUWzg28VOMWS6E214C3K.VizYE2Z3UXGTe/UaCEC','A','${data.created_by}','${datetime}')`,
                whr = null,
                flag = 0;
                var save_dtls_user = await db_Insert(table_name,fields,values,whr,flag);

                if(save_dtls_user.suc > 0 && save_dtls_user.msg.length > 0){
                    var table_name = "md_user_branch",
                    fields = `(user_dt,emp_id,branch_code,created_by,created_at)`,
                    values = `('${datetime}','${data.emp_id}','${data.brn_code}','${data.created_by}','${datetime}')`,
                    whr = null,
                    flag = 0;
                    var save_dtls_users = await db_Insert(table_name,fields,values,whr,flag);
                }

                resolve({"suc": 1, "msg": save_dtls_users})

            }catch (error){
                reject({"suc": 2, "msg": "Error occurred during saving user details", details: error });
                
            }
    });
},

edit_user_dt : (data) => {
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        return new Promise(async (resolve, reject) => {

            //EDIT USER DETAILS
            try {
                var table_name = "md_user",
                fields = `user_type = '${data.user_type}', user_status = '${data.user_status}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`;
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
            

                resolve({"suc": 1, "msg": edit_dtls_user})

            }catch (error){
                reject({"suc": 2, "msg": "Error occurred during saving user details", details: error });
                
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