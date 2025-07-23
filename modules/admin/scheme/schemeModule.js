const { db_Insert } = require("../../../model/mysqlModel");
const { getSchemeCode } = require("../../api/masterModule");

module.exports = {
     scheme_save: (data) => {
        return new Promise(async (resolve, reject) => {
            try {   
              // ✅ scheme_id validation
            if (
            data.scheme_id !== undefined &&
            (isNaN(data.scheme_id) || Number(data.scheme_id) < 0)
           ) {
           return res.send({
           message: "Invalid scheme id It must be a positive number.",
           });
           }

            if (
          data.status !== undefined &&  data.status !== '' &&
          !['A', 'D'].includes(data.status.toUpperCase())
         ) {
         return res.send({
        message: "Invalid status It must be either 'A' or 'D'",
         });
          }

            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let scheme_code = await getSchemeCode()
            // console.log(scheme_code,'scheme_code');
            
            //save scheme details in md_scheme table
            var table_name = "md_scheme",
                fields = data.scheme_id > 0 ? `scheme_name = '${data.scheme_name.split("'").join("\\'")}', effective_from = '${data.effective_from}', ${data.active_flag == 'D' ? `effective_to = '${datetime}',` : ''}min_amt = '${data.min_amt}',max_amt = '${data.max_amt}',min_period = '${data.min_period}',max_period = '${data.max_period}',min_period_week = '${data.min_period_week}',max_period_week = '${data.max_period_week}',payment_mode = '${data.payment_mode}',roi = '${data.roi}',active_flag = '${data.active_flag}',modified_by = '${data.modified_by}', modified_dt = '${datetime}'` : `(scheme_id,scheme_name,effective_from,min_amt,max_amt,min_period,max_period,min_period_week,max_period_week,payment_mode,roi,active_flag,created_by,created_dt)`,
                values = `('${scheme_code}','${data.scheme_name.split("'").join("\\'")}','${data.effective_from}','${data.min_amt}','${data.max_amt}','${data.min_period}','${data.max_period}','${data.min_period_week}','${data.max_period_week}','${data.payment_mode}','${data.roi}','${data.active_flag}','${data.created_by}','${datetime}')`,
                whr = (data.scheme_id !== undefined && Number(data.scheme_id) > 0) ? `scheme_id = '${Number(data.scheme_id)}'` : null,
                flag = data.scheme_id > 0 ? 1 : 0;
                var save_scheme_dtls = await db_Insert(table_name,fields,values,whr,flag);

            resolve( {suc: 1, msg: "Scheme saved successfully"})
            // console.log(save_dtls,'lo');
        }catch(error){
            reject({suc: 0, msg: "Error occurred during saving scheme details", details: error });
        } 
    });
    }
}