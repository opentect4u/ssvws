const { db_Insert } = require("../../../model/mysqlModel");

module.exports = {
    designation_save: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            
            //save designation details in md_designation table
            var table_name = "md_designation",
                fields = data.desig_code > 0 ? `desig_type = '${data.desig_type}', modified_by = '${data.modified_by}', modified_at = '${datetime}'` : `(desig_type,created_by,created_at)`,
                values = `('${data.desig_type}','${data.created_by}','${datetime}')`,
                whr =  data.desig_code > 0 ? `desig_code = '${data.desig_code}'` : null,
                flag = data.desig_code > 0 ? 1 : 0;
                var save_desig_dtls = await db_Insert(table_name,fields,values,whr,flag);

            resolve(save_desig_dtls)
            // console.log(save_dtls,'lo');
            
        }catch(error){
            reject({"suc": 2, "msg": "Error occurred during saving designation details", details: error });
        } 
    });
    }
}