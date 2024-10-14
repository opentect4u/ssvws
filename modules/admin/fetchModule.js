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

    edit_basic_dt_web: (data) => {
        return new Promise(async (resolve, reject) => {
          let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    
          var table_name = "td_grt_basic",
            fields = `branch_code = '${data.branch_code}', prov_grp_code = '${data.prov_grp_code}', gender = '${data.gender}', client_name = '${data.client_name}', client_mobile = '${data.client_mobile}', gurd_name = '${data.gurd_name}', gurd_mobile = '${data.gurd_mobile}', client_addr = '${data.client_addr}', pin_no = '${data.pin_no}', aadhar_no = '${data.aadhar_no}', pan_no = '${data.pan_no}',
                 religion = '${data.religion}', caste = '${data.caste}', education = '${data.education}', dob = '${data.dob}', bm_lat_val = '${data.bm_lat_val}', bm_long_val = '${data.bm_long_val}', bm_gps_address = '${data.bm_gps_address}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `form_no = '${data.form_no}'`,
            flag = 1;
          var edit_basic_dt = await db_Insert(
            table_name,
            fields,
            values,
            whr,
            flag
          );
          resolve(edit_basic_dt);
        });
      },
    
      edit_occup_dt_web: (data) => {
        return new Promise(async (resolve, reject) => {
          let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    
          var table_name = "td_grt_occupation_household",
            fields = `branch_code = '${data.branch_code}', self_occu = '${data.self_occu}', self_income = '${data.self_income}', spouse_occu = '${data.spouse_occu}', spouse_income = '${data.spouse_income}', loan_purpose = '${data.loan_purpose}', sub_pupose = '${data.sub_pupose}', applied_amt = '${data.applied_amt}', other_loan_flag = '${data.other_loan_flag}', other_loan_amt = '${data.other_loan_amt}', other_loan_emi = '${data.other_loan_emi}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `form_no = '${data.form_no}'`,
            flag = 1;
          var edit_occup_dt = await db_Insert(
            table_name,
            fields,
            values,
            whr,
            flag
          );
          resolve(edit_occup_dt);
        });
      },
    
      edit_household_dt_web: (data) => {
        return new Promise(async (resolve, reject) => {
          let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    
          var table_name = "td_grt_occupation_household",
            fields = `house_type = '${data.house_type}', own_rent = '${data.own_rent}', no_of_rooms = '${data.no_of_rooms}', land = '${data.land}', tv_flag = '${data.tv_flag}', bike_flag = '${data.bike_flag}', fridge_flag = '${data.fridge_flag}', wm_flag = '${data.wm_flag}', poltical_flag = '${data.poltical_flag}', parental_addr = '${data.parental_addr}', parental_phone = '${data.parental_phone}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `form_no = '${data.form_no}'`,
            flag = 1;
          var edit_household_dt = await db_Insert(
            table_name,
            fields,
            values,
            whr,
            flag
          );
          resolve(edit_household_dt);
        });
      },
}