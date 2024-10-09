var dateFormat = require("dateformat");
const { db_Insert } = require("../../model/mysqlModel");

module.exports = {
    edit_grp_web: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            var table_name = "md_group",
            fields = `branch_code = '${data.branch_code}', group_name = '${data.group_name}', group_type = '${data.group_type}',
             co_id = '${data.co_id}', phone1 = '${data.phone1}', phone2 = '${data.phone2}', email_id = '${data.email_id}', grp_addr = '${data.grp_addr}',
             disctrict = '${data.disctrict}', block = '${data.block}', pin_no = '${data.pin_no}', bank_name =  '${data.bank_name}', branch_name = '${data.branch_name}',
              ifsc =  '${data.ifsc}', micr = '${data.micr}', acc_no1 = '${data.acc_no1}', acc_no2 = '${data.acc_no2}',
            modified_by = '${data.modified_by}', modified_at =  '${datetime}'`,
            values = null,
            whr = `group_code = '${data.group_code}'`,
            flag = 1;
            var edit_grp_dtls = await db_Insert(table_name, fields, values, whr, flag);
            // console.log(edit_grp_dt,'dt');

            resolve(edit_grp_dtls);
        });
    },
}