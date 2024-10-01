var dateFormat = require("dateformat");
const { db_Insert } = require("../../model/mysqlModel");

module.exports = {
    edit_search_basic: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            var table_name = "td_grt_basic",
            fields = `grt_date = '${datetime}', gender = '${data.gender}', client_name = '${data.client_name}',
             client_mobile = '${data.client_mobile}', gurd_name = '${data.gurd_name}', gurd_mobile = '${data.gurd_mobile}', 
             client_addr = '${data.client_addr}', pin_no = '${data.pin_no}', aadhar_no = '${data.aadhar_no}', pan_no = '${data.pan_no}',
             religion = '${data.religion}', caste = '${data.caste}', education = '${data.education}', dob = '${data.dob}',
             modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}'`,
            flag = 1;
            var edit_basic_dt = await db_Insert(table_name, fields, values, whr, flag);
            resolve(edit_basic_dt)
        });
    }
}