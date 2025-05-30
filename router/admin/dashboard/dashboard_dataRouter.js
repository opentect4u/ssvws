const { db_Select } = require('../../../model/mysqlModel');

const express = require('express'),
dashboard_dataRouter = express.Router(),
dateFormat = require('dateformat');

//date of operation
dashboard_dataRouter.post("/date_of_operation", async (req, res) => {
  try {
    var data = req.body;
    
    var select = "DATE_FORMAT(LAST_DAY(DATE_ADD(closed_upto, INTERVAL 1 MONTH)), '%M %Y') AS date_of_operation",
    table_name = "td_month_close",
    whr = `branch_code = '${data.branch_code}'`,
    order = null;
    var operation_date = await db_Select(select,table_name,whr,order);
    res.send({
      suc : 1,
      data : {
        date_of_operation : operation_date.msg[0].date_of_operation
      }
    })
  }catch(error){
    console.error("Error fetching Date of operation:", error);
    res.send({ suc: 0, msg: error });
  }
});

// Dashboard total grt details today and this month (unapproved,approved,send to mis,rejected)
dashboard_dataRouter.post("/dashboard_tot_grt_details", async (req, res) => {
 try{
   var data = req.body;
  //  console.log(data,'dashboard');

    // Get today date
    const current_date = dateFormat(new Date(), "yyyy-mm-dd");
    // console.log(current_date,'date');

    const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");
    // console.log(startOfMonth,'startOfMonth');
    
    let tot_pending, tot_send_mis, tot_approved, tot_rejected;
 
    if(data.flag == 'Today'){
    // Get data how many unapproved today
    tot_pending = await db_Select("COUNT(*)tot_pending","td_grt_basic",`grt_date = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'U'`,null);
    // Get data how many send to mis today
    tot_send_mis = await db_Select("COUNT(*)tot_send_mis","td_grt_basic",`modified_at = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'S'`,null);
    // Get data how many approved today
    tot_approved = await db_Select("COUNT(*)tot_approved","td_grt_basic",`approved_at = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'A'`,null);
    // Get data how many rejected today
    tot_rejected = await db_Select("COUNT(*)tot_rejected","td_grt_basic",`rejected_at = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'R'`,null);
    }else {

    // Get data how many unapproved this month
    tot_pending = await db_Select("COUNT(*)tot_pending","td_grt_basic",`grt_date BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'U'`,null);
    // console.log(tot_pending,'tot_pending');
    
    // Get data how many send to mis this month
    tot_send_mis = await db_Select("COUNT(*)tot_send_mis","td_grt_basic",`modified_at BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'S'`,null);
    // console.log(tot_send_mis,'tot_send_mis');

    // Get data how many approved this month
    tot_approved = await db_Select("COUNT(*)tot_approved","td_grt_basic",`approved_at BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'A'`,null);
    // Get data how many rejected this month
    tot_rejected = await db_Select("COUNT(*)tot_rejected","td_grt_basic",`rejected_at BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'R'`,null);
    }
    res.send({
      suc: 1,
      data: {
        tot_pending: tot_pending.msg[0].tot_pending || 0,
        tot_send_mis: tot_send_mis.msg[0].tot_send_mis || 0,
        tot_approved: tot_approved.msg[0].tot_approved || 0,
        tot_rejected: tot_rejected.msg[0].tot_rejected || 0
      }
    });
 }catch(error){
    console.error("Error fetching dashboard_details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard total active group details
dashboard_dataRouter.post("/dashboard_active_group", async (req, res) => {
 try{
   var data = req.body;
  //  console.log(data,'grp');
   
   let tot_group,total_group;

    tot_group = await db_Select("COUNT(DISTINCT group_code)tot_active_grp","td_loan",`branch_code IN (${data.branch_code}) AND outstanding > 0`,null);

    total_group = await db_Select("COUNT(*)toal_grp","md_group",`branch_code IN (${data.branch_code}) AND open_close_flag = 'O' AND approval_status = 'A'`,null);
     res.send({
      suc: 1,
      data: {
        tot_active_grp: tot_group.msg[0].tot_active_grp || 0,
        tot_group: total_group.msg[0].toal_grp || 0,
      }
    });
 }catch(error){
    console.error("Error fetching dashboard_active_group:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard total user_logged_in details today
dashboard_dataRouter.post("/dshboard_user_logged_in_details", async (req, res) => {
    try{
      var data = req.body;
      // console.log(data,'data_logged');

      const current_date = dateFormat(new Date(), "yyyy-mm-dd");

      let tot_active_user, active_user_dtls;

      tot_active_user = await db_Select("COUNT(*)tot_active_user","md_user",`brn_code IN (${data.branch_code}) AND user_status = 'A' AND date(created_at) = '${current_date}' AND refresh_token != '' AND session_id != ''`,null);

       var select = "a.emp_id,b.emp_name,a.user_status",
       table_name = "md_user a LEFT JOIN md_employee b ON a.emp_id = b.emp_id",
      whr = `a.brn_code IN (${data.branch_code}) AND a.user_status = 'A' AND date(a.created_at) = '${current_date}' AND a.refresh_token != '' AND a.session_id != ''`,
      order = null;
      active_user_dtls = await db_Select(select,table_name,whr,order);

     res.send({
      suc: 1,
      data: {
        tot_user_active: tot_active_user.msg[0].tot_active_user || 0,
        active_user: active_user_dtls.msg || [],
      }
    });
    }catch(error){
    console.error("Error fetching dshboard_user_logged_in_details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard total loan disbursed and total group disbursed details today and this month
dashboard_dataRouter.post("/dashboard_tot_loan_disbursed_dtls", async (req, res) => {
 try{
  var data = req.body;
  // console.log(data,'data_d_loan');

  const current_date = dateFormat(new Date(), "yyyy-mm-dd");
  const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");
  // console.log(startOfMonth,'startOfMonthda');

  let tot_loan_disbursed,tot_grp_disbursed;

  if(data.flag == 'Today'){
 //total loan disbursed details today
   var select = "SUM(debit)tot_loan_disb",
   table_name = "td_loan_transactions",
   whr = `payment_date = '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'D'`,
   order = null;
  tot_loan_disbursed = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details today
  var select = "COUNT(DISTINCT a.group_code)tot_grp_disb",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'D' AND b.payment_date = '${current_date}'`,
  order = null;
  tot_grp_disbursed = await db_Select(select,table_name,whr,order);
  }else {
//total loan disbursed details this month
   var select = "SUM(debit)tot_loan_disb",
   table_name = "td_loan_transactions",
   whr = `payment_date BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'D'`,
   order = null;
   tot_loan_disbursed = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details this month
  var select = "COUNT(DISTINCT a.group_code)tot_grp_disb",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'D' AND b.payment_date BETWEEN '${startOfMonth}' AND '${current_date}'`,
  order = null;
  tot_grp_disbursed = await db_Select(select,table_name,whr,order);
  }
   res.send({
      suc: 1,
      data: {
        total_loan_disbursed: tot_loan_disbursed.msg[0].tot_loan_disb || 0,
        total_grp_loan_disbursed: tot_grp_disbursed.msg[0].tot_grp_disb || 0,
      }
    });
 }catch(error){
    console.error("Error fetching dshboard total loan disbursed details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard total loan recovery and total group recovery details today and this month
dashboard_dataRouter.post("/dashboard_tot_loan_recov_dtls", async (req, res) => {
 try{
   var data = req.body;
  // console.log(data,'data_r_loan');

  const current_date = dateFormat(new Date(), "yyyy-mm-dd");
  const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");
  // console.log(startOfMonth,'startOfMonthrec');

  let tot_loan_recovery,tot_grp_recovery;

  if(data.flag == 'Today'){
 //total loan disbursed details today
   var select = "SUM(credit)tot_loan_recov",
   table_name = "td_loan_transactions",
   whr = `payment_date = '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'R'`,
   order = null;
  tot_loan_recovery = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details today
  var select = "COUNT(DISTINCT a.group_code)tot_grp_recov",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'R' AND b.payment_date = '${current_date}'`,
  order = null;
  tot_grp_recovery = await db_Select(select,table_name,whr,order);
  }else {
//total loan disbursed details this month
   var select = "SUM(credit)tot_loan_recov",
   table_name = "td_loan_transactions",
   whr = `payment_date BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'R'`,
   order = null;
   tot_loan_recovery = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details this month
  var select = "COUNT(DISTINCT a.group_code)tot_grp_recov",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'R' AND b.payment_date BETWEEN '${startOfMonth}' AND '${current_date}'`,
  order = null;
  tot_grp_recovery = await db_Select(select,table_name,whr,order);
  }
   res.send({
      suc: 1,
      data: {
        total_loan_recovery: tot_loan_recovery.msg[0].tot_loan_recov || 0,
        total_grp_loan_recovery: tot_grp_recovery.msg[0].tot_grp_recov || 0,
      }
    });
 }catch(error){
    console.error("Error fetching dshboard total loan recovery details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard total loan unapprove and total group unapprove details today and this month
dashboard_dataRouter.post("/dashboard_tot_loan_unapprove_dtls", async (req, res) => {
 try{
    var data = req.body;
    // console.log(data,'data_un_loan');

    let tot_loan_unapprove,tot_grp_unapprove;

    //total loan unapprove details today
    var select = "SUM(debit) + SUM(credit)tot_unapprove_loan",
    table_name = "td_loan_transactions",
    whr = `branch_id IN (${data.branch_code}) AND status = 'U' AND tr_type IN('D','R')`,
    order = null;
    tot_loan_unapprove = await db_Select(select,table_name,whr,order);

    //total group loan unapprove details today
    var select = "COUNT(DISTINCT a.group_code)tot_unapprove_grp",
    table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
    whr = `a.branch_code IN (${data.branch_code}) AND b.status = 'U' AND b.tr_type IN('D','R')`,
    order = null;
    tot_grp_unapprove = await db_Select(select,table_name,whr,order);
  
  res.send({
    suc: 1,
    data : {
      total_loan_unapprove: tot_loan_unapprove.msg[0].tot_unapprove_loan || 0,
      total_group_unapprove: tot_grp_unapprove.msg[0].tot_unapprove_grp || 0,
    }
  })
 }catch(error){
    console.error("Error fetching dshboard total loan unapprove details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

/********************************************************************************
 *                                Overdue
 ********************************************************************************/

// Dashboard  total overdue details today and this month for a particular branch
dashboard_dataRouter.post("/dashboard_overdue_dtls", async (req, res) => {
 try{
   var data = req.body;
  console.log(data,'data_overdue');

     const getMonthPrev = await db_Select(
      "closed_upto",
      "td_month_close",
      `branch_code IN (${data.branch_code})`,
      null
    );

    if (!getMonthPrev.msg.length || !getMonthPrev.msg[0].closed_upto) {
    return res.send({ suc: 0, msg: "Previous month data not found" });
}

    const rawDate = new Date(getMonthPrev.msg[0].closed_upto);
    const prev_month = rawDate.toISOString().split('T')[0]; 

    let totalLoanOD = { msg: [{ tot_loan_od: 0, tot_overdue_grp: 0 }] };
    let weeklyLoanOD = { msg: [{ weekly_od: 0, weekly_grp: 0 }] };
    let monthlyLoanOD = { msg: [{ monthly_od: 0, monthly_grp: 0 }] };

     const branchCodes = data.branch_code;

     if (data.flag === 'M') {
      totalLoanOD = await db_Select(
        "IFNULL(SUM(a.od_amt), 0) AS tot_loan_od, COUNT(DISTINCT b.group_code) AS tot_overdue_grp",
        "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id",
        `a.trf_date <= '${prev_month}' AND a.branch_code IN (${branchCodes})`,
        null
      );
    } else if (data.flag === 'W') {
      weeklyLoanOD = await db_Select(
        "IFNULL(SUM(a.od_amt), 0) AS weekly_od, COUNT(DISTINCT b.group_code) AS weekly_grp",
        "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id",
        `a.trf_date <= '${prev_month}' 
          AND a.branch_code IN (${branchCodes}) 
          AND b.period_mode = 'Weekly' 
          AND b.recovery_day = '${data.recov_day}'`,
        null
      );
    } else {
      monthlyLoanOD = await db_Select(
        "IFNULL(SUM(a.od_amt), 0) AS monthly_od, COUNT(DISTINCT b.group_code) AS monthly_grp",
        "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id",
        `a.trf_date <= '${prev_month}' 
          AND a.branch_code IN (${branchCodes}) 
          AND b.period_mode = 'Monthly' 
          AND b.recovery_day = '${data.recov_day}'`,
        null
      );
    }
     res.send({
      suc: 1,
      data: {
        total_loan_od: totalLoanOD.msg[0].tot_loan_od || 0,
        total_overdue_groups: totalLoanOD.msg[0].tot_overdue_grp || 0,
        weekly_loan_od: weeklyLoanOD.msg[0].weekly_od || 0,
        weekly_overdue_groups: weeklyLoanOD.msg[0].weekly_grp || 0,
        monthly_loan_od: monthlyLoanOD.msg[0].monthly_od || 0,
        monthly_overdue_groups: monthlyLoanOD.msg[0].monthly_grp || 0,
      }
    });
 }catch(error){
    console.error("Error fetching dshboard total loan overdue details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

//Dashboard total branch overdue amount calculation (All branches)
// dashboard_dataRouter.post("/dashboard_overdue_amt_fr_allbrn", async (req, res) => {
//   try {
//     var data = req.body;

//     // Initialize result object
//     const result = {
//       total_loan_od: 0,
//       total_overdue_groups: 0,
//       weekly_loan_od: 0,
//       weekly_overdue_groups: 0,
//       monthly_loan_od: 0,
//       monthly_overdue_groups: 0,
//     };

//     // Step 1: Fetch latest trf_date for each branch
//     const fetch_max_trf_date = await db_Select(
//       "MAX(trf_date) trf_date, branch_code",
//       "td_od_loan",
//       null,
//       "GROUP BY branch_code ORDER BY branch_code"
//     );

//     // Map: branch_code => trf_date
//     const branchDateMap = {};
//     for (let row of fetch_max_trf_date.msg) {
//       branchDateMap[row.branch_code] = row.trf_date;
//     }

//     // Step 2: Loop through each branch
//     // for (let branchCode of data.branch_code) {
//     //   const trf_date = dateFormat(branchDateMap[branchCode],'yyyy-MM-dd');
//     //   if (!trf_date) continue; // Skip if no date found for the branch

//       for (let branchCode of data.branch_code) {
//       const rawDate = branchDateMap[branchCode];
//       if (!rawDate) continue;

//       const parsedDate = new Date(rawDate);
//       if (isNaN(parsedDate.getTime())) {
//         console.warn(`Invalid date for branch ${branchCode}:`, rawDate);
//         continue; // skip invalid dates
//       }

//   const trf_date = dateFormat(parsedDate, 'yyyy-MM-dd');
//   // Use trf_date safely now

//       let totalLoanOD = { msg: [{ tot_loan_od: 0, tot_overdue_grp: 0 }] };
//       let weeklyLoanOD = { msg: [{ weekly_od: 0, weekly_grp: 0 }] };
//       let monthlyLoanOD = { msg: [{ monthly_od: 0, monthly_grp: 0 }] };

//       if (data.flag === 'M') {
//         // Fetch total OD for the branch
//         totalLoanOD = await db_Select(
//           "IFNULL(SUM(a.od_amt), 0) AS tot_loan_od, COUNT(DISTINCT b.group_code) AS tot_overdue_grp",
//           "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id",
//           `a.trf_date = '${trf_date}' AND a.branch_code = '${branchCode}'`,
//           null
//         );
//       } else if (data.flag === 'W') {
//         // Fetch weekly OD
//         weeklyLoanOD = await db_Select(
//           "IFNULL(SUM(a.od_amt), 0) AS weekly_od, COUNT(DISTINCT b.group_code) AS weekly_grp",
//           "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id",
//           `a.trf_date = '${trf_date}' AND a.branch_code = '${branchCode}' AND b.period_mode = 'Weekly' AND b.recovery_day = '${data.recov_day}'`,
//           null
//         );
//       } else {
//         // Fetch monthly OD (day-wise)
//         monthlyLoanOD = await db_Select(
//           "IFNULL(SUM(a.od_amt), 0) AS monthly_od, COUNT(DISTINCT b.group_code) AS monthly_grp",
//           "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id",
//           `a.trf_date = '${trf_date}' AND a.branch_code = '${branchCode}' AND b.period_mode = 'Monthly' AND b.recovery_day = '${data.recov_day}'`,
//           null
//         );
//       }

//       // Update result aggregation
//       result.total_loan_od += totalLoanOD.msg[0].tot_loan_od || 0;
//       result.total_overdue_groups += totalLoanOD.msg[0].tot_overdue_grp || 0;

//       result.weekly_loan_od += weeklyLoanOD.msg[0].weekly_od || 0;
//       result.weekly_overdue_groups += weeklyLoanOD.msg[0].weekly_grp || 0;

//       result.monthly_loan_od += monthlyLoanOD.msg[0].monthly_od || 0;
//       result.monthly_overdue_groups += monthlyLoanOD.msg[0].monthly_grp || 0;
//     }

//     // Final response
//     res.send({ suc: 1, data: result });

//   } catch (error) {
//     console.error("Error fetching dashboard all branch total loan overdue details:", error);
//     res.status(500).send({ suc: 0, msg: "An error occurred" });
//   }
// });

// dashboard_dataRouter.post("/dashboard_overdue_amt_fr_allbrn", async (req, res) => {
//   try {
//     const data = req.body;

//     const result = {
//       total_loan_od: 0,
//       total_overdue_groups: 0,
//       weekly_loan_od: 0,
//       weekly_overdue_groups: 0,
//       monthly_loan_od: 0,
//       monthly_overdue_groups: 0,
//     };

//     // Step 1: Fetch latest transfer dates per branch
//     const fetch_max_trf_date = await db_Select(
//       "MAX(trf_date) trf_date, branch_code",
//       "td_od_loan",
//       null,
//       "GROUP BY branch_code ORDER BY branch_code"
//     );
//     // console.log(fetch_max_trf_date);
    
//     const branchDateMap = {};
//     for (let row of fetch_max_trf_date.msg) {
//       branchDateMap[row.branch_code] = row.trf_date;
//     }

//     // console.log("Branch Date Map:", branchDateMap);

//     for (let branchCode of data.branch_code) {
//       let rawDate = branchDateMap[branchCode];
//       // console.log(rawDate,'hyt');
      

// if (!rawDate) {
//   console.warn(`No transfer date found for branch ${branchCode}`);
//   continue;
// }


// const trf_date = dateFormat(rawDate, 'yyyy-mm-dd');
// // console.log(trf_date,'date');

// // console.log(`Processing Branch: ${branchCode}, Transfer Date: ${trf_date}, Flag: ${data.flag}`);



//       if (data.flag === 'M') {
//         // Monthly logic
//         const totalLoanOD = await db_Select(
//           "IFNULL(SUM(a.od_amt), 0) AS tot_loan_od, COUNT(DISTINCT b.group_code) AS tot_overdue_grp",
//           "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id",
//           `a.trf_date = '${trf_date}' AND a.branch_code = '${branchCode}' AND b.period_mode = 'Monthly'`,
//           null
//         );

//         // console.log(`Monthly Result for Branch ${branchCode}:`, totalLoanOD.msg);

//         result.total_loan_od += totalLoanOD.msg[0]?.tot_loan_od || 0;
//         result.total_overdue_groups += totalLoanOD.msg[0]?.tot_overdue_grp || 0;

//       } else if (data.flag === 'W') {
//         // Weekly logic
//         const weeklyLoanOD = await db_Select(
//           "IFNULL(SUM(a.od_amt), 0) AS weekly_od, COUNT(DISTINCT b.group_code) AS weekly_grp",
//           "td_od_loan a LEFT JOIN td_loan b ON a.loan_id = b.loan_id",
//           `a.trf_date = '${trf_date}' AND a.branch_code = '${branchCode}' AND b.period_mode = 'Weekly' AND b.recovery_day = '${data.recov_day}'`,
//           null
//         );

//         // console.log(`Weekly Result for Branch ${branchCode}:`, weeklyLoanOD.msg);

//         result.weekly_loan_od += weeklyLoanOD.msg[0]?.weekly_od || 0;
//         result.weekly_overdue_groups += weeklyLoanOD.msg[0]?.weekly_grp || 0;

//       } else {
//         console.warn("Unrecognized flag value:", data.flag);
//       }
//     }

//     console.log("Final Aggregated Result:", result);
//     res.send({ suc: 1, data: result });

//   } catch (error) {
//     console.error("Error fetching dashboard overdue amounts:", error);
//     res.send({ suc: 0, msg: "An error occurred" });
//   }
// });



//
dashboard_dataRouter.post("/dashboard_generate_dmd", async (req, res) => {
  try {
    var data = req.body;

    const current_date = dateFormat(new Date(), "yyyy-mm-dd");
    const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");


    let results = [];

      const result = await db_Select(null, null, null, null, true, `CALL p_loan_demand('${startOfMonth}', '${current_date}', '${data.branch_code}')`);
      results.push({result });

    return res.json({ message: "Demand data generated successfully.", data: results });

  } catch (error) {
    console.error("Error in dashboard_generate_dmd:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


//Dashboard  total overdue details today and this month
dashboard_dataRouter.post("/dashboard_demand_dtls", async (req, res) => {
  try{
   var data = req.body;

        let totalLoanDmd = { msg: [{ tot_loan_Dmd: 0, tot_demand_grp: 0 }] };
        let weeklyLoanDmd = { msg: [{ weekly_Dmd: 0, weekly_demand_grp: 0 }] };
        let monthlyLoanDmd = { msg: [{ monthly_Dmd: 0, monthly_demand_grp: 0 }] };


      if (data.flag === 'M') {
      totalLoanDmd = await db_Select(
        "IFNULL(SUM(a.dmd_amt), 0) AS tot_loan_Dmd, COUNT(DISTINCT b.group_code) AS tot_demand_grp",
        "tt_loan_demand a LEFT JOIN td_loan b ON a.loan_id = b.loan_id",
        `a.demand_date BETWEEN '${startOfMonth}' AND '${current_date}' AND a.branch_code IN (${data.branch_code})`,
        null
      );
    } else if (data.flag === 'W') {
      weeklyLoanDmd = await db_Select(
        "IFNULL(SUM(a.dmd_amt), 0) AS weekly_Dmd, COUNT(DISTINCT b.group_code) AS weekly_demand_grp",
        "tt_loan_demand a LEFT JOIN td_loan b ON a.loan_id = b.loan_id",
         `a.demand_date BETWEEN '${startOfMonth}' AND '${current_date}' 
          AND a.branch_code IN (${data.branch_code})
          AND b.period_mode = 'Weekly' 
          AND b.recovery_day = '${data.recov_day}'`,
        null
      );
    } else {
      monthlyLoanDmd = await db_Select(
        "IFNULL(SUM(a.dmd_amt), 0) AS monthly_Dmd, COUNT(DISTINCT b.group_code) AS monthly_demand_grp",
        "tt_loan_demand a LEFT JOIN td_loan b ON a.loan_id = b.loan_id",
         `a.demand_date BETWEEN '${startOfMonth}' AND '${current_date}'  
          AND a.branch_code IN (${branchCodes}) 
          AND b.period_mode = 'Monthly' 
          AND b.recovery_day = '${data.recov_day}'`,
        null
      );
    }
    res.send({
  suc: 1,
  data: {
    total_loan_dmd: totalLoanDmd.msg[0].tot_loan_Dmd || 0,
    total_demand_groups: totalLoanDmd.msg[0].tot_demand_grp || 0,

    weekly_loan_dmd: weeklyLoanDmd.msg[0].weekly_Dmd || 0,
    weekly_demand_groups: weeklyLoanDmd.msg[0].weekly_demand_grp || 0,

    monthly_loan_dmd: monthlyLoanDmd.msg[0].monthly_Dmd || 0,
    monthly_demand_groups: monthlyLoanDmd.msg[0].monthly_demand_grp || 0
  }
});

  }catch(error){
    console.error("Error fetching dshboard total loan demand details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

 //dashboard details of particular co
dashboard_dataRouter.post("/co_dashboard_dtls", async (req, res) => {
  try{
   var data = req.body;
  //  console.log(data,'dashboard');

    // Get today date
    const current_date = dateFormat(new Date(), "yyyy-mm-dd");

    const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");
    
    let tot_pending_co, tot_send_mis_co, tot_approved_co, tot_rejected_co;
 
    if(data.flag == 'Today'){
    // Get data how many unapproved today
    tot_pending_co = await db_Select("COUNT(*)tot_pending_co","td_grt_basic",`grt_date = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'U' AND created_by = '${data.emp_id}'`,null);
    // Get data how many send to mis today
    tot_send_mis_co = await db_Select("COUNT(*)tot_send_mis_co","td_grt_basic",`modified_at = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'S'`,null);
    // Get data how many approved today
    tot_approved_co = await db_Select("COUNT(*)tot_approved_co","td_grt_basic",`approved_at = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'A'`,null);
    // Get data how many rejected today
    tot_rejected_co = await db_Select("COUNT(*)tot_rejected_co","td_grt_basic",`rejected_at = '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'R'`,null);
    }else {

    // Get data how many unapproved this month
    tot_pending_co = await db_Select("COUNT(*)tot_pending_co","td_grt_basic",`grt_date BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'U' AND created_by = '${data.emp_id}'`,null);
    // console.log(tot_pending,'tot_pending');
    
    // Get data how many send to mis this month
    tot_send_mis_co = await db_Select("COUNT(*)tot_send_mis_co","td_grt_basic",`modified_at BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'S'`,null);
    // console.log(tot_send_mis,'tot_send_mis');

    // Get data how many approved this month
    tot_approved_co = await db_Select("COUNT(*)tot_approved_co","td_grt_basic",`approved_at BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'A'`,null);
    // Get data how many rejected this month
    tot_rejected_co = await db_Select("COUNT(*)tot_rejected_co","td_grt_basic",`rejected_at BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_code IN (${data.branch_code}) AND approval_status = 'R'`,null);
    }
    res.send({
      suc: 1,
      data: {
        tot_pending_co: tot_pending_co.msg[0].tot_pending_co || 0,
        tot_send_mis_co: tot_send_mis_co.msg[0].tot_send_mis_co || 0,
        tot_approved_co: tot_approved_co.msg[0].tot_approved_co || 0,
        tot_rejected_co: tot_rejected_co.msg[0].tot_rejected_co || 0
      }
    });
 }catch(error){
    console.error("Error fetching co dashboard_details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// dashboard_dataRouter.post("/co_dashboard_dtls_cash_recov", async (req, res) => {
//  try{
//      var data = req.body;
//     //  console.log(data);

//     // Get today date
//     const current_date = dateFormat(new Date(), "yyyy-mm-dd");

//     const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");

//     let co_dashboard_dt_cash;

//      if(data.flag == 'Today'){
//       var select = "SUM(credit) tot_recovery_cash",
//       table_name = "td_loan_transactions",
//       whr = `branch_id = '${data.branch_code}'
//       AND tr_type = 'R'
//       AND tr_mode = '${data.tr_mode}'
//       AND date(payment_date) = '${current_date}'
//       AND created_by = '${data.emp_id}'`,
//       order = null;
//       co_dashboard_dt_cash = await db_Select(select,table_name,whr,order);
//      }else {
//       var select = "SUM(credit) tot_recovery_cash",
//       table_name = "td_loan_transactions",
//       whr = `branch_id = '${data.branch_code}'
//       AND tr_type = 'R'
//       AND tr_mode = '${data.tr_mode}'
//       AND date(payment_date) BETWEEN '${startOfMonth}' AND '${current_date}'
//       AND created_by = '${data.emp_id}'`,
//       order = null;
//       co_dashboard_dt_cash = await db_Select(select,table_name,whr,order);
//      }
//      res.send({
//       suc: 1,
//       data: {
//         co_dashboard_dt_cash: co_dashboard_dt_cash.msg[0].tot_recovery_cash || 0
//       }
//     });
//   }catch(error){
//     console.error("Error fetching co dashboard cash recovery details:", error);
//     res.send({ suc: 0, msg: "An error occurred" });
//   }
// });

// dashboard_dataRouter.post("/co_dashboard_dtls_bank_recov", async (req, res) => {
//  try{
//      var data = req.body;
//      console.log(data);

//     // Get today date
//     const current_date = dateFormat(new Date(), "yyyy-mm-dd");

//     const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");

//     let co_dashboard_dt_bank;

//      if(data.flag == 'Today'){
//       var select = "SUM(credit) tot_recovery_bank",
//       table_name = "td_loan_transactions",
//       whr = `branch_id = '${data.branch_code}'
//       AND tr_type = 'R'
//       AND tr_mode = '${data.tr_mode}'
//       AND date(payment_date) = '${current_date}'
//       AND created_by = '${data.emp_id}'`,
//       order = null;
//       co_dashboard_dt_bank = await db_Select(select,table_name,whr,order);
//      }else {
//       var select = "SUM(credit) tot_recovery_bank",
//       table_name = "td_loan_transactions",
//       whr = `branch_id = '${data.branch_code}'
//       AND tr_type = 'R'
//       AND tr_mode = '${data.tr_mode}'
//       AND date(payment_date) BETWEEN '${startOfMonth}' AND '${current_date}'
//       AND created_by = '${data.emp_id}'`,
//       order = null;
//       co_dashboard_dt_bank = await db_Select(select,table_name,whr,order);
//      }
//      res.send({
//       suc: 1,
//       data: {
//         co_dashboard_dt_bank: co_dashboard_dt_bank.msg[0].tot_recovery_bank || 0
//       }
//     });
//   }catch(error){
//     console.error("Error fetching co dashboard bank recovery details:", error);
//     res.send({ suc: 0, msg: "An error occurred" });
//   }
// });

//co active group
dashboard_dataRouter.post("/co_dashboard_active_group", async (req, res) => {
 try{
   var data = req.body;
  //  console.log(data,'grp');
   
   let co_tot_group,co_tot_grp_active,total_group;

   co_tot_group = await db_Select("COUNT(*) tot_group","md_group",`branch_code = '${data.branch_code}' AND co_id = '${data.co_id}'`,null);

    co_tot_grp_active = await db_Select("COUNT(DISTINCT a.group_code)tot_co_active_grp","td_loan a LEFT JOIN md_group b ON a.group_code = b.group_code",`a.branch_code IN (${data.branch_code}) AND b.co_id = '${data.co_id}' AND a.outstanding > 0`,null);

    total_group = await db_Select("COUNT(*)total_group","md_group",`branch_code IN (${data.branch_code}) AND open_close_flag = 'O' AND approval_status = 'A'`,null);
     res.send({
      suc: 1,
      data: {
        co_total_group: co_tot_group.msg[0].tot_group || 0,
        tot_active_grp: co_tot_grp_active.msg[0].tot_co_active_grp || 0,
        tot_group: total_group.msg[0].total_group || 0,
      }
    });
 }catch(error){
    console.error("Error fetching dashboard_active_group:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard total loan disbursed and total group disbursed details today and this month
dashboard_dataRouter.post("/co_dashboard_tot_loan_disbursed_dtls", async (req, res) => {
 try{
  var data = req.body;
  // console.log(data,'data_d_loan');

  const current_date = dateFormat(new Date(), "yyyy-mm-dd");
  const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");

  let co_tot_loan_disbursed,co_tot_grp_disbursed;

  if(data.flag == 'Today'){
 //total loan disbursed by co details today
   var select = "SUM(debit)co_tot_loan_disb",
   table_name = "td_loan_transactions",
   whr = `payment_date = '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'D' AND created_by = '${data.co_id}'`,
   order = null;
  co_tot_loan_disbursed = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details today
  var select = "COUNT(DISTINCT a.group_code)co_tot_grp_disb",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'D' AND b.payment_date = '${current_date}' AND b.created_by = '${data.co_id}'`,
  order = null;
  co_tot_grp_disbursed = await db_Select(select,table_name,whr,order);
  }else {
//total loan disbursed details this month
   var select = "SUM(debit)co_tot_loan_disb",
   table_name = "td_loan_transactions",
   whr = `payment_date BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'D' AND created_by = '${data.co_id}'`,
   order = null;
   co_tot_loan_disbursed = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details this month
  var select = "COUNT(DISTINCT a.group_code)co_tot_grp_disb",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'D' AND b.payment_date BETWEEN '${startOfMonth}' AND '${current_date}' AND b.created_by = '${data.co_id}'`,
  order = null;
  co_tot_grp_disbursed = await db_Select(select,table_name,whr,order);
  }
   res.send({
      suc: 1,
      data: {
        co_total_loan_disbursed: co_tot_loan_disbursed.msg[0].co_tot_loan_disb || 0,
        co_total_grp_loan_disbursed: co_tot_grp_disbursed.msg[0].co_tot_grp_disb || 0,
      }
    });
 }catch(error){
    console.error("Error fetching co dshboard total loan disbursed details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// Dashboard co total loan recovery and co total group recovery details today and this month
dashboard_dataRouter.post("/co_dashboard_tot_loan_recov_dtls", async (req, res) => {
 try{
   var data = req.body;
  // console.log(data,'data_r_loan');

  const current_date = dateFormat(new Date(), "yyyy-mm-dd");
  const startOfMonth = dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-mm-dd");

  let co_tot_loan_recovery,co_tot_grp_recovery;

  if(data.flag == 'Today'){
 //total loan disbursed details today
   var select = "SUM(credit)tot_loan_recov_co",
   table_name = "td_loan_transactions",
   whr = `payment_date = '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'R' 
          AND created_by = '${data.co_id}'`,
   order = null;
  co_tot_loan_recovery = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details today
  var select = "COUNT(DISTINCT a.group_code)tot_grp_recov_co",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'R' AND b.payment_date = '${current_date}' AND b.created_by = '${data.co_id}'`,
  order = null;
  co_tot_grp_recovery = await db_Select(select,table_name,whr,order);
  }else {
//total loan disbursed details this month
   var select = "SUM(credit)tot_loan_recov_co",
   table_name = "td_loan_transactions",
   whr = `payment_date BETWEEN '${startOfMonth}' AND '${current_date}' AND branch_id IN (${data.branch_code}) AND tr_type = 'R' AND created_by = '${data.co_id}'`,
   order = null;
   co_tot_loan_recovery = await db_Select(select,table_name,whr,order);

  //total group loan disbursed details this month
  var select = "COUNT(DISTINCT a.group_code)tot_grp_recov_co",
  table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
  whr = `a.branch_code IN (${data.branch_code}) AND b.tr_type = 'R' AND b.payment_date BETWEEN '${startOfMonth}' AND '${current_date}' AND b.created_by = '${data.co_id}'`,
  order = null;
  co_tot_grp_recovery = await db_Select(select,table_name,whr,order);
  }
   res.send({
      suc: 1,
      data: {
        co_total_loan_recovery: co_tot_loan_recovery.msg[0].tot_loan_recov_co || 0,
        co_total_grp_loan_recovery: co_tot_grp_recovery.msg[0].tot_grp_recov_co || 0,
      }
    });
 }catch(error){
    console.error("Error fetching co dshboard total loan recovery details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// co Dashboard total loan unapprove and total group unapprove details today and this month
dashboard_dataRouter.post("/co_dashboard_tot_loan_unapprove_dtls", async (req, res) => {
 try{
    var data = req.body;
    // console.log(data,'data_un_loan');

    let co_tot_loan_unapprove,co_tot_grp_unapprove;

    //total loan unapprove details today
    var select = "SUM(debit) + SUM(credit)tot_unapprove_loan_co",
    table_name = "td_loan_transactions",
    whr = `branch_id IN (${data.branch_code}) AND status = 'U' AND tr_type IN('D','R') AND created_by = '${data.co_id}'`,
    order = null;
    co_tot_loan_unapprove = await db_Select(select,table_name,whr,order);

    //total group loan unapprove details today
    var select = "COUNT(DISTINCT a.group_code)tot_unapprove_grp_co",
    table_name = "td_loan a LEFT JOIN td_loan_transactions b ON a.loan_id = b.loan_id",
    whr = `a.branch_code IN (${data.branch_code}) AND b.status = 'U' AND b.tr_type IN('D','R') AND b.created_by = ${data.co_id}`,
    order = null;
    co_tot_grp_unapprove = await db_Select(select,table_name,whr,order);
  
  res.send({
    suc: 1,
    data : {
      co_total_loan_unapprove: co_tot_loan_unapprove.msg[0].tot_unapprove_loan_co || 0,
      co_total_group_unapprove: co_tot_grp_unapprove.msg[0].tot_unapprove_grp_co || 0,
    }
  })
 }catch(error){
    console.error("Error fetching co dshboard total loan unapprove details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});

// co Dashboard total user_logged_in details today
dashboard_dataRouter.post("/co_dashboard_user_logged_in_details", async (req, res) => {
    try{
      var data = req.body;
      // console.log(data,'data_logged');

      const current_date = dateFormat(new Date(), "yyyy-mm-dd");

      let co_tot_active_user, co_active_user_dtls;

      co_tot_active_user = await db_Select("COUNT(*)co_tot_active_user","md_user",`brn_code IN (${data.branch_code}) AND user_status = 'A' AND date(created_at) = '${current_date}' AND refresh_token != '' AND session_id != '' AND emp_id = '${data.co_id}'`,null);

       var select = "a.emp_id,b.emp_name,a.user_status",
       table_name = "md_user a LEFT JOIN md_employee b ON a.emp_id = b.emp_id",
      whr = `a.brn_code IN (${data.branch_code}) AND a.user_status = 'A' AND date(a.created_at) = '${current_date}' AND a.refresh_token != '' AND a.session_id != '' AND a.emp_id = '${data.co_id}'`,
      order = null;
      co_active_user_dtls = await db_Select(select,table_name,whr,order);

     res.send({
      suc: 1,
      data: {
        co_tot_user_active: co_tot_active_user.msg[0].co_tot_active_user || 0,
        co_active_user: co_active_user_dtls.msg || [],
      }
    });
    }catch(error){
    console.error("Error fetching dshboard_user_logged_in_details:", error);
    res.send({ suc: 0, msg: "An error occurred" });
 }
});



module.exports = {dashboard_dataRouter}