const { db_Insert } = require("../../../model/mysqlModel");
const { getBlockCode } = require("../../api/masterModule");

module.exports = {
    block_save: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                // console.log(data,'dadadaddada');
                
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let block_code = await getBlockCode()
            // console.log(block_code,'block');
            
            //save block details in md_block table
            var table_name = "md_block",
                fields = data.block_id > 0 ? `dist_id = '${data.dist_id}', block_name = '${data.block_name}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'` : `(block_id,dist_id,block_name,created_by,created_dt)`,
                values = `('${block_code}','${data.dist_id}','${data.block_name}','${data.created_by}','${datetime}')`,
                whr =  data.block_id > 0 ? `block_id = '${data.block_id}'` : null,
                flag = data.block_id > 0 ? 1 : 0;
                var save_block_dtls = await db_Insert(table_name,fields,values,whr,flag);

            resolve(save_block_dtls)
            // console.log(save_dtls,'lo');
            
        }catch(error){
            reject({"suc": 2, "msg": "Error occurred during saving block details", details: error });
        } 
    });
    }
}