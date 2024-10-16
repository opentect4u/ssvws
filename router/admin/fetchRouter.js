const { db_Select, db_Insert } = require('../../model/mysqlModel');
const { edit_grp_web, edit_basic_dt_web, edit_occup_dt_web, edit_household_dt_web, edit_family_dt_web, fwd_mis_asst } = require('../../modules/admin/fetchModule');

const fetchRouter = require('express').Router();
dateFormat = require('dateformat');

fetchRouter.get("/fetch_bmfwd_dtls_web", async (req, res) => {
    var data = req.query;
    console.log(data,'dd');
    
    var select = data.prov_grp_code > 0 ? 'a.prov_grp_code, b.*' : 'DISTINCT a.prov_grp_code, b.group_name, b.group_type',
    table_name = 'td_grt_basic a, md_group b',
    whr = `a.prov_grp_code = b.group_code
    AND a.approval_status = 'S' ${data.prov_grp_code > 0 ? `AND a.prov_grp_code = ${data.prov_grp_code}` : ''}`,
    order = null;
    var res_dt = await db_Select(select,table_name,whr,order);

    if(res_dt.suc > 0 && res_dt.msg.length > 0 && data.prov_grp_code > 0){
        var select = '*',
        table_name = 'td_grt_basic',
        whr = `approval_status = 'S' AND prov_grp_code = ${data.prov_grp_code}`,
        order = null;
        var mem_dt = await db_Select(select,table_name,whr,order);
        res_dt.msg[0]['memb_dt'] = mem_dt.suc > 0 ? (mem_dt.msg.length > 0 ? mem_dt.msg : []) : []
    }
    res.send(res_dt)
});

fetchRouter.get("/fetch_occup_dt_web", async (req, res) => {
    var data = req.query;

    var select = "a.form_no,a.grt_date,a.self_occu,a.self_income,a.spouse_occu,a.spouse_income,a.loan_purpose,a.sub_pupose,a.applied_amt,a.other_loan_flag,a.other_loan_amt,a.other_loan_emi,b.purpose_id,c.sub_purp_name",
    table_name = "td_grt_occupation_household a, md_purpose b, md_sub_purpose c",
    whr = `a.loan_purpose = b.purp_id 
    AND a.sub_pupose = c.sub_purp_id 
    AND a.form_no = '${data.form_no}'`,
    order = null;
    var occup_dt = await db_Select(select,table_name,whr,order)
    res.send(occup_dt)
});

fetchRouter.get("/fetch_household_dt_web", async (req, res) => {
    var data = req.query;

    var select = "form_no,house_type,own_rent,no_of_rooms,land,tv_flag,bike_flag,fridge_flag,wm_flag,poltical_flag,parental_addr,parental_phone",
    table_name = "td_grt_occupation_household",
    whr = `form_no = '${data.form_no}'`,
    order = null;
    var household_dt = await db_Select(select,table_name,whr,order)
    res.send(household_dt)
});

fetchRouter.get("/fetch_family_dt_web", async (req, res) => {
    var data = req.query;

    var select = "form_no,sl_no,grt_date,family_name name,relation,age,sex,education,stu_work_flag studyingOrWorking,monthly_income monthlyIncome",
    table_name = "td_grt_family",
    whr = `form_no = '${data.form_no}'`,
    order = null;
    var family_dt = await db_Select(select,table_name,whr,order)
    res.send(family_dt)
});

fetchRouter.post("/edit_group_web", async (req, res) => {
    var data = req.body;
    // console.log(data,'grp_dt');

    var edit_grp_dt = await edit_grp_web(data);
    // console.log(grp_dt,'grp');
    
    res.send(edit_grp_dt);
});

fetchRouter.post("/edit_basic_dtls_web", async (req, res) => {
    var data = req.body;
  
    var basic_dt_web = await edit_basic_dt_web(data);
    res.send(basic_dt_web);
  });
  
  fetchRouter.post("/edit_occup_dtls_web", async (req, res) => {
    var data = req.body;
  
    var occup_dt_web = await edit_occup_dt_web(data);
    res.send(occup_dt_web);
  });
  
  fetchRouter.post("/edit_household_dtls_web", async (req, res) => {
    var data = req.body;
  
    var household_dt_web = await edit_household_dt_web(data);
    res.send(household_dt_web);
  });

  fetchRouter.post("/edit_family_dtls_web", async (req, res) => {
    var data = req.body, res_data;

    edit_family_dt_web(data).then(data => {
        res_data = data
    }).catch(err => {
        res_data = err
    }).finally(() => {
    res.send(res_data);
})
  });


  fetchRouter.post("/delete_member_mis", async (req, res) => {
    var data = req.body;
    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var table_name = "td_grt_basic",
    fields = `approval_status = '${data.approval_status}', remarks = '${data.remarks.split("'").join("\\'")}', rejected_by = '${data.rejected_by}', rejected_at = '${datetime}'`,
    values = null,
    whr = `form_no = '${data.form_no}' AND member_code = '${data.member_code}'`,
    flag = 1;
    var delete_mem_dt = await db_Insert(table_name, fields, values, whr, flag);
    res.send(delete_mem_dt)
});  

fetchRouter.post("/forward_mis_asst", async (req, res) => {
    var data = req.body;

    var fwd_dt = await fwd_mis_asst(data);
    res.send(fwd_dt)
});

fetchRouter.post("/verify_by_mis", async (req, res) => {
    const data = req.body, value = '';
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    switch (data.flag) {
        case "PH":
            value = phone_verify_flag = '${data.verify_value}';
            break;
        case "A":
            value = aadhar_verify_flag = '${data.verify_value}';
            break;
        case "P":
            value = pan_verify_flag = '${data.verify_value}';
            break;
        default:
            return res.status(400).send({ suc: 0, msg: [], status: 'Invalid flag provided' });
    }

    try {
        var verify_dtls = await db_Insert('td_grt_basic', value, null,
            `form_no = '${data.form_no}' AND member_code = '${data.member_id}'`, 1
        );

        if (verify_dtls.suc > 0) {
            return res.send({ suc: 1, msg: 'Verification details updated successfully', data: verify_dtls.msg });
        } else {
            return res.send(verify_dtls);
        }
    } catch (error) {
        return res.send({ suc: 0, msg: 'Error occurred', error: error.message });
    }
});


module.exports = {fetchRouter}