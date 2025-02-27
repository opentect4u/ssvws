var dateFormat = require("dateformat");
const { db_Insert, db_Select } = require("../../model/mysqlModel");
const { groupCode } = require("../api/masterModule");

module.exports = {
    edit_grp_web: (data) => {
        return new Promise(async (resolve, reject) => {
          try{
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let group_code = await groupCode(data.branch_code)

            var table_name = "md_group",
            fields = data.group_code > 0 ? `group_name = '${data.group_name}', group_type = '${data.group_type}',
             phone1 = '${data.phone1 == '' ? 0 : data.phone1}', phone2 = '${data.phone2 == '' ? 0 : data.phone2}', email_id = '${data.email_id}', grp_addr = '${data.grp_addr.split("'").join("\\'")}',
             disctrict = '${data.district}', block = '${data.block ? data.block : 0}', pin_no = '${data.pin_no}', bank_name =  '${data.bank_name}', branch_name = '${data.branch_name}',
              ifsc =  '${data.ifsc}', micr = '${data.micr}', acc_no1 = '${data.acc_no1 == '' ? 0 : data.acc_no1}', acc_no2 = '${data.acc_no2 == '' ? 0 : data.acc_no2}',
            modified_by = '${data.modified_by}', modified_at =  '${datetime}'` : `(group_code, branch_code, group_name, group_type, co_id, phone1, phone2, email_id, grp_addr, disctrict, block, pin_no, bank_name, branch_name, ifsc, micr, acc_no1, acc_no2, open_close_flag, grp_open_dt, approval_status, created_by, created_at)`,
            values = `('${group_code}', '${data.branch_code}', '${data.group_name}', '${data.group_type}', '${data.co_id}', '${data.phone1 == '' ? 0 : data.phone1}', '${data.phone2 == '' ? 0 : data.phone2}',
            '${data.email_id}', '${data.grp_addr.split("'").join("\\'")}', '${data.district}', '${data.block ? data.block : 0}', '${data.pin_no}', ${data.bank_name}, ${data.branch_name}, '${data.ifsc == '' ? 0 : data.ifsc}', '${data.micr == '' ? 0 : data.micr}', '${data.acc_no1 == '' ? 0 : data.acc_no1}',
            '${data.acc_no2 == '' ? 0 : data.acc_no2}', 'O', '${datetime}', 'U', '${data.modified_by}', '${datetime}')`,
            whr = data.group_code > 0 ? `group_code = '${data.group_code}' AND branch_code = '${data.branch_code}'` : null,
            flag = data.group_code > 0 ? 1 : 0;
            var edit_grp_dtls = await db_Insert(table_name, fields, values, whr, flag);
            // console.log(edit_grp_dtls.msg.group_code,'dt');

            let final_group_code = data.group_code > 0 
                ? data.group_code  // If updating, keep the same group_code
                : edit_grp_dtls.msg.insertId || group_code; // If inserting, use the generated code

            // console.log(final_group_code, 'final_group_code'); // Debugging

            // if(edit_grp_dtls.suc > 0 && edit_grp_dtls.msg.length > 0){
              if (edit_grp_dtls.suc > 0) {
              if (data.grp_memberdtls.length > 0) {
                for (let dt of data.grp_memberdtls) {
                  var table_name = "td_grt_basic",
                  fields = `prov_grp_code = '${final_group_code}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                  values = null,
                  whr = `form_no = '${dt.form_no}' AND branch_code = '${data.branch_code}' AND member_code = '${dt.member_code}'`,
                  flag = 1;
              var grp_mem_dt = await db_Insert(table_name, fields, values, whr, flag);
                }
          }
          }
          edit_grp_dtls["group_code"] = group_code;
            resolve(edit_grp_dtls);
          } catch (error) {
            reject(error);
        }
        });
    },

    edit_basic_dt_web: (data) => {
        return new Promise(async (resolve, reject) => {
          try{
          let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    
          var table_name = "md_member",
          fields = `gender = '${data.gender}', client_name = '${data.client_name}', client_mobile = '${data.client_mobile}', email_id = '${data.email_id}', gurd_name = '${data.gurd_name}', gurd_mobile = '${data.gurd_mobile == '' ? 0 : data.gurd_mobile}', client_addr = '${data.client_addr.split("'").join("\\'")}', pin_no = '${data.pin_no}', aadhar_no = '${data.aadhar_no}', pan_no = '${data.pan_no}',
           religion = '${data.religion}', other_religion = '${data.religion == 'Others' ? data.other_religion : 'null'}', caste = '${data.caste}', other_caste = '${data.caste == 'Others' ? data.other_caste : 'null'}', education = '${data.education}', other_education = '${data.education == 'Others' ? data.other_education : 'null'}',
            dob = '${data.dob}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
          values = null,
          whr = `member_code = '${data.member_code}'`,
          flag = 1;
          var edit_basic_dt_web = await db_Insert(table_name, fields, values, whr, flag);

          if(edit_basic_dt_web.suc > 0){
            var table_name = "td_grt_basic",
            fields = `grt_date = '${data.grt_date}',
            bm_lat_val = '${data.bm_lat_val}', bm_long_val = '${data.bm_long_val}', bm_gps_address = '${data.bm_gps_address}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            // fields = `grt_date = '${data.grt_date}', 
            // bm_lat_val = '${data.bm_lat_val}', bm_long_val = '${data.bm_long_val}', bm_gps_address = '${data.bm_gps_address}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
            values = null,
            whr = `form_no = '${data.form_no}' AND member_code = '${data.member_code}'`,
            flag = 1;
            var final_dt = await db_Insert(table_name,fields,values,whr,flag);
        }
          resolve(edit_basic_dt_web);
        } catch (error) {
          reject(error);
      }
        });
      },
    
      edit_occup_dt_web: (data) => {
        return new Promise(async (resolve, reject) => {
          try{
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
            whr = `form_no = '${data.form_no}'`,
            flag = 1;
          var edit_occup_dt = await db_Insert(
            table_name,
            fields,
            values,
            whr,
            flag
          );
        }else {
          var table_name = "td_grt_occupation_household",
          fields = "(form_no, branch_code, self_occu, self_income, spouse_occu, spouse_income, loan_purpose, sub_pupose, applied_amt, other_loan_flag, other_loan_amt, other_loan_emi, created_by, created_at)",
          values =  `('${data.form_no}', '${data.branch_code}', '${data.self_occu}', '${data.self_income > 0 ? data.self_income : 0}', '${data.spouse_occu}', '${data.spouse_income > 0 ? data.spouse_income : 0}', '${data.loan_purpose}', '0', '${data.applied_amt > 0 ? data.applied_amt : 0}', '${data.other_loan_flag}', '${data.other_loan_amt > 0 ? data.other_loan_amt : 0}', '${data.other_loan_emi > 0 ? data.other_loan_emi : 0}', '${data.created_by}', '${datetime}')`,
          whr = null,
          flag = 0;
          var edit_occup_dt = await db_Insert(table_name, fields, values, whr, flag);
      }
          resolve(edit_occup_dt);
        } catch (error) {
          reject(error);
      }
        });
      },
    
      edit_household_dt_web: (data) => {
        return new Promise(async (resolve, reject) => {
          try{
          let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

          var select = "form_no",
            table_name = "td_grt_occupation_household",
            whr = `form_no = '${data.form_no}'`,
            order = null;
            var res_dt = await db_Select(select,table_name,whr,order)
    
            if(res_dt.msg.length > 0 && res_dt.suc > 0){  
          var table_name = "td_grt_occupation_household",
            fields = `no_of_rooms = '0', house_type = ${data.house_type ? `'${data.house_type}'` : 'NULL'}, own_rent = ${data.own_rent ? `'${data.own_rent}'` : 'NULL'}, land = '${data.land == '' ? 0 : data.land}', tv_flag = ${data.tv_flag ? `'${data.tv_flag}'` : 'NULL'}, 
                    bike_flag = ${data.bike_flag ? `'${data.bike_flag}'` : 'NULL'}, fridge_flag = ${data.fridge_flag ? `'${data.fridge_flag}'` : 'NULL'}, wm_flag = ${data.wm_flag ? `'${data.wm_flag}'` : 'NULL'}, poltical_flag = ${data.political_flag ? `'${data.political_flag}'` : 'NULL'},
                 parental_addr = '${data.parental_addr.split("'").join("\\'")}', parental_phone = '${data.parental_phone == '' ? 0 : data.parental_phone}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
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
        }else {
          var table_name = "td_grt_occupation_household",
          fields = `(no_of_rooms, house_type, own_rent, land, tv_flag, bike_flag, fridge_flag, wm_flag,poltical_flag,parental_addr,parental_phone,created_by,created_at)`,
                    values = `('0', ${data.house_type ? `'${data.house_type}'` : 'NULL'}, ${data.own_rent ? `'${data.own_rent}'` : 'NULL'}, '${data.land == '' ? 0 : data.land}', ${data.tv_flag ? `'${data.tv_flag}'` : 'NULL'}, ${data.bike_flag ? `'${data.bike_flag}'` : 'NULL'}, ${data.fridge_flag ? `'${data.fridge_flag}'` : 'NULL'}, ${data.wm_flag ? `'${data.wm_flag}'` : 'NULL'},${data.political_flag ? `'${data.political_flag}'` : 'NULL'}, '${data.parental_addr.split("'").join("\\'")}', '${data.parental_phone == '' ? 0 : data.parental_phone}', '${data.created_by}', ${datetime})`,
          whr = null,
          flag = 0;
          var edit_household_dt = await db_Insert(table_name, fields, values, whr, flag);
  }
          resolve(edit_household_dt);
        } catch (error) {
          reject(error);
      }
        });
      },

      edit_family_dt_web: (data) => {
        return new Promise(async (resolve, reject) => {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    
            if (data.memberdtls.length > 0) {
                for (let dt of data.memberdtls) {
                  // console.log(dt,'dttt');
                  
                    if (dt.sl_no && dt.sl_no > 0) { 
                        var table_name = "td_grt_family",
                            fields = `family_name = '${dt.name}', relation = '${dt.relation}', family_dob = '${dt.familyDob}', age = '${dt.age}', sex = '${dt.sex}', education = '${dt.education}', stu_work_flag = '${dt.studyingOrWorking}', monthly_income = '${dt.monthlyIncome}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
                            values = null,
                            whr = `form_no = '${data.form_no}' AND sl_no = '${dt.sl_no}'`,
                            flag = 1;
                        var family_dt = await db_Insert(table_name, fields, values, whr, flag);
                    } else {
                        var get_next_sl_no = await db_Select(
                            'IF(MAX(sl_no)>0,MAX(sl_no),0)+1 AS next_sl_no', 
                            'td_grt_family',           
                            `form_no = '${data.form_no}'`,
                            null
                        );
                        var next_sl_no = get_next_sl_no.suc > 0 ? get_next_sl_no.msg[0].next_sl_no : 1
                        var table_name = "td_grt_family",
                            fields = `(form_no, sl_no, branch_code, family_name, relation, family_dob, age, sex, education, stu_work_flag, monthly_income, created_by, created_at)`,
                            values = `('${data.form_no}', '${next_sl_no}', '${data.branch_code}', '${dt.name}', '${dt.relation}', '${dt.familyDob}', '${dt.age}', '${dt.sex}', '${dt.education}', '${dt.studyingOrWorking}', '${dt.monthlyIncome}', '${data.created_by}', '${datetime}')`,
                            whr = null,
                            flag = 0;
                        var family_dt = await db_Insert(table_name, fields, values, whr, flag);
                    }
                }
                resolve(family_dt);
            } else {
                reject({ "suc": 0, "msg": "No member details provided" });
            } 
        });
    },

    fwd_mis_asst: (data) => {
      return new Promise(async (resolve, reject) => {
        try{
        let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

        var table_name = "td_grt_basic",
        fields = `approval_status = 'A', remarks = '${data.remarks.split("'").join("\\'")}', approved_by = '${data.approved_by}', approved_at = '${datetime}'`,
        values = null,
        whr = `form_no = '${data.form_no}' AND member_code = '${data.member_id}'`,
        flag = 1;
        var fwd_dt = await db_Insert(table_name, fields, values, whr, flag);
        // console.log(fwd_dt,'dt');

        resolve(fwd_dt);
      } catch (error) {
        reject(error);
      }
      });
    },

  //   assign_group_to_member: (data) => {
  //     return new Promise(async (resolve, reject) => {
  //         let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  
  //         if (data.memDtls?.length > 0) {
  //             for (let dt of data.memDtls) {
  //               console.log(dt,'dttt');
              
  //                     var table_name = "td_grt_basic",
  //                         fields = `prov_grp_code = '${dt.group_code}', grp_added_by = '${dt.added_by}', grp_added_at = '${datetime}'`,
  //                         values = null,
  //                         whr = `member_code = '${dt.member_code}'`,
  //                         flag = 1;
  //                     var assign_grp_dt = await db_Insert(table_name, fields, values, whr, flag);
                  
  //             }
  //             resolve(assign_grp_dt);
  //         } else {
  //             reject({ "suc": 0, "msg": "No details provided" });
  //         } 
  //     });
  // },

  assign_group_to_member: (data) => {
    return new Promise(async (resolve, reject) => {
      let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  
      if (data.member_code.length > 0) {
        for (let member_code of data.member_code) {
          const table_name = "td_grt_basic",
                fields = `prov_grp_code = '${data.group_code}', grp_added_by = '${data.added_by}', grp_added_at = '${datetime}'`,
                values = null,
                whr = `member_code = '${member_code}'`,
                flag = 1;
  
          await db_Insert(table_name, fields, values, whr, flag);
        }
        resolve({ "suc": 1, "msg": "Group assigned to all members successfully" });
      } else {
        reject({ "suc": 0, "msg": "No member codes provided" });
      }
    });
  },

  back_dt_to_bm: (data) => {
    return new Promise(async (resolve, reject) => {
      try{
      let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

      var table_name = "td_grt_basic",
      fields = `approval_status = 'U', remarks = '${data.remarks.split("'").join("\\'")}', modified_by = '${data.modified_by}', modified_at = '${datetime}'`,
      values = null,
      whr = `form_no = '${data.form_no}' AND member_code = '${data.member_id}'`,
      flag = 1;
      var back_dt_bm = await db_Insert(table_name, fields, values, whr, flag);
      // console.log(back_dt_bm,'dt');

      resolve(back_dt_bm);
    } catch (error) {
      reject(error);
  }
    });
  },

  remove_member_dtls: (data) => {
    return new Promise(async (resolve, reject) => {
      try{
      let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      
      //FUNCTION OF RWEMOVE MEMBER DETAILS
        var table_name = "td_grt_basic",
        fields = `approval_status = 'R', remarks = '${data.remove_remarks.split("'").join("\\'")}', rejected_by = '${data.rejected_by}', rejected_at = '${datetime}'`,
        values = null,
        whr = `branch_code = '${data.branch_code}' AND form_no = '${data.form_no}' AND member_code = '${data.member_code}'`,
        flag = 1;
        var response_data = await db_Insert(table_name, fields, values, whr, flag);

      // console.log(back_dt_bm,'dt');

      resolve(response_data);
    } catch (error) {
      reject(error);
  }
    });
  },
  
  
}