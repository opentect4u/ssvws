const { db_Insert } = require("../../../model/mysqlModel");
const { getPurposeCode } = require("../../api/masterModule");

module.exports = {
    purpose_save: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                // console.log(data,'dadadaddada');
                
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let purpose_code = await getPurposeCode()
            
            //save purpose details in md_purpose table
            var table_name = "md_purpose",
                fields = data.purp_id > 0 ? `purpose_id = '${data.purpose_id}', sub_purpose = '${data.sub_purpose}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'` : `(purp_id,purpose_id,sub_purpose,active_flag,created_by,created_dt)`,
                values = `('${purpose_code}','${data.purpose_id}','${data.sub_purpose}','Y','${data.created_by}','${datetime}')`,
                whr =  data.purp_id > 0 ? `purp_id = '${data.purp_id}'` : null,
                flag = data.purp_id > 0 ? 1 : 0;
                var save_purp_dtls = await db_Insert(table_name,fields,values,whr,flag);

            resolve(save_purp_dtls)
            
        }catch(error){
            reject({"suc": 2, "msg": "Error occurred during saving purpose details", details: error });
        } 
    });
    }
}