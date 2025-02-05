const { db_Insert, db_Select } = require("../../../model/mysqlModel");

const emp_id = (branch_code) => {
    return new Promise(async (resolve, reject) => {

        //make employee id
        var select = "max(substr(emp_id,-5)) + 1  emp_id",
        table_name = "md_employee",
        whr = null,
        order = null;
        var res_dt = await db_Select(select, table_name, whr, order);

        let newempCode = res_dt.msg[0].emp_id;    
        // console.log(newempCode,'ggg');
            
        let empCode = `${branch_code}` + newempCode;
        // console.log(empCode,'code');
        
      resolve(empCode);
    });
  };

module.exports = {
    emp_details_save: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                // console.log(data,'data');
                
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            emp_code = await emp_id(data.branch_code)
            // console.log(emp_code,'lolo');
            
            //save employee details in md_employee table
            var table_name = "md_employee",
                fields = data.emp_id > 0 ? `emp_name = '${data.emp_name}', gender = '${data.gender}', guardian_name = '${data.guardian_name}', addr = '${data.addr.split("'").join("\\'")}', district = '${data.district.split("'").join("\\'")}', pin_code = '${data.pin_code == '' ? 0 : data.pin_code}', phone_home = '${data.phone_home == '' ? 0 : data.phone_home}', phone_mobile = '${data.phone_mobile == '' ? 0 : data.phone_mobile}', email = ${data.email == '' ? NULL : data.email}', designation = '${data.designation == '' ? 0 : data.designation}', nationality = ${data.nationality == '' ? NULL : data.nationality}, dob = ${data.dob == '' ? NULL : data.dob}, married = ${data.married == '' ? NULL : data.married}, language_known = ${data.language_known == '' ? NULL : data.language_known}, doj = ${data.doj == '' ? NULL : data.doj}, prob_period = '${data.prob_period == '' ? 0 : data.prob_period}', retairment_age = '${data.retairment_age == '' ? 0 : data.retairment_age}', conf_dt = ${data.conf_dt == '' ? NULL : data.conf_dt}, retair_dt = ${data.retair_dt == '' ? NULL : data.retair_dt}, blood_grp = ${data.blood_grp == '' ? NULL : data.blood_grp}, voter_id = ${data.voter_id == '' ? NULL : data.voter_id}, pan_no = ${data.pan_no == '' ? NULL : data.pan_no}, aadhar_no = ${data.aadhar_no == '' ? NULL : data.aadhar_no}, bank_name = ${data.bank_name == '' ? NULL : data.bank_name}, branch_name = ${data.branch_name == '' ? NULL : data.branch_name}, ifsc = ${data.ifsc == '' ? NULL : data.ifsc}, acc_no = ${data.acc_no == '' ? NULL : data.acc_no}, remarks = '${data.remarks.split("'").join("\\'")}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'` : `(emp_id,branch_id,area_code,emp_name,gender,guardian_name,addr,district,pin_code,phone_home,phone_mobile,email,designation,nationality,dob,married,language_known,doj,prob_period,retairment_age,conf_dt,retair_dt,blood_grp,voter_id,pan_no,aadhar_no,bank_name,branch_name,ifsc,acc_no,remarks,created_by,created_dt)`,
                values = `('${emp_code}','${data.branch_code}','0','${data.emp_name}','${data.gender}','${data.guardian_name}','${data.addr.split("'").join("\\'")}','${data.district.split("'").join("\\'")}','${data.pin_code}','${data.phone_home}','${data.phone_mobile}','${data.email}','${data.designation}','${data.nationality}','${data.dob}','${data.married}','${data.language_known}','${data.doj}','${data.prob_period}','${data.retairment_age}','${data.conf_dt}','${data.retair_dt}','${data.blood_grp}','${data.voter_id}','${data.pan_no}','${data.aadhar_no}','${data.bank_name}','${data.branch_name}','${data.ifsc}','${data.acc_no}','${data.remarks.split("'").join("\\'")}','${data.created_by}','${datetime}')`,
                whr =  data.emp_id > 0 ? `emp_id = '${data.emp_id}' AND branch_id = '${data.branch_code}'` : null,
                flag = data.emp_id > 0 ? 1 : 0;
                var save_dtls = await db_Insert(table_name,fields,values,whr,flag);

            resolve(save_dtls)
            // console.log(save_dtls,'lo');
            
        }catch(error){
            reject({"suc": 2, "msg": "Error occurred during saving emp details", details: error });
        } 
    });
    }
}