const { db_Insert } = require("../../../model/mysqlModel");
const { getFundCode } = require("../../api/masterModule");

module.exports = {
     fund_save: (data) => {
        return new Promise(async (resolve, reject) => {
            try {   
              // ✅ fund_id validation
            if (
                data.fund_id !== undefined &&
                (isNaN(data.fund_id) || Number(data.fund_id) < 0)
            ) {
                return resolve({
                    message: "Invalid fund_id It must be a positive number."
                });
            }

            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let fund_code = await getFundCode()
            // console.log(fund_code,'fund');
            
            //save fund details in md_fund table
            var table_name = "md_fund",
                fields = data.fund_id > 0 ? `fund_name = '${data.fund_name.split("'").join("\\'")}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'` : `(fund_id,fund_name,created_by,created_at)`,
                values = `('${fund_code}','${data.fund_name.split("'").join("\\'")}','${data.created_by}','${datetime}')`,
                whr = (data.fund_id !== undefined && Number(data.fund_id) > 0) ? `fund_id = '${Number(data.fund_id)}'` : null,
                flag = data.fund_id > 0 ? 1 : 0;
                var save_fund_dtls = await db_Insert(table_name,fields,values,whr,flag);

            // resolve(save_fund_dtls)
            // console.log(save_dtls,'lo');

             if (!flag) {
                return resolve({
                    suc: 1,
                    msg: "Fund saved successfully",
                    fund_id: fund_code 
                });
            } else {
                return resolve({
                    suc: 1,
                    msg: "Fund updated successfully",
                    fund_id: data.fund_id
                });
            }
        }catch(error){
            reject({"suc": 0, "msg": "Error occurred during saving fund details", details: error });
        } 
    });
    }
}