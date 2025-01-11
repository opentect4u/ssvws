const { db_Insert } = require("../../../model/mysqlModel");

module.exports = {
    save_user_dtls: (data) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        return new Promise(async (resolve, reject) => {
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
}
}