const { db_Select, db_Insert, db_Delete } = require("../../model/mysqlModel");
const {
  loan_trans,
  save_loan_dtls,
  loan_trans_date,
  update_recovery_day,
} = require("../../modules/admin/loanModule");
const { getLoanDmd, f_getOverdue, f_getOverdue_loan_id } = require("../../modules/api/masterModule");

const loanRouter = require("express").Router();
dateFormat = require("dateformat");

loanRouter.post("/scheme_dtls", async (req, res) => {
  var data = req.body;

  //fetch scheme details
  var select =
      "scheme_name,min_amt,max_amt,min_period,max_period,min_period_week,max_period_week,payment_mode,roi",
    table_name = "md_scheme",
    whr = `scheme_id = '${data.scheme_id}'`,
    order = null;
  var scheme_dt = await db_Select(select, table_name, whr, order);

  res.send(scheme_dt);
});

// loanRouter.post("/fetch_loan_application_dtls", async (req, res) => {
//     var data = req.body;

//     //fetch loan application details
//         var select = "a.branch_code,a.member_code,a.client_name,b.form_no,DATE_FORMAT(b.grt_date, '%Y-%m-%d') application_date,b.prov_grp_code,DATE_FORMAT(b.approved_at, '%Y-%m-%d') grt_approve_date,c.branch_name,d.group_name,d.acc_no1,d.acc_no2,e.applied_amt,e.loan_purpose,e.sub_pupose,f.purpose_id,g.sub_purp_name",
//         table_name = "md_member a LEFT JOIN td_grt_basic b ON a.member_code = b.member_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.prov_grp_code = d.group_code LEFT JOIN td_grt_occupation_household e ON a.branch_code = e.branch_code AND b.form_no = e.form_no LEFT JOIN md_purpose f ON e.loan_purpose = f.purp_id LEFT JOIN md_sub_purpose g ON e.sub_pupose = g.sub_purp_id",
//         whr = `a.branch_code = '${data.branch_code}' AND (a.member_code like '%${data.member_dtls}%' OR a.client_name like '%${data.member_dtls}%' OR a.client_mobile like '%${data.member_dtls}%' OR b.form_no like '%${data.member_dtls}%')`,
//         order = null;
//         var fetch_appl_dtls = await db_Select(select,table_name,whr,order);

//     res.send(fetch_appl_dtls)
// });

// loanRouter.post("/fetch_appl_dtls_via_grp", async (req, res) => {
//   var data = req.body;

//   var select =
//       "a.group_code,a.branch_code,a.group_name,a.group_type,a.bank_name,a.branch_name,a.acc_no1,a.acc_no2,a.grp_open_dt,b.branch_name brn_name",
//     table_name =
//       "md_group a LEFT JOIN md_branch b ON a.branch_code = b.branch_code",
//     whr = `a.branch_code = '${data.branch_code}' AND (a.group_code like '%${data.grp_dt}%' OR a.group_name like '%${data.grp_dt}%')`,
//     order = `ORDER BY a.group_code, a.group_name, a.group_type`;
//   var fetch_appl_dtls = await db_Select(select, table_name, whr, order);

//   if (fetch_appl_dtls.suc > 0 && fetch_appl_dtls.msg.length > 0) {
//     let group_code = fetch_appl_dtls.msg[0].group_code;
//     console.log(group_code,'code');

//     var select = "COUNT(group_code) group_code",
//     table_name = "td_loan",
//     whr = `branch_code = '${data.branch_code}' AND group_code = '${group_code}'`,
//     order = null;
//     var fetch_already_disb_data = await db_Select(select,table_name,whr,order);
//   }

//     if (fetch_already_disb_data.suc > 0 && fetch_already_disb_data.msg[0].group_count > 0) {
//       return res.send({ suc: 0, msg: "Loan already disbursed for this group." });
//     }else {
//       let group_code = fetch_appl_dtls.msg[0].group_code;
//     var select =
//         "a.member_code,a.client_name,b.form_no,DATE_FORMAT(b.grt_date, '%Y-%m-%d') application_date,DATE_FORMAT(b.approved_at, '%Y-%m-%d') grt_approve_date,c.applied_amt,c.loan_purpose,d.purpose_id,f.prn_disb_amt",
//       table_name =
//         "md_member a JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN td_grt_occupation_household c ON a.branch_code = c.branch_code AND b.form_no = c.form_no LEFT JOIN md_purpose d ON c.loan_purpose = d.purp_id LEFT JOIN td_loan f ON a.member_code = f.member_code",
//       whr = `a.branch_code = '${data.branch_code}'
//     AND b.prov_grp_code = '${group_code}' AND a.delete_flag = 'N' AND b.approval_status = 'A'`,
//       order = null;
//     var grp_mem_dt = await db_Select(select, table_name, whr, order);

//     fetch_appl_dtls.msg[0]["mem_dt_grp"] =
//       grp_mem_dt.suc > 0 && grp_mem_dt.msg.length > 0 ? grp_mem_dt.msg : [];
//     }

//   res.send(fetch_appl_dtls);
// });

loanRouter.post("/fetch_appl_dtls_via_grp", async (req, res) => {
  var data = req.body;

  // Fetch group details
  var select =
    "a.group_code,a.branch_code,a.group_name,a.group_type,a.bank_name bank_code,a.branch_name,a.acc_no1,a.acc_no2,CONCAT(c.bank_name, ' ' ,'-',' ' , c.branch_name, ' ' , '-',' ' , c.ifsc) AS bank_name,a.grp_open_dt,b.dist_code branch_dist_code,b.branch_name brn_name, 0 loan_exist, '' loan_exist_msg";
  var table_name =
    "md_group a LEFT JOIN md_branch b ON a.branch_code = b.branch_code LEFT JOIN md_bank c ON a.bank_name = c.bank_code";
  var whr = `a.branch_code = '${data.branch_code}' AND (a.group_code LIKE '%${data.grp_dt}%' OR a.group_name LIKE '%${data.grp_dt}%')`;
  var order = `ORDER BY a.group_code, a.group_name, a.group_type`;

  var fetch_appl_dtls = await db_Select(select, table_name, whr, order);

  if (fetch_appl_dtls.suc > 0 && fetch_appl_dtls.msg.length > 0) {
    for (let dt of fetch_appl_dtls.msg) {
      let group_code = dt.group_code;
      // console.log(group_code, "code");

      // Check if the group code exists in td_loan
      var loanCheckQuery = await db_Select(
        "COUNT(group_code) AS group_count",
        "td_loan",
        `branch_code = '${data.branch_code}' AND group_code = '${group_code}'`,
        null
      );

      if (
        loanCheckQuery.suc > 0 &&
        loanCheckQuery.msg.length > 0 &&
        loanCheckQuery.msg[0].group_count > 0
      ) {
        dt["loan_exist"] = loanCheckQuery.msg[0].group_count;
        dt["loan_exist_msg"] = "Loan already disbursed on this group";
      } else {
        // Fetch member details only if no loan exists
        select =
          "a.member_code,a.client_name,b.form_no,DATE_FORMAT(b.grt_date, '%Y-%m-%d') application_date,DATE_FORMAT(b.approved_at, '%Y-%m-%d') grt_approve_date,c.applied_amt,c.loan_purpose,CONCAT(d.sub_purpose,'-',d.purpose_id)purpose_id,f.prn_disb_amt";
        table_name =
          "md_member a JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN td_grt_occupation_household c ON a.branch_code = c.branch_code AND b.form_no = c.form_no LEFT JOIN md_purpose d ON c.loan_purpose = d.purp_id LEFT JOIN td_loan f ON a.member_code = f.member_code";
        whr = `a.branch_code = '${data.branch_code}' 
          AND b.prov_grp_code = '${group_code}' 
          AND a.delete_flag = 'N' 
          AND b.approval_status = 'A'`;

        var grp_mem_dt = await db_Select(select, table_name, whr, null);

        dt["mem_dt_grp"] =
          grp_mem_dt.suc > 0 && grp_mem_dt.msg.length > 0 ? grp_mem_dt.msg : [];
      }
    }
  }

  res.send(fetch_appl_dtls);
});

loanRouter.post("/fetch_disb_trans_dtls", async (req, res) => {
  var data = req.body;

  var select =
      "a.scheme_id,a.fund_id,a.period,a.curr_roi,a.recovery_day,a.period_mode,b.particulars,b.bank_charge,b.proc_charge,b.bank_name code,c.scheme_name,d.fund_name,e.bank_name",
    table_name =
      "td_loan a JOIN td_loan_transactions b ON a.loan_id = b.loan_id LEFT JOIN md_scheme c ON a.scheme_id = c.scheme_id LEFT JOIN md_fund d ON a.fund_id = d.fund_id LEFT JOIN md_bank e ON b.bank_name = e.bank_code",
    whr = `a.branch_code = '${data.branch_code}' AND a.group_code = '${data.group_code}'`,
    order = `GROUP BY a.scheme_id,a.fund_id,a.period,a.curr_roi,a.recovery_day,a.period_mode,b.particulars,b.bank_charge,b.proc_charge,b.bank_name,c.scheme_name,d.fund_name,e.bank_name`;
  var fetch_disb_dtls = await db_Select(select, table_name, whr, order);

  res.send(fetch_disb_dtls);
});

loanRouter.post("/fetch_existing_loan", async (req, res) => {
  var data = req.body;

  //fetch existing loan details
  // var select = "loan_id,branch_code,group_code,member_code,grt_form_no,purpose,sub_purpose,applied_amt,applied_dt,scheme_id,fund_id,period,curr_roi,disb_dt,prn_disb_amt,period_mode,last_trn_dt",
  var select = "*",
    table_name = "td_loan",
    whr = `grt_form_no = '${data.form_no}' AND last_trn_dt <= date(now()) AND instl_end_dt >= date(now());`,
    order = null;
  var loan_dtls = await db_Select(select, table_name, whr, order);

  if (loan_dtls.suc > 0 && loan_dtls.msg.length > 0) {
    var select =
        "payment_date transaction_dt,payment_id transaction_id,particulars,debit,bank_charge,proc_charge,tr_type,tr_mode,bank_name,cheque_id,chq_dt,status",
      table_name = "td_loan_transactions",
      whr = `loan_id = ${loan_dtls.msg[0].loan_id} AND branch_id = '${loan_dtls.msg[0].branch_code}'`,
      order = `ORDER BY payment_date ASC LIMIT 1`;
    var loan_trans_dt = await db_Select(select, table_name, whr, order);

    loan_dtls = {
      suc: loan_dtls.suc,
      loan_dt: loan_dtls.msg[0],
      loan_trans: loan_trans_dt.msg[0],
      msg: true,
    };
  } else {
    loan_dtls = {
      suc: loan_dtls.suc,
      loan_dt: loan_dtls.msg,
      loan_trans: {},
      msg: false,
    };
  }

  res.send(loan_dtls);
});

//checking factor
loanRouter.post("/checking_factor", async (req, res) => {
  try{
    var data = req.body;

    if (!data.period || !data.mode) {
      return res.send({ suc: 0, msg: "Missing period or mode." });
    }

    var select = "*",
    table_name = "md_multiplication_factor",
    whr = "";

    const periodValue = parseFloat(data.period).toFixed(1);
    // console.log(periodValue,'perio');
    

    if (data.mode === "Monthly") {
      whr = `months = ${periodValue}`;
    } else if (data.mode === "Weekly") {
      whr = `weeks = ${periodValue}`;
    } else {
      return res.send({ suc: 0, msg: "Invalid payment mode" });
    }
    order = null;
    // console.log("Checking WHERE clause:", whr);
    var result = await db_Select(select, table_name, whr, order);
    // console.log("DB result:", result);
     
    if (result.suc > 0 && result.msg.length > 0) {
      res.send({ suc: 1, status: true, msg: "Factor exists." });
    } else {
      res.send({ suc: 0, status: false, msg: "Factor not found." });
    }
  }catch(err){
    res.send({ suc: 0, msg:err });
  }
})

// loanRouter.post("/fetch_loan_trans_dtls", async (req, res) => {
//     var data = req.body;

//     var select = "a.payment_date transaction_date, a.payment_id transaction_id, a.tr_type, a.debit, b.member_code, b.grt_form_no form_no, c.client_name",
//     table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.branch_id = b.branch_code AND a.loan_id = b.loan_id LEFT JOIN md_member c ON b.branch_code = c.branch_code AND b.member_code = c.member_code",
//     whr = `a.status = 'U' AND a.tr_type = '${data.tr_type}'`,
//     order = null;
//     var fetch_trans_dt = await db_Select(select,table_name,whr,order);

//     res.send(fetch_trans_dt)
// });

loanRouter.post("/fetch_loan_trans_dtls", async (req, res) => {
  var data = req.body;

  //fetch loan transactions details
  if (data.tr_type == "R") {
    var select =
        "a.payment_date transaction_date,a.payment_id,c.group_name,b.loan_id,b.tot_emi,e.client_name,a.credit amt,if(a.tr_mode='C','Cash','UPI')tr_mode,a.created_by creted_code,d.emp_name created_by,(a.balance+a.od_balance+a.intt_balance) outstanding",
      table_name =
        "td_loan_transactions a JOIN td_loan b ON a.loan_id = b.loan_id JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON a.created_by = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code",
      whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = '${data.tr_type}'`,
      order = null;
    var fetch_trans_dt = await db_Select(select, table_name, whr, order);
  } else {
    var select =
        "a.payment_date transaction_date,a.loan_id, a.payment_id transaction_id, a.tr_type, a.debit, b.member_code, b.grt_form_no form_no, c.client_name",
      table_name =
        "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_member c ON b.member_code = c.member_code",
      whr = `a.branch_id = '${data.branch_code}' AND a.status = 'U' AND a.tr_type = '${data.tr_type}'`,
      order = null;
    var fetch_trans_dt = await db_Select(select, table_name, whr, order);
  }

  res.send(fetch_trans_dt);
});

// loanRouter.post("/fetch_unapprove_loan_dtls", async (req, res) => {
//     var data = req.body;

//     var select = "a.branch_code,a.member_code,a.client_name,b.form_no,DATE_FORMAT(b.grt_date, '%Y-%m-%d') application_date,b.prov_grp_code,DATE_FORMAT(b.approved_at, '%Y-%m-%d') grt_approve_date,c.branch_name,d.group_name,e.applied_amt,e.loan_purpose,e.sub_pupose,f.purpose_id,g.sub_purp_name",
//     table_name = "md_member a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN md_branch c ON a.branch_code = c.branch_code LEFT JOIN md_group d ON b.branch_code = d.branch_code AND b.prov_grp_code = d.group_code LEFT JOIN td_grt_occupation_household e ON a.branch_code = e.branch_code AND b.form_no = e.form_no LEFT JOIN md_purpose f ON e.loan_purpose = f.purp_id LEFT JOIN md_sub_purpose g ON e.sub_pupose = g.sub_purp_id",
//     whr = `a.member_code = ${data.member_code}`,
//     order = null;
//     var member_dtls = await db_Select(select,table_name,whr,order);

//     if(member_dtls.suc > 0 && member_dtls.msg.length > 0){
//         var select = "a.loan_id,a.branch_code,a.group_code,a.member_code,a.grt_form_no,a.purpose,a.sub_purpose,a.applied_amt,a.applied_dt,a.scheme_id,a.fund_id,a.period,a.curr_roi,a.disb_dt,a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.intt_amt,a.prn_emi,a.intt_emi,a.tot_emi,a.period_mode,a.instl_start_dt,a.instl_end_dt,a.last_trn_dt,b.scheme_name,c.fund_name",
//         table_name = "td_loan a LEFT JOIN md_scheme b ON a.scheme_id = b.scheme_id LEFT JOIN md_fund c ON a.fund_id = c.fund_id",
//         whr = `a.grt_form_no = ${member_dtls.msg[0].form_no}`,
//         order = null;
//         var loan_dtls = await db_Select(select,table_name,whr,order);

//         if(loan_dtls.suc > 0 && loan_dtls.msg.length > 0){
//             var select = "payment_date transaction_date, payment_id transaction_id, particulars,debit, bank_charge,proc_charge,balance,tr_type,tr_mode,bank_name,cheque_id,chq_dt,status",
//             table_name = "td_loan_transactions",
//             whr = `loan_id = ${loan_dtls.msg[0].loan_id} AND branch_id = '${loan_dtls.msg[0].branch_code}' AND status = 'U'`,
//             order = null;
//             var loan_trans_dt = await db_Select(select,table_name,whr,order);

//             loan_dtls = {suc: loan_dtls.suc, loan_dt: loan_dtls.msg[0], loan_trans: loan_trans_dt.msg[0], msg: true}
//         }else {
//             loan_dtls = {suc: loan_dtls.suc, loan_dt: loan_dtls.msg, loan_trans: {}, msg: false}
//         }
//     }else {
//         member_dtls = {suc: member_dtls.suc, member_dt: member_dtls.msg,  msg: false}
//     }
//     res.send(member_dtls)
// })

loanRouter.post("/save_loan_transaction", async (req, res) => {
  var data = req.body,
    res_dt;
    // console.log(data,'datatatatat');
    

  //save loan transaction details
  loan_trans(data)
    .then((data) => {
      res_dt = data;
    })
    .catch((err) => {
      res_dt = err;
    })
    .finally(() => {
      res.send(res_dt);
    });
});

//verify total disburse amount greater than applied amount
// loanRouter.post("/verify_tot_dib_amt", async (req, res) => {
//   try{
//   var data = req.body;
//   console.log(data,'lolo');

//   let memberCodes = data.member_code.map(m => m.member_code);
//   let memberCodesStr = memberCodes.join(",");

// var select = "SUM(applied_amt) applied_amt",
// table_name = "td_loan",
// whr = `member_code IN (${memberCodesStr})`,
// order = null;
// var verify_tot_dib_dt = await db_Select(select,table_name,whr,order);

// let appliedAmt = verify_tot_dib_dt.msg[0].applied_amt || 0;
// // console.log(appliedAmt,'apply');

// if (data.tot_disb_amt > appliedAmt) {
//   res.send({ "suc": 0, "msg": "Applied amount is greater than disbursed amount", appliedAmt });
// } else {
//   res.send({ "suc": 1, "msg": "Disburse amount", appliedAmt });
// }
// } catch (error) {
//   console.error("Error:", error);
//   res.send({ "suc": 0, "msg": "Internal server error" });
// }
// });

loanRouter.post("/verify_tot_dib_amt", async (req, res) => {
  try {
    var data = req.body;
    // console.log("Received Data:", data);

    if (!Array.isArray(data.member_code)) {
      return res.send({
        suc: 0,
        msg: "Invalid member_code format. Expected an array.",
      });
    }

    let memberCodes = data.member_code.map((m) => m.member_code);
    let memberCodesStr = memberCodes.map((code) => `'${code}'`).join(",");

    var select = "SUM(applied_amt) applied_amt",
      table_name = "td_loan",
      whr = `member_code IN (${memberCodesStr})`,
      order = null;

    var verify_tot_dib_dt = await db_Select(select, table_name, whr, order);

    let appliedAmt = verify_tot_dib_dt.msg[0].applied_amt || 0;

    if (data.tot_disb_amt > appliedAmt) {
      res.send({
        suc: 0,
        msg: "Applied amount is greater than disbursed amount",
        appliedAmt,
      });
    } else {
      res.send({ suc: 1, msg: "Disburse amount", appliedAmt });
    }
  } catch (error) {
    console.error("Error:", error);
    res.send({ suc: 0, msg: "Internal server error" });
  }
});

loanRouter.post("/fetch_recovery_day", async (req, res) => {
  var data = req.body;

  //fetch recovery day
  var select =
      "a.loan_id,a.grt_form_no,a.member_code,a.recovery_day,b.client_name",
    table_name = "td_loan a , md_member b",
    whr = `a.branch_code = b.branch_code
    AND a.member_code = b.member_code
    AND a.recovery_day between '${data.start_day}' AND '${data.end_day}'`,
    order = null;
  var fetch_rec_dt = await db_Select(select, table_name, whr, order);

  res.send(fetch_rec_dt);
});

// loanRouter.post("/verify_loan_disb", async (req, res) => {
//   try{
//   var data = req.body;

//   var select = "loan_id,member_code",
//   table_name = "td_loan",
//   whr = `branch_code = '${data.branch_code}' AND group_code = '${data.group_code}'`,
//   order = null;
//   var loan_dt = await db_Select(select,table_name,whr,order);

//   if(loan_dt.suc > 0 && loan_dt.msg.length > 0){
//     var data = req.body;

//     var select = "",
//     table_name = "td_loan_transactions",
//     whr = `branch_code = '${data.branch_code}' AND loan_id IN ${loan_dt.msg[0].loan_id} AND tr_type = 'D'`,
//     order = null;
//     var verify_loan_dtls = await db_Select(select,table_name,whr,order);
//   }

//   res.send(verify_loan_dtls)
// } catch (error) {
//   console.error("Error in verify_loan_disb:", error);
//   res.send({ suc: 0, msg: "Internal Server Error" });
// }
// });

loanRouter.post("/approve_loan_disbursement", async (req, res) => {
  var data = req.body;
  const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

  //approve loan disbursement details
  var table_name = "td_loan_transactions",
    fields = `status = 'A', approved_by = '${data.approved_by}', approved_at = '${datetime}'`,
    values = null,
    whr = `loan_id = '${data.loan_id}'`,
    flag = 1;
  var approve_dt = await db_Insert(table_name, fields, values, whr, flag);

  res.send(approve_dt);
});

loanRouter.post("/delete_apply_loan", async (req, res) => {
  var data = req.body;

  //delete apply loan
  var table_name = "td_loan",
    whr = `loan_id = '${data.loan_id}'`;
  var del_loan_dt = await db_Delete(table_name, whr);

  if (del_loan_dt.suc > 0 && del_loan_dt.msg.length > 0) {
    var table_name = "td_loan_transactions",
      whr = `loan_id = '${data.loan_id}'`;
    var del_loan_dtls = await db_Delete(table_name, whr);
  }

  res.send(del_loan_dt);
});

// loanRouter.post("/fetch_grp_member_dtls", async (req, res) => {
//     var data = req.body;

//         var select = "a.branch_code,a.member_code,a.client_name,a.client_mobile,b.form_no,b.prov_grp_code,c.group_name",
//         table_name = "md_member a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN md_group c ON b.branch_code = c.branch_code AND b.prov_grp_code = c.group_code",
//         whr = `b.prov_grp_code like '%${data.grp_dtls}%' OR c.group_name like '%${data.grp_dtls}%'`,
//         order = null;
//         var fetch_grp_mem_dtls = await db_Select(select,table_name,whr,order);

//     res.send(fetch_grp_mem_dtls)
// });

// loanRouter.post("/view_unapprove_recovery_dtls", async (req, res) => {
//         var data = req.body;

//         var select = `a.group_code,a.member_code,a.branch_code,a.scheme_id,a.period,a.curr_roi,a.period_mode,a.fund_id,a.prn_disb_amt disburse_amount,a.recovery_day,a.instl_start_dt,a.instl_end_dt,a.prn_amt principal_amt,a.intt_amt interest_amount,a.outstanding curr_outstanding,a.prn_emi principle_emi_amount,a.intt_emi interest_emi,a.tot_emi total_emi_amount,a.last_trn_dt txn_date,b.payment_id,b.prn_recov principal_recovery, b.intt_recov interest_recovery,b.credit,b.balance,b.tr_type,b.tr_mode,b.bank_name,b.cheque_id,b.chq_dt,b.created_by,b.created_at,b.trn_lat,b.trn_long,b.trn_addr,c.group_name,d.client_name,e.branch_name,f.scheme_name,g.fund_name,h.emp_name created_by,  (
//                 SELECT SUM(i.balance + i.intt_balance)
//                 FROM td_loan_transactions i
//                 WHERE i.tr_type = 'I' AND i.loan_id = a.loan_id
//             ) AS interest_total`,
//         table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.branch_code = b.branch_id AND a.loan_id = b.loan_id LEFT JOIN md_group c ON a.branch_code = c.branch_code AND a.group_code = c.group_code LEFT JOIN md_member d ON a.branch_code = d.branch_code AND a.member_code = d.member_code LEFT JOIN md_branch e ON a.branch_code = e.branch_code LEFT JOIN md_scheme f ON a.scheme_id = f.scheme_id LEFT JOIN md_fund g ON a.fund_id = g.fund_id LEFT JOIN md_employee h ON b.created_by = h.emp_id",
//         whr = `a.loan_id = '${data.loan_id}'
//         AND b.status = 'U' AND b.tr_type = 'R'`,
//         order = null;
//         var recovery_dtls = await db_Select(select,table_name,whr,order);

//     res.send(recovery_dtls)
// });

loanRouter.post("/view_unapprove_recovery_dtls", async (req, res) => {
  var data = req.body;

  // var select = `DATE(a.payment_date) transaction_date,a.trn_addr,a.created_at,a.created_by created_id, c.emp_name created_by`,
  // table_name = "td_loan_transactions a , td_loan b, md_employee c",
  // whr = `a.branch_id = b.branch_code
  // AND a.loan_id = b.loan_id
  // AND a.created_by = c.emp_id
  // AND b.group_code = '${data.group_code}'
  // AND a.status = 'U'
  // AND a.tr_type = 'R'`,
  // order = null;
  // var recovery_dtls = await db_Select(select,table_name,whr,order);

  //view unapprove recovery details
  var select = `a.loan_id,a.member_code,a.prn_amt,a.intt_amt,a.outstanding curr_outstanding,a.prn_emi,a.intt_emi,a.tot_emi,b.client_name,(a.prn_amt+c.prn_recov+a.intt_amt+c.intt_recov) prev_outstanding,c.credit,c.payment_date trn_dt,c.payment_id trn_id,c.created_by created_id,c.created_at, d.emp_name created_by`,
    table_name =
      "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN td_loan_transactions c ON a.loan_id = c.loan_id LEFT JOIN md_employee d ON c.created_by = d.emp_id",
    whr = `c.status = 'U' AND c.tr_type = 'R'  `,
    order = null;
  var recovery_dtls_member = await db_Select(select, table_name, whr, order);

  // recovery_dtls['memb_dtls_recov'] = recovery_dtls_member.suc > 0 ? (recovery_dtls_member.msg.length > 0 ? recovery_dtls_member.msg : []) : [];

  res.send(recovery_dtls_member);
});

loanRouter.post("/approve_recovery_loan", async (req, res) => {
  var data = req.body;
  const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

  //approve loan recovery
  var table_name = "td_loan_transactions",
    fields = `status = 'A', approved_by = '${data.approved_by}', approved_at = '${datetime}'`,
    values = null,
    whr = `payment_id = '${data.payment_id}' AND tr_type != 'D'`,
    flag = 1;
  var approve_dt = await db_Insert(table_name, fields, values, whr, flag);

  res.send(approve_dt);
});

loanRouter.post("/delete_recov_trans", async (req, res) => {
  var data = req.body;
  const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

  //delete recovery transactions
  var select =
      "a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.intt_amt, a.outstanding",
    table_name = "td_loan a",
    whr = `a.loan_id = '${data.loan_id}'`,
    order = null;
  var loan_dt = await db_Select(select, table_name, whr, order);

  var select = "prn_recov, intt_recov",
    table_name = "td_loan_transactions",
    whr = `payment_id = '${data.payment_id}'`,
    order = null;
  var loan_trn_dt = await db_Select(select, table_name, whr, order);

  if (loan_dt.suc > 0 && loan_trn_dt.suc > 0) {
    var prn_amt = loan_dt.msg.length > 0 ? loan_dt.msg[0].prn_amt : 0,
      intt_amt = loan_dt.msg.length > 0 ? loan_dt.msg[0].intt_amt : 0,
      out_amt = loan_dt.msg.length > 0 ? loan_dt.msg[0].outstanding : 0,
      prn_recov = loan_trn_dt.msg.length > 0 ? loan_trn_dt.msg[0].prn_recov : 0,
      intt_recov =
        loan_trn_dt.msg.length > 0 ? loan_trn_dt.msg[0].intt_recov : 0;

    var table_name = "td_loan_transactions",
      whr = `loan_id = '${data.loan_id}' AND tr_type = 'I' AND status = 'U'`;
    var del_recov_dt = await db_Delete(table_name, whr);

    if (del_recov_dt.suc > 0 && del_recov_dt.msg.length > 0) {
      var table_name = "td_loan_transactions",
        whr = `loan_id = '${data.loan_id}' AND tr_type = 'R' AND status = 'U'`;
      var del_recov_dtls = await db_Delete(table_name, whr);
    }
  }

  if (del_recov_dtls.suc > 0 && del_recov_dtls.msg.length > 0) {
    let prn_amount = parseFloat(prn_amt) + parseFloat(prn_recov);
    let intt_amount = parseFloat(intt_amt) + parseFloat(intt_recov);
    let outstanding_amount = parseFloat(prn_amount) + parseFloat(intt_amount);

    var table_name = "td_loan",
      fields = `prn_amt = '${prn_amount}', intt_amt = '${intt_amount}', outstanding = '${outstanding_amount}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'`,
      values = null,
      whr = `loan_id = '${data.loan_id}'`,
      flag = 1;
    var recov_dtls = await db_Insert(table_name, fields, values, whr, flag);
  }

  res.send(recov_dtls);
});

// loanRouter.post("/search_grp_view", async (req, res) => {
//   var data = req.body;

//   //search group for view
//   var select = "group_code,group_name,group_type",
//     table_name = "md_group",
//     whr = `branch_code = '${data.branch_code}' AND (group_name like '%${data.group_name_view}%' OR group_code like '%${data.group_name_view}%')`,
//     order = null;
//   var search_grp_view = await db_Select(select, table_name, whr, order);

//   res.send(search_grp_view);
// });

loanRouter.post("/search_grp_view", async (req, res) => {
  var data = req.body;

  //search group for view
  if (data.branch_code == "100") {
    var select = "branch_code,group_code,group_name,group_type",
      table_name = "md_group",
      whr = `group_name like '%${data.group_name_view}%' OR group_code like '%${data.group_name_view}%'`,
      order = null;
    var search_grp_view = await db_Select(select, table_name, whr, order);
  } else {
    var select = "group_code,group_name,group_type",
      table_name = "md_group",
      whr = `branch_code = '${data.branch_code}' AND (group_name like '%${data.group_name_view}%' OR group_code like '%${data.group_name_view}%')`,
      order = null;
    var search_grp_view = await db_Select(select, table_name, whr, order);
  }
  res.send(search_grp_view);
});

loanRouter.post("/fetch_search_grp_view", async (req, res) => {
  var data = req.body;

   const currDate = new Date().toISOString().split("T")[0];
  // Initialize overdue variables

        let overdue_flag = 'N';
        let overdue_loan_ids = [];
        overdue_count = 0;
        let overdue_amt = 0;

  const overdue_result = await f_getOverdue(data.branch_code, data.group_code, currDate);
  
    if (overdue_result.length > 0) {
      overdue_loan_ids = overdue_result;
      overdue_amt=overdue_result.reduce((sum,acc) => sum + acc.overdue_amount, 0);
      overdue_count=overdue_result.length;
      overdue_flag = 'Y';
      // console.log(overdue_loan_ids,'overdue_loan_ids');
    }


  //fetch search group view details
  var select = "a.*, b.block_name,c.emp_name,d.branch_name brn_name",
    table_name =
      "md_group a LEFT JOIN md_block b ON a.block = b.block_id LEFT JOIN md_employee c ON a.co_id = c.emp_id LEFT JOIN md_branch d ON a.branch_code = d.branch_code",
    whr = data.branch_code == '100' ? `a.group_code = '${data.group_code}'` : `a.group_code = '${data.group_code}' AND a.branch_code = '${data.branch_code}'`,
    order = null;
  var fetch_search_group_view = await db_Select(select, table_name, whr, order);

  //fetch member details on that group
  if (
    fetch_search_group_view.suc > 0 &&
    fetch_search_group_view.msg.length > 0
  ) {
    // var select = `a.loan_id,a.member_code,a.outstanding curr_outstanding,b.client_name`,
    //   table_name =
    //     "td_loan a LEFT JOIN md_member b ON a.branch_code = b.branch_code AND a.member_code = b.member_code",
    //   whr = `a.group_code = '${data.group_code}'`,
    //   order = null;
    // var grp_mem_dtls = await db_Select(select, table_name, whr, order);

    var select = `a.member_code,b.client_name,c.loan_id,(c.prn_amt + c.od_prn_amt + c.intt_amt + c.od_intt_amt) curr_outstanding`,
      table_name =
        "td_grt_basic a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN td_loan c ON a.member_code = c.member_code AND a.prov_grp_code = c.group_code",
      // whr = `a.prov_grp_code = '${data.group_code}' AND c.outstanding > 0`,
      whr = `a.prov_grp_code = '${data.group_code}' 
           AND a.approval_status != 'R'`,
      order = `ORDER BY c.loan_id desc`;
    var grp_mem_dtls = await db_Select(select, table_name, whr, order);

    //outstanding details
    var select = `SUM(outstanding) AS total_outstanding`,
      table_name = "td_loan",
      whr = `group_code = '${data.group_code}'`,
      order = null;
    var total_outstanding_result = await db_Select(
      select,
      table_name,
      whr,
      order
    );

    //fetch disbursement details on that group
    // var select = "a.purpose,b.purpose_id,a.scheme_id,c.scheme_name,a.curr_roi,a.period,a.period_mode,a.fund_id,d.fund_name,SUM(a.applied_amt) applied_amt, SUM(a.prn_disb_amt) disburse_amt,a.disb_dt,(SUM(a.prn_amt) + SUM(a.od_prn_amt) + SUM(a.intt_amt) + SUM(a.od_intt_amt)) curr_outstanding",
    // table_name = "td_loan a LEFT JOIN md_purpose b ON a.purpose = b.purp_id LEFT JOIN md_scheme c ON a.scheme_id = c.scheme_id LEFT JOIN md_fund d ON a.fund_id = d.fund_id",
    // whr = `group_code = '${data.group_code}'`,
    // order = `GROUP BY a.purpose,b.purpose_id,a.scheme_id,c.scheme_name,a.curr_roi,a.period,a.period_mode,a.fund_id,d.fund_name,a.disb_dt`;
    var select =
        "a.loan_id,a.member_code,e.client_name,a.purpose,CONCAT(b.sub_purpose,'-',b.purpose_id)purpose_id,a.scheme_id,c.scheme_name,a.curr_roi,a.recovery_day,a.period,a.period_mode,a.loan_cycle,a.fund_id,d.fund_name,(a.applied_amt) applied_amt,a.disb_dt,(a.prn_disb_amt) disburse_amt,(a.tot_emi)tot_emi,(a.prn_amt + a.od_prn_amt + a.intt_amt) curr_outstanding",
      table_name =
        "td_loan a LEFT JOIN md_purpose b ON a.purpose = b.purp_id LEFT JOIN md_scheme c ON a.scheme_id = c.scheme_id LEFT JOIN md_fund d ON a.fund_id = d.fund_id LEFT JOIN md_member e ON a.member_code = e.member_code",
      whr = `group_code = '${data.group_code}'`,
      order = `ORDER BY a.disb_dt DESC`;
    var disburse_details = await db_Select(select, table_name, whr, order);

    fetch_search_group_view.msg[0]["memb_dt"] =
      grp_mem_dtls.suc > 0 && grp_mem_dtls.msg.length > 0
        ? grp_mem_dtls.msg
        : [];
    fetch_search_group_view.msg[0]["total_outstanding"] =
      total_outstanding_result.suc > 0 &&
      total_outstanding_result.msg.length > 0
        ? total_outstanding_result.msg[0]["total_outstanding"]
        : 0;
    fetch_search_group_view.msg[0]["disb_details"] =
      disburse_details.suc > 0 && disburse_details.msg.length > 0
        ? disburse_details.msg
        : [];
     // Add overdue info
        fetch_search_group_view.msg[0]['overdue_flag'] = overdue_flag;
        fetch_search_group_view.msg[0]['overdue_count'] = overdue_count;
        // fetch_search_group_view.msg[0]['loan_id'] = loan_id;
        fetch_search_group_view.msg[0]['overdue_amt'] = overdue_amt;
        fetch_search_group_view.msg[0]['overdue_loan_ids'] = overdue_loan_ids;
        // fetch_search_group_view.msg[0]['loan_overdue_list'] = overdue_result.loanOverdueList;
        // fetch_search_group_view.msg[0]['overdue_count'] = overdue_count; 
  }

  res.send(fetch_search_group_view);
});

loanRouter.post("/look_overdue_details", async (req, res) => {
 try{
var data = req.body;
const currDate = new Date().toISOString().split("T")[0];
 var select = "*",
 table_name = "td_od_loan",
 whr = `trf_date = (SELECT MAX(trf_date)
                    FROM   td_od_loan
                    WHERE  trf_date <= '${currDate}' 
                    AND    branch_code = '${data.branch_code}')
            AND loan_id IN (${data.loan_id})`,
 order = null;
 var fetch_overdue = await db_Select(select,table_name,whr,order);
 res.send(fetch_overdue)
 } catch (error) {
    console.error("Error fetching overdue loan details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

loanRouter.post("/view_loan_dtls", async (req, res) => {
  var data = req.body;

  //view loan details
  var select =
      "a.loan_id,a.branch_code,a.group_code,g.group_name,a.member_code,b.client_name,a.purpose,CONCAT(c.sub_purpose,'-',c.purpose_id)purpose_id,a.scheme_id,e.scheme_name,a.period_mode,a.fund_id,f.fund_name,a.period,a.curr_roi,a.disb_dt,a.prn_disb_amt,a.intt_cal_amt,a.prn_amt,a.intt_amt,a.outstanding,a.prn_emi,a.intt_emi,a.tot_emi,a.recovery_day",
    table_name =
      "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN md_purpose c ON a.purpose = c.purp_id LEFT JOIN md_scheme e ON a.scheme_id = e.scheme_id LEFT JOIN md_fund f ON a.fund_id = f.fund_id LEFT JOIN md_group g ON a.group_code = g.group_code",
    whr = data.branch_code == '100' ? `a.loan_id = '${data.loan_id}'` : `a.loan_id = '${data.loan_id}' AND a.branch_code = '${data.branch_code}'`,
    order = null;
  var loan_dtls = await db_Select(select, table_name, whr, order);

  if (loan_dtls.suc > 0 && loan_dtls.msg.length > 0) {
    var select =
        "a.payment_date,a.payment_id,a.particulars,a.credit,a.debit,(a.balance + a.od_balance)prn_bal,a.intt_balance,(a.balance + a.od_balance + a.intt_balance)outstanding,a.tr_type,a.tr_mode,a.status,a.approved_by approved_code,a.approved_at,b.emp_name approved_by",
      table_name = "td_loan_transactions a LEFT JOIN md_employee b ON a.approved_by = b.emp_id",
      whr = `loan_id = '${data.loan_id}' AND tr_type != 'I'`,
      // whr = `loan_id = '${data.loan_id}'`,
      order = `ORDER BY payment_id desc,payment_date desc`;

    var transaction_dt = await db_Select(select, table_name, whr, order);

    loan_dtls.msg[0]["trans_dtls"] =
      transaction_dt.suc > 0
        ? transaction_dt.msg.length > 0
          ? transaction_dt.msg
          : []
        : [];
  }

  res.send(loan_dtls);
});

loanRouter.post("/save_loan_details", async (req, res) => {
  var data = req.body,
    res_data;

  //save loan details
  save_loan_dtls(data)
    .then((data) => {
      res_data = data;
    })
    .catch((err) => {
      res_data = err;
    })
    .finally(() => {
      res.send(res_data);
    });
});

loanRouter.post("/change_loan_trans_date", async (req, res) => {
  var data = req.body,
    res_data;

  //save loan details
  loan_trans_date(data)
    .then((data) => {
      res_data = data;
    })
    .catch((err) => {
      res_data = err;
    })
    .finally(() => {
      res.send(res_data);
    });
});

loanRouter.post("/change_recovery_day", async (req, res) => {
  try {
    var data = req.body;
    // console.log(data,'dtdt');

    let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    for (let dt of data.recov_day_dtls) {
      // console.log(dt,'dtttt');

      var table_name = "td_loan",
        fields = `recovery_day = '${data.recovery_day}', modified_by = '${data.modified_by}', modified_dt = '${datetime}'`,
        values = null,
        whr = `loan_id = '${dt.loan_id}'`,
        flag = 1;
      var update_recov_day = await db_Insert(
        table_name,
        fields,
        values,
        whr,
        flag
      );
    }
    res.send({ suc: 1, msg: "Recovery day updated successfully" });
  } catch (error) {
    console.error("Error updating loan recovery day:", error);
    res.send({ suc: 0, msg: "An error occurred" });
  }
});

// fetch unapprove dtls before trns dt
// loanRouter.post("/fetch_unapprove_dtls_before_trns_dt", async (req, res) => {
//   try {
//     var data = req.body;
//     console.log(data,'data');

//     var select = `SUM(unpp_trn) transactions,SUM(unpp_grp)group_migrate,SUM(unpp_memb)member_migrate
//                 FROM (
// 	SELECT COUNT(loan_id)unpp_trn,0 unpp_grp,0 unpp_memb FROM td_loan_transactions
// 	WHERE loan_id IN (SELECT loan_id FROM td_loan WHERE branch_code = '${data.branch_code}')
// 	AND  STATUS = 'U'
// 	AND  payment_date < '${data.transaction_date}'
// 	UNION
// 	SELECT 0 unpp_trn,COUNT(group_code)unpp_grp,0 unpp_memb 
// 	FROM td_co_transfer
// 	WHERE from_brn = '${data.branch_code}'
// 	AND   approval_status = 'U'
// 	AND   DATE(trf_date) < '${data.transaction_date}'
// 	UNION
// 	SELECT 0 unpp_trn,0 unpp_grp,COUNT(member_code)unpp_memb 
// 	FROM td_member_transfer
// 	WHERE from_branch = '${data.branch_code}'
// 	AND   approval_status = 'U'
// 	AND   DATE(mem_trans_date) < '${data.transaction_date}')a`,
     

//     res.send(fetch_unapprove_data_before_trans_date);
//   } catch (error) {
//     console.error(
//       "Error fetch unapprove details before transaction date:",
//       error
//     );
//     res.send({ suc: 0, msg: "An error occurred" });
//   }
// });


loanRouter.post("/fetch_unapprove_dtls_before_trns_dt", async (req, res) => {
  try {
    var data = req.body;
    const branchCode = data.branch_code;
    const transactionDate = data.transaction_date;

    var select = `SUM(unpp_trn) transactions,SUM(unpp_grp)group_migrate,SUM(unpp_memb)member_migrate
      FROM (
        SELECT 
          COUNT(loan_id) AS unpp_trn,
          0 AS unpp_grp,
          0 AS unpp_memb
        FROM td_loan_transactions
        WHERE loan_id IN (
          SELECT loan_id FROM td_loan WHERE branch_code = '${branchCode}'
        )
        AND status = 'U'
        AND payment_date < '${transactionDate}'

        UNION

        SELECT 
          0 AS unpp_trn,
          COUNT(group_code) AS unpp_grp,
          0 AS unpp_memb
        FROM td_co_transfer
        WHERE from_brn = '${branchCode}'
        AND approval_status = 'U'
        AND DATE(trf_date) < '${transactionDate}'

        UNION

        SELECT 
          0 AS unpp_trn,
          0 AS unpp_grp,
          COUNT(member_code) AS unpp_memb
        FROM td_member_transfer
        WHERE from_branch = '${branchCode}'
        AND approval_status = 'U'
        AND DATE(mem_trans_date) < '${transactionDate}'
      ) AS a;
    `,
    table_name = null,
    whr = null,
    order = null;
     var result = await db_Select(select,table_name,whr,order)
    res.send(result);
  } catch (error) {
    console.error("Error fetching unapprove details before transaction date:", error);
    res.send({ suc: 0, msg: "An error occurred" });
  }
});

module.exports = { loanRouter };
