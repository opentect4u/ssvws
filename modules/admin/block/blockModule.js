const { db_Insert } = require("../../../model/mysqlModel");
const { getDistCode } = require("../../api/masterModule");

module.exports = {
    district_save: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                // console.log(data,'dadadaddada');
                
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let dist_code = await getDistCode()
            // console.log(dist_code,'dist');
            
            //save district details in md_district table
            var table_name = "md_district",
                fields = data.dist_id > 0 ? `state_id = '${data.state_id}', dist_name = '${data.dist_name}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'` : `(dist_id,state_id,dist_name,created_by,created_dt)`,
                values = `('${dist_code}','${data.state_id}','${data.dist_name}','${data.created_by}','${datetime}')`,
                whr =  data.dist_id > 0 ? `dist_id = '${data.dist_id}'` : null,
                flag = data.dist_id > 0 ? 1 : 0;
                var save_dist_dtls = await db_Insert(table_name,fields,values,whr,flag);

            resolve(save_dist_dtls)
            // console.log(save_dtls,'lo');
            
        }catch(error){
            reject({"suc": 2, "msg": "Error occurred during saving district details", details: error });
        } 
    });
    }
}