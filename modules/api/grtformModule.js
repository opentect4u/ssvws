var dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/mysqlModel");
const { getFormNo, groupCode, getMemberCode } = require("./masterModule");

module.exports = {

    save_basic_dtls: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let form_no = await getFormNo()
            let member_code = await getMemberCode(data.branch_code)

            // var select = "client_mobile",
            // table_name = "md_member",
            // whr = `client_mobile = '${data.client_mobile}'`,
            // order = null;
            // var mobile_dt = await db_Select(select,table_name,whr,order)

            // if(mobile_dt.suc > 0 && mobile_dt.msg.length == 0){
               
                    var table_name = "md_member",
                    fields = data.member_code > 0 ? `gender = '${data.gender}', client_name = '${data.client_name}', client_mobile = '${data.client_mobile}', email_id = '${data.email_id}', gurd_name = ${data.gurd_name == '' ? 'NULL' : data.gurd_name}, gurd_mobile = '${data.gurd_mobile == '' ? 0 : data.gurd_mobile}', husband_name = ${data.husband_name == 'NULL' ? '' : data.husband_name}, client_addr = '${data.client_addr.split("'").join("\\'")}',
                    pin_no = '${data.pin_no}', aadhar_no = '${data.aadhar_no}', pan_no = '${data.pan_no}', religion = '${data.religion}', other_religion = '${data.religion == 'Others' ? data.other_religion : 'null'}', caste = '${data.caste}', other_caste = '${data.caste == 'Others' ? data.other_caste : 'null'}', education = '${data.education}', other_education = '${data.education == 'Others' ? data.other_education : 'null'}', dob = '${data.dob}', modified_by = '${data.created_by}', modified_at = '${datetime}'`: "(branch_code, member_code, gender, client_name, member_dt, client_mobile, phone_verify_flag, email_id, gurd_name, gurd_mobile, husband_name, client_addr, pin_no, aadhar_no, aadhar_verify_flag, pan_no, pan_verify_flag, religion, other_religion, caste, other_caste, education, other_education, dob, created_by, created_at)",
                    values =  `('${data.branch_code}', '${member_code}', '${data.gender}', '${data.client_name}', '${datetime}',
                    '${data.client_mobile}', 'Y', '${data.email_id}', '${data.gurd_name == '' ? 'NULL' : data.gurd_name}', '${data.gurd_mobile == '' ? 0 : data.gurd_mobile}', ${data.husband_name == '' ? 'NULL' : data.husband_name}, '${data.client_addr.split("'").join("\\'")}', '${data.pin_no}', '${data.aadhar_no}', 'Y', '${data.pan_no}', 'Y', '${data.religion}', '${data.religion == 'Others' ? data.other_religion : 'null'}', '${data.caste}', '${data.caste == 'Others' ? data.other_caste : 'null'}', '${data.education}', '${data.education == 'Others' ? data.other_education : 'null'}', '${data.dob}', '${data.created_by}', '${datetime}')`,
                    whr = data.member_code > 0 ? `member_code = '${data.member_code}'` : null,
                    flag = data.member_code > 0 ? 1 : 0;
                    var basic_dt = await db_Insert(table_name, fields, values, whr, flag);

                    var current_member_code = data.member_code ? data.member_code : member_code;

                    var table_name = "td_grt_basic",
                    fields = "(form_no, grt_date, branch_code, prov_grp_code, member_code, approval_status, co_lat_val, co_long_val, co_gps_address, created_by, created_at)",
                    values = `('${form_no}', '${data.grt_date}', '${data.branch_code}', '0', '${current_member_code}', 'U', '${data.co_lat_val}', '${data.co_long_val}', '${data.co_gps_address}', '${data.created_by}', '${datetime}')`,
                    whr = null,
                    flag =  0;
                    var grt_dt = await db_Insert(table_name, fields, values, whr, flag);
                    basic_dt["member_code"] = member_code;

                resolve(basic_dt);
            // }else {
            //     reject({ "suc": 0, "msg": "Mobile number already exists." });
            // }
        }catch(error){
            reject({"suc": 2, "msg": "Error occurred during saving details", details: error });
        } 
        });
    },

    edit_grt_data: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            var table_name = "td_grt_basic",
                fields = `grt_date = '${datetime}', prov_grp_code = '0', client_name = '${data.client_name}', client_mobile = '${data.client_mobile}', gurd_name = '${data.gurd_name}', gurd_mobile = '${data.gurd_mobile}', client_addr = '${data.client_addr}', pin_no = '${data.pin_no}', aadhar_no = '${data.aadhar_no}', pan_no = '${data.pan_no}',
                 religion = '${data.religion}', caste = '${data.caste}', education = '${data.education}', dob = '${data.dob}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                values = null,
                whr = `form_no = '${data.form_no}'`,
                flag = 1;
                var edit_basic_dt = await db_Insert(table_name, fields, values, whr, flag);

                var select = "form_no",
                table_name = "td_grt_occupation_household",
                whr = `form_no = '${data.form_no}'`,
                order = null;
                var res_dt = await db_Select(select,table_name,whr,order)

                if(res_dt.msg.length > 0 && res_dt.suc > 0){
                    var table_name = "td_grt_occupation_household",
                    fields = `grt_date = '${datetime}', self_occu = '${data.self_occu}', self_income = '${data.self_income}', spouse_occu = '${data.spouse_occu}', spouse_income = '${data.spouse_income}', 
                    loan_purpose = '${data.loan_purpose}', sub_pupose = '${data.sub_pupose}', applied_amt = '${data.applied_amt}', other_loan_flag = '${data.other_loan_flag}',
                     other_loan_amt = '${data.other_loan_amt}', other_loan_emi = '${data.other_loan_emi}', political_flag = '${data.political_flag}',
                     parental_addr = '${data.parental_addr}', parental_phone = '${data.parental_phone}',
                     modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                    values = null,
                    whr = `form_no = '${data.form_no}'`,
                    flag = 1;
                    var occup_dt = await db_Insert(table_name, fields, values, whr, flag); 
                }else {
                    var table_name = "td_grt_occupation_household",
                    fields = "(form_no, grt_date, self_occu, self_income, spouse_occu, spouse_income, loan_purpose, sub_pupose, applied_amt, other_loan_flag, other_loan_amt, other_loan_emi, political_flag, parental_addr, parental_phone, created_by, created_at)",
                    values =  `('${data.form_no}', '${datetime}', '${data.self_occu}', '${data.self_income}', '${data.spouse_occu}', '${data.spouse_income}', '${data.loan_purpose}', '${data.sub_pupose}', '${data.applied_amt}', '${data.other_loan_flag}', '${data.other_loan_amt}', '${data.other_loan_emi}', '${data.political_flag}', '${data.parental_addr}', '${data.parental_phone}', '${data.created_by}', '${datetime}')`,
                    whr = null,
                    flag = 0;
                    var occup_dt = await db_Insert(table_name, fields, values, whr, flag);
                }

                var table_name = "td_grt_occupation_household",
                    fields = data.form_no > 0 ? `no_of_rooms = '${data.no_of_rooms}', house_type = '${data.house_type}', own_rent = '${data.own_rent}', land = '${data.land}', tv_flag = '${data.tv_flag}', 
                    bike_flag = '${data.bike_flag}', fridge_flag = '${data.fridge_flag}', wm_flag = '${data.wm_flag}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`
                    : `(no_of_rooms, house_type, own_rent, land, tv_flag, bike_flag, fridge_flag, wm_flag)`,
                    values = `('${data.no_of_rooms}', '${data.house_type}', '${data.own_rent}', '${data.land}', '${data.tv_flag}',  '${data.bike_flag}', '${data.fridge_flag}', '${data.wm_flag}')`,
                    whr = data.form_no > 0 ? `form_no = '${data.form_no}'` : null,
                    flag = data.form_no > 0  ? 1 : 0;
                    var house_hold_dt = await db_Insert(table_name, fields, values, whr, flag);

            
                if (data.memberdtls.length > 0) {    
                    for (let dt of data.memberdtls) {
                var table_name = "td_grt_family",
                fields = dt.sl_no > 0 ? `grt_date = '${datetime}', family_name = '${dt.family_name}', relation = '${dt.relation}', age = '${dt.age}', sex = '${dt.sex}', education = '${dt.education}',
                stu_work_flag = '${dt.stu_work_flag}', monthly_income = '${dt.monthly_income}'` : `(form_no, sl_no, grt_date, family_name, relation, age, sex, education, stu_work_flag, monthly_income)`,
                values = `('${dt.form_no}', count(sl_no)+1, '${datetime}', '${dt.family_name}', '${dt.relation}', '${dt.age}', '${dt.sex}', '${dt.education}', '${dt.stu_work_flag}', '${dt.monthly_income}')`
                whr = dt.sl_no > 0 ? form_no = '${data.form_no}' : null,
                flag = dt.sl_no > 0 ? 1 : 0;
                var family_dt = await db_Insert(table_name,fields,values,whr,flag)
                    }
                }
        
            resolve(family_dt)
        });
    },

    edit_basic_dt: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            var table_name = "md_member",
            fields = `gender = '${data.gender}', client_name = '${data.client_name}', client_mobile = '${data.client_mobile}', email_id = '${data.email_id}', gurd_name = '${data.gurd_name}', gurd_mobile = '${data.gurd_mobile == '' ? 0 : data.gurd_mobile}', husband_name = ${data.husband_name == 'NULL' ? '' : data.husband_name}, client_addr = '${data.client_addr.split("'").join("\\'")}', pin_no = '${data.pin_no}', aadhar_no = '${data.aadhar_no}', pan_no = '${data.pan_no}',
             religion = '${data.religion}', other_religion = '${data.religion == 'Others' ? data.other_religion : 'null'}', caste = '${data.caste}', other_caste = '${data.caste == 'Others' ? data.other_caste : 'null'}', education = '${data.education}', other_education = '${data.education == 'Others' ? data.other_education : 'null'}',
              dob = '${data.dob}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `member_code = '${data.member_code}' AND branch_code = '${data.branch_code}'`,
            flag = 1;
            var edit_basic_dt = await db_Insert(table_name, fields, values, whr, flag);

            if(edit_basic_dt.suc > 0){
                var table_name = "td_grt_basic",
                fields = `grt_date = '${data.grt_date}', prov_grp_code = '0',
                bm_lat_val = '${data.bm_lat_val}', bm_long_val = '${data.bm_long_val}', bm_gps_address = '${data.bm_gps_address}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                values = null,
                whr = `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}' AND member_code = '${data.member_code}'`,
                flag = 1;
                var final_dt = await db_Insert(table_name,fields,values,whr,flag);
            }
            resolve(edit_basic_dt)
        });
    },

    edit_occup_dt: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            var select = "form_no",
            table_name = "td_grt_occupation_household",
            whr = `form_no = '${data.form_no}'`,
            order = null;
            var res_dt = await db_Select(select,table_name,whr,order)

            if(res_dt.msg.length > 0 && res_dt.suc > 0){
                var table_name = "td_grt_occupation_household",
                fields = `self_occu = '${data.self_occu}', self_income = '${data.self_income > 0 ? data.self_income : 0}', spouse_occu = '${data.spouse_occu}', spouse_income = '${data.spouse_income > 0 ? data.spouse_income : 0}', 
                loan_purpose = '${data.loan_purpose}', sub_pupose = '0', applied_amt = '${data.applied_amt > 0 ? data.applied_amt : 0}', other_loan_flag = '${data.other_loan_flag}',
                 other_loan_amt = '${data.other_loan_amt > 0 ? data.other_loan_amt : 0}', other_loan_emi = '${data.other_loan_emi > 0 ? data.other_loan_emi : 0}',
                 modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                values = null,
                whr = `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}'`,
                flag = 1;
                var occup_dt = await db_Insert(table_name, fields, values, whr, flag); 
            }else {
                var table_name = "td_grt_occupation_household",
                fields = "(form_no, branch_code, self_occu, self_income, spouse_occu, spouse_income, loan_purpose, sub_pupose, applied_amt, other_loan_flag, other_loan_amt, other_loan_emi, created_by, created_at)",
                values =  `('${data.form_no}', '${data.branch_code}', '${data.self_occu}', '${data.self_income > 0 ? data.self_income : 0}', '${data.spouse_occu}', '${data.spouse_income > 0 ? data.spouse_income : 0}', '${data.loan_purpose}', '0', '${data.applied_amt > 0 ? data.applied_amt : 0}', '${data.other_loan_flag}', '${data.other_loan_amt > 0 ? data.other_loan_amt : 0}', '${data.other_loan_emi > 0 ? data.other_loan_emi : 0}', '${data.created_by}', '${datetime}')`,
                whr = null,
                flag = 0;
                var occup_dt = await db_Insert(table_name, fields, values, whr, flag);
            }
            resolve(occup_dt)
        });
    },

    edit_household_dt: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            var select = "form_no",
            table_name = "td_grt_occupation_household",
            whr = `form_no = '${data.form_no}'`,
            order = null;
            var res_dt = await db_Select(select,table_name,whr,order)

            if(res_dt.msg.length > 0 && res_dt.suc > 0){
                var table_name = "td_grt_occupation_household",
                    fields = `no_of_rooms = '0', house_type = '${data.house_type}', own_rent = '${data.own_rent}', land = '${data.land == '' ? 0 : data.land}', tv_flag = '${data.tv_flag}', 
                    bike_flag = '${data.bike_flag}', fridge_flag = '${data.fridge_flag}', wm_flag = '${data.wm_flag}', poltical_flag = '${data.poltical_flag}',
                 parental_addr = '${data.parental_addr}', parental_phone = '${data.parental_phone == '' ? 0 : data.parental_phone}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                    values = null,
                    whr = `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}'`,
                    flag = 1;
                    var house_hold_dt = await db_Insert(table_name, fields, values, whr, flag);
            }else {
                var table_name = "td_grt_occupation_household",
                    fields = `(no_of_rooms, house_type, own_rent, land, tv_flag, bike_flag, fridge_flag, wm_flag,poltical_flag,parental_addr,parental_phone,created_by,created_at)`,
                    values = `('0', '${data.house_type}', '${data.own_rent}', '${data.land == '' ? 0 : data.land}', '${data.tv_flag}', '${data.bike_flag}', '${data.fridge_flag}', '${data.wm_flag}','${data.poltical_flag}', '${data.parental_addr}', '${data.parental_phone == '' ? 0 : data.parental_phone}', '${data.created_by}', ${datetime})`,
                    whr = null,
                    flag = 0;
                    var house_hold_dt = await db_Insert(table_name, fields, values, whr, flag);
            }
            resolve(house_hold_dt)
        });
    },

    edit_family_dt: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            // console.log(data, 'de');
    
            if (data.memberdtls.length > 0) {
    
                // var maxSl = `SELECT MAX(sl_no) AS max_sl_no FROM td_grt_family WHERE form_no = '${data.form_no}' AND branch_code = '${data.branch_code}'`;
                // console.log(maxSl,'se');

                // var result = await db_Select(
                //     'MAX(sl_no) AS max_sl_no', 
                //     'td_grt_family',           
                //     `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}'`
                //   );
                 
                //   if (result && result.length > 0 && result[0] !== undefined) {
                //     var maxSlNo = result[0].max_sl_no || 0;  
                //   } else {
                //     var maxSlNo = 0;
                //   }
                                    
                //   i = parseInt(maxSlNo) + 1;
                  
    
                for (let dt of data.memberdtls) {
                    if (dt.sl_no && dt.sl_no > 0) { 
                        var table_name = "td_grt_family",
                            fields = `family_name = '${dt.name}', relation = '${dt.relation}', family_dob = '${dt.familyDob}', age = '${dt.age}', sex = '${dt.sex}', education = '${dt.education}', stu_work_flag = '${dt.studyingOrWorking}', monthly_income = '${dt.monthlyIncome}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                            values = null,
                            whr = `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}' AND sl_no = '${dt.sl_no}'`,
                            flag = 1;
                        var family_dt = await db_Insert(table_name, fields, values, whr, flag);
                    } else {
                        var get_next_sl_no = await db_Select(
                            'IF(MAX(sl_no)>0,MAX(sl_no),0)+1 AS next_sl_no', 
                            'td_grt_family',           
                            `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}'`,
                            null
                        );
                        var next_sl_no = get_next_sl_no.suc > 0 ? get_next_sl_no.msg[0].next_sl_no : 1
                        var table_name = "td_grt_family",
                            fields = `(form_no, sl_no, branch_code, family_name, relation, family_dob, age, sex, education, stu_work_flag, monthly_income, created_by, created_at)`,
                            values = `('${data.form_no}', '${next_sl_no}', '${data.branch_code}', '${dt.name}', '${dt.relation}', '${dt.familyDob}', '${dt.age}', '${dt.sex}', '${dt.education}', '${dt.studyingOrWorking}', '${dt.monthlyIncome}', '${data.created_by}', '${datetime}')`,
                            whr = null,
                            flag = 0;
                        var family_dt = await db_Insert(table_name, fields, values, whr, flag);
                        // i++; 
                    }
                }
                resolve(family_dt);
            } else {
                reject({ "suc": 0, "msg": "No member details provided" });
            }
        });
    },

    grp_save: (data) => {
        return new Promise(async (resolve, reject) => {
            try{
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let group_code = await groupCode(data.branch_code);

            // let group_code_value = group_code.msg[0].group_code || 0;
            // console.log(group_code_value,'lolo');
            

            var table_name = "md_group",
            fields = "(group_code , branch_code, group_name, group_type, co_id, phone1, phone2, email_id, grp_addr, disctrict, block, pin_no, grp_open_dt, created_by, created_at)",
            values =  `('${group_code}', '${data.branch_code}', '${data.group_name}', '${data.group_type}', '${data.co_id}', '${data.phone1}', '${data.phone2}', '${data.email_id}', '${data.grp_addr.split("'").join("\\'")}', '${data.disctrict}', '${data.block}', '${data.pin_no}', '${datetime}', '${data.created_by}', '${datetime}')`,
            whr = null,
            flag = 0;
            var grp_dt = await db_Insert(table_name, fields, values, whr, flag);
            console.log(grp_dt,'dt');
            
            if(grp_dt.suc > 0 && grp_dt.msg.length > 0){
                if (data.grp_memberdtls.length > 0) {
                  for (let dt of data.grp_memberdtls) {
                    var table_name = "td_grt_basic",
                    fields = `prov_grp_code = '${group_code}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                    values = null,
                    whr = `form_no = '${dt.form_no}' AND branch_code = '${data.branch_code}' AND member_code = '${dt.member_code}'`,
                    flag = 1;
                var grp_mem_dt = await db_Insert(table_name, fields, values, whr, flag);
                  }
            }
            }

            grp_dt["group_code"] = group_code;
            grp_dt["group_name"] = data.group_name;
            grp_dt["grp_open_dt"] = datetime;
            resolve(grp_dt);
        } catch (error) {
            reject(error);
        }
        });
    },

    edit_grp_save: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            var table_name = "md_group",
            fields = `phone1 = '${data.phone1}', phone2 = '${data.phone2}', email_id = '${data.email_id}', grp_addr = '${data.grp_addr}',
             block = '${data.block}', pin_no = '${data.pin_no}', bank_name =  '${data.bank_name}', branch_name = '${data.branch_name}',
              ifsc =  '${data.ifsc}', micr = '${data.micr}', acc_no1 = '${data.acc_no1}', acc_no2 = '${data.acc_no2}',
               ac_open_dt =  '${datetime}', modified_by = '${data.modified_by}', modified_at =  '${datetime}'`,
            values = null,
            whr = `group_code = '${data.group_code}' AND branch_code = '${data.branch_code}'`,
            flag = 1;
            var edit_grp_dt = await db_Insert(table_name, fields, values, whr, flag);
            // console.log(edit_grp_dt,'dt');

            resolve(edit_grp_dt);
        });
    },

    final: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            var table_name = "td_grt_basic",
            fields = `approval_status = 'S', remarks = '${data.remarks.split("'").join("\\'")}', modified_by = '${data.modified_by}', modified_at =  '${datetime}'`,
            values = null,
            whr = `form_no = '${data.form_no}' AND branch_code = '${data.branch_code}'`,
            flag = 1;
            var final_dt = await db_Insert(table_name, fields, values, whr, flag);
            // console.log(final_dt,'dt');

            resolve(final_dt);
        });
    },
}

