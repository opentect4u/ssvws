const { db_Select, db_Insert } = require("../../model/mysqlModel"),
  dateFormat = require("dateformat");

const getFormNo = () => {
  return new Promise(async (resolve, reject) => {
    year = new Date().getFullYear();

    var select =
        "IF(MAX(SUBSTRING(form_no, -5)) > 0, LPAD(MAX(cast(SUBSTRING(form_no, -5) as unsigned))+1, 5, '0'), '000001') max_form",
      table_name = "td_grt_basic",
      whr = `SUBSTRING(form_no, 1, 4) = YEAR(now())`,
      order = null;
    var res_dt = await db_Select(select, table_name, whr, order);
    var newId = `${year}${res_dt.msg[0].max_form}`;
    resolve(newId);
  });
};

// const groupCode = () => {
//   return new Promise(async (resolve, reject) => {

//       var select = "IF(COUNT(group_code) > 0, MAX(group_code)+1, 1) group_code",
//       table_name = "md_group",
//       whr = null,
//       order = null;
//       var res_dt = await db_Select(select, table_name, whr, order);
//     resolve(res_dt);
//   });
// };

// const getMemberCode = () => {
//   return new Promise(async (resolve, reject) => {

//       var select = "IF(COUNT(member_code) > 0, MAX(member_code)+1, 1) member_code",
//       table_name = "td_grt_basic",
//       whr = null,
//       order = null;
//       var res_dt = await db_Select(select, table_name, whr, order);
//     resolve(res_dt);
//   });
// };

const groupCode = (branch_code) => {
  return new Promise(async (resolve, reject) => {
    var select =
        "COALESCE(MAX(CAST(SUBSTR(group_code, 4) AS UNSIGNED)), 0) + 1 AS group_code",
      table_name = "md_group",
      whr = null,
      order = null;
    var res_dt = await db_Select(select, table_name, whr, order);

    let newGroupCode = res_dt.msg[0].group_code;
    let groupCode = `${branch_code}` + newGroupCode;

    // let newGroupCode = res_dt.msg.length > 0 && res_dt.msg[0].group_code ? res_dt.msg[0].group_code : "01";
    // // let groupCode = `${branch_code}` + newGroupCode;
    // let groupCode = `${branch_code}${String(newGroupCode).padStart(2, "0")}`;

    resolve(groupCode);
  });
};

// const groupCode = (branch_code) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       var select = "COALESCE(MAX(CAST(SUBSTR(group_code, 4) AS UNSIGNED)), 0) + 1 AS group_code";
//       var table_name = "md_group";
//       var whr = null;
//       var order = null;

//       var res_dt = await db_Select(select, table_name, whr, order);

//       // console.log("Database Response:", res_dt); // Debugging output

//       let newGroupCode = res_dt.msg.length > 0 && res_dt.msg[0].group_code ? res_dt.msg[0].group_code : "01";
//       let groupCode = `${branch_code}${String(newGroupCode).padStart(2, "0")}`;

//       // console.log("Generated Group Code:", groupCode); // Debugging output

//       resolve(groupCode);
//     } catch (error) {
//       console.error("Error generating group code:", error);
//       reject(error);
//     }
//   });
// };

const getMemberCode = (branch_code) => {
  return new Promise(async (resolve, reject) => {
    var select =
        "COALESCE(MAX(CAST(SUBSTR(member_code, 4) AS UNSIGNED)), 0) + 1 AS member_code",
      table_name = "md_member",
      whr = null,
      order = null;
    var res_dt = await db_Select(select, table_name, whr, order);

    let newMemberCode = res_dt.msg[0].member_code;
    let memberCode = `${branch_code}` + newMemberCode;
    // console.log(memberCode,'code');

    resolve(memberCode);
  });
};

// const getMemberCode = (branch_code) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       var select = "COALESCE(MAX(CAST(SUBSTR(member_code, 3) AS UNSIGNED)), 0) + 1 AS member_code";
//       var table_name = "md_member";
//       var whr = null;
//       var order = null;

//       var res_dt = await db_Select(select, table_name, whr, order);

//       // console.log("Database Response:", res_dt); // Debugging output

//       let newMemberCode = res_dt.msg.length > 0 && res_dt.msg[0].member_code ? res_dt.msg[0].member_code : "01";
//       let memberCode = `${branch_code}${String(newMemberCode).padStart(2, "0")}`;

//       // console.log("Generated Member Code:", memberCode); // Debugging output

//       resolve(memberCode);
//     } catch (error) {
//       console.error("Error generating member code:", error);
//       reject(error);
//     }
//   });
// };

// const getLoanCode = (branch_code) => {
//   return new Promise(async (resolve, reject) => {

//       var select = "max(substr(loan_id,3)) + 1 loan_code",
//       table_name = "td_loan",
//       whr = null,
//       order = null;
//       var res_dt = await db_Select(select, table_name, whr, order);

//       let newLoanCode = res_dt.msg[0].loan_code;
//       let loanCode = `${branch_code}` + newLoanCode;
//       // console.log(loanCode,'code');

//     resolve(loanCode);
//   });
// };

const getLoanCode = (branch_code) => {
  return new Promise(async (resolve, reject) => {
    try {
      var select =
        "COALESCE(MAX(CAST(SUBSTR(loan_id, 4) AS UNSIGNED)), 0) + 1 AS loan_code";
      var table_name = "td_loan";
      var whr = null;
      var order = null;

      var res_dt = await db_Select(select, table_name, whr, order);

      // console.log("Database Response:", res_dt); // Debugging output

      // let newLoanCode = res_dt.msg.length > 0 && res_dt.msg[0].loan_code ? res_dt.msg[0].loan_code : "01";
      // let loanCode = `${branch_code}${String(newLoanCode).padStart(2, "0")}`;

      let newLoanCode = res_dt.msg[0].loan_code;
      let loanCode = `${branch_code}` + newLoanCode;

      // console.log("Generated Loan Code:", loanCode); // Debugging output

      resolve(loanCode);
    } catch (error) {
      console.error("Error generating loan code:", error);
      reject(error);
    }
  });
};

// const payment_code = (branch_code, trn_dt = null) => {
//   return new Promise(async (resolve, reject) => {
//       year = new Date().getFullYear();

//       var select = "IF(MAX(SUBSTRING(payment_id, 8)) > 0, MAX(cast(SUBSTRING(payment_id, 8) as unsigned))+1, 1) max_pay_id",
//       table_name = "td_loan_transactions",
//       whr = `YEAR(payment_date) = ${trn_dt ? `YEAR('${dateFormat(trn_dt, "yyyy-mm-dd")}')` : 'YEAR(NOW())'}`,
//       order = null;
//       var pay_dt = await db_Select(select,table_name,whr,order);
//       // consolxe.log(pay_dt,'pay_dt');

//       let newPayCode = pay_dt.msg[0].max_pay_id;
//       // console.log(newPayCode,'paycode');

//       var newPayId = `${year}` + `${branch_code}` + newPayCode
//     resolve(newPayId);
//   });
// };

// const getBankCode = () => {
//   return new Promise(async (resolve, reject) => {

//       var select = "max(bank_code) + 1 as bank_code",
//           table_name = "md_bank",
//           whr = null,
//           order = null;
//       var result = await db_Select(select, table_name, whr, order);

//       let newBankCode = result.msg[0].bank_code;

//       resolve(newBankCode)
//   });
// };

const getDistCode = () => {
  return new Promise(async (resolve, reject) => {

      var select = "max(dist_id) + 1 as dist_code",
          table_name = "md_district",
          whr = null,
          order = null;
      var result = await db_Select(select, table_name, whr, order);

      let newDistCode = result.msg[0].dist_code;

      resolve(newDistCode)
  });
};

const getBlockCode = () => {
  return new Promise(async (resolve, reject) => {

      var select = "max(block_id) + 1 as block_code",
          table_name = "md_block",
          whr = null,
          order = null;
      var result = await db_Select(select, table_name, whr, order);

      let newBlockCode = result.msg[0].block_code;

      resolve(newBlockCode)
  });
};

const getPurposeCode = () => {
  return new Promise(async (resolve, reject) => {

      var select = "max(purp_id) + 1 as purp_code",
          table_name = "md_purpose",
          whr = null,
          order = null;
      var result = await db_Select(select, table_name, whr, order);

      let newPurpCode = result.msg[0].purp_code;

      resolve(newPurpCode)
  });
};

const getFundCode = () => {
  return new Promise(async (resolve, reject) => {

      var select = "max(fund_id) + 1 as fund_code",
          table_name = "md_fund",
          whr = null,
          order = null;
      var result = await db_Select(select, table_name, whr, order);

      let newfundCode = result.msg[0].fund_code;

      resolve(newfundCode)
  });
};

const getSchemeCode = () => {
  return new Promise(async (resolve, reject) => {

      var select = "max(scheme_id) + 1 as scheme_code",
          table_name = "md_scheme",
          whr = null,
          order = null;
      var result = await db_Select(select, table_name, whr, order);

      let newschemeCode = result.msg[0].scheme_code;

      resolve(newschemeCode)
  });
};

const getBankCode = () => {
  return new Promise(async (resolve, reject) => {
    var select = "max(bank_code) as max_bank_code",
      table_name = "md_bank",
      whr = null,
      order = null;
    try {
      var result = await db_Select(select, table_name, whr, order);

      let newBankCode = result.msg[0].max_bank_code
        ? parseInt(result.msg[0].max_bank_code) + 1
        : 1001;

      resolve(newBankCode);
    } catch (error) {
      reject(error);
    }
  });
};

const payment_code = () => {
  return new Promise(async (resolve, reject) => {
    const timestamp = new Date().getTime();
    const newPayId = `${timestamp}`;

    resolve(newPayId);
  });
};

// const interest_cal_amt = (principal, rate, time) => {
//   return new Promise((resolve, reject) => {
//       let interest;

//         interest = ((principal * rate / 100) / 12) * time;
//         console.log(interest);

//       resolve(interest);
//   });
// };

//  const periodMode = () => {
//   return new Promise((resolve, reject) => {
//     var modes_period = [
//         {
//             id: "Monthly",
//             name: "12"
//         },
//         {
//             id: "Weekly",
//             name: "48"
//         },
//     ]
//     resolve(modes_period)
//   });
//    };
const periodic = [
  {
    id: "Monthly",
    name: "month",
    div_period: 1,
    tot_period: 12,
  },
  {
    id: "Weekly",
    name: "week",
    div_period: 1,
    tot_period: 48,
  },
];

const interest_cal_amt = async (principal, time, rate, period_mode) => {
  try {
    const period = periodic.filter((p) => p.id == period_mode);

    const periodValue = period[0].tot_period;
    const interest = ((principal * rate) / 100 / periodValue) * time;

    // console.log(interest);
    return Math.round(interest);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

const calculate_prn_emi = (principal, period) => {
  return new Promise((resolve, reject) => {
    let emi_prn;

    emi_prn = principal / period;
    // console.log(emi_prn.toFixed(2));

    //  resolve(emi_prn.toFixed(2));
    resolve(Math.round(emi_prn));
  });
};

const calculate_intt_emi = (interest, period) => {
  return new Promise((resolve, reject) => {
    let emi_intt;

    emi_intt = interest / period;
    // console.log(emi_intt.toFixed(2));

    //  resolve(emi_intt.toFixed(2));
    resolve(Math.round(emi_intt));
  });
};

// const total_emi = (principal, interest, period) => {
//   return new Promise((resolve, reject) => {
//     let emi;

//     emi = (interest / period) + (principal / period);
//     console.log(emi);

//      resolve(emi);
//   });
// };

// const  periodic = () => {
//   return new Promise((resolve, reject) => {
//     var modes_periodic = [
//         {
//             id: "Monthly",
//             name: "month"
//         },
//         {
//             id: "Weekly",
//             name: "week"
//         },
//     ]
//     resolve(modes_periodic)
//   });
//    };

const installment_end_date = async (startDate, period, periodModeId) => {
  try {
    const modes_periodic = periodic;

    const selectedMode = modes_periodic.find(
      (mode) => mode.id === periodModeId
    );

    const periodmode = selectedMode.name;

    const end_date_query = `SELECT DATE_ADD('${startDate}', INTERVAL ${period} ${periodmode}) AS endDate`;
    return end_date_query;
  } catch (error) {
    throw new Error("Error calculating installment end date: " + error.message);
  }
};

//   const installment_end_date = (startDate,period,periodmode) => {
//     return new Promise((resolve, reject) => {
//         try {
//             const end_date = `SELECT DATE_ADD('${startDate}', INTERVAL '${period}' '${periodmode}' ) AS endDate`;
//             resolve(end_date);
//         } catch (error) {
//             reject("Error calculating installment end date");
//         }
//     });
// };

var dayRevarseList = {
  Sunday: 1,
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
  Saturday: 7,
};

const genDate = (period, mode, emiDate, selDay) => {
  return new Promise((resolve, reject) => {
    const dateFormat = require("dateformat");
    var currDate = new Date();
    // user input //
    // var period = 48, mode = 'W', emiDate = 15, selDay = 2;
    // end //
    // OUTPUT //
    var emiStartDate = "",
      emiEndDate = "";
    // END //

    var dayList = {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday",
    };

    switch (mode) {
      case "Monthly":
        var modDt = new Date(
          currDate.setMonth(currDate.getMonth() + 1 + period)
        );
        emiEndDate = new Date(modDt.getFullYear(), modDt.getMonth(), emiDate);
        var modStDt = new Date();
        modStDt.setMonth(modStDt.getMonth() + 1);
        emiStartDate = new Date(
          modStDt.getFullYear(),
          modStDt.getMonth(),
          emiDate
        );
        break;
      case "Weekly":
        var emiEndDate = new Date(
          currDate.setDate(currDate.getDate() + period * 7)
        );

        for (
          let i = emiEndDate.getDate();
          i <
          new Date(
            emiEndDate.getFullYear(),
            emiEndDate.getMonth(),
            0
          ).getDate();
          i++
        ) {
          var selectedMon = dayList[selDay];
          if (selectedMon == dateFormat(new Date(emiEndDate), "dddd")) {
            break;
          }
          emiEndDate.setDate(emiEndDate.getDate() + 1);
        }

        var modStDt = new Date();
        var selDayNum = dayRevarseList[dateFormat(new Date(modStDt), "dddd")];
        emiStartDate = new Date(
          modStDt.setDate(modStDt.getDate() + (7 - selDayNum))
        );

        for (
          let i = emiStartDate.getDate();
          i <
          new Date(
            emiStartDate.getFullYear(),
            emiStartDate.getMonth(),
            0
          ).getDate();
          i++
        ) {
          var selectedMon = dayList[selDay];
          if (selectedMon == dateFormat(new Date(emiStartDate), "dddd")) {
            break;
          }
          emiStartDate.setDate(emiStartDate.getDate() + 1);
        }
        break;
      default:
        emiStartDate = new Date();
        emiEndDate = new Date();
        break;
    }

    // console.log(dateFormat(new Date(emiStartDate), 'dd/mm/yyyy'), dateFormat(new Date(emiEndDate), 'dd/mm/yyyy'));
    resolve({ emtStart: emiStartDate, emiEnd: emiEndDate });
  });
};

// const getMonthDiff = (loan_id,DATE) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       var select = `period,disb_dt,prn_disb_amt,intt_cal_amt,outstanding,tot_emi,instl_start_dt,instl_end_dt,recovery_day,period_mode`,
//        table_name = "td_loan",
//        whr = `loan_id = '12072049'`,
//        order = null;
//       var get_data = await db_Select(select, table_name, whr, order);
//       console.log(get_data,'lo');

//         // var dateOnly = get_dt.msg[0].instl_start_dt;
//         // var instlStartDate = new Date(dateOnly).toISOString().split('T')[0];
//         // console.log(instlStartDate,'instlStartDate');

//         if(get_data.suc > 0 && get_data.msg.length > 0){
//           if(get_data.period_mode == 'Monthly'){

//             var day = `SELECT DAY("2024-06-24")`
//             var month = `SELECT EXTRACT(MONTH FROM "2024-06-24")`;
//             var year = `SELECT EXTRACT(year FROM "2024-06-24")`;
//             console.log(day,month,year,'dmy');

//             var get_date = (year)-(month)-(day)
//             console.log(get_date,'get_date');

//           }else {
//             console.log()
//           }
//         }

//       resolve(get_date);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

const getLoanDmd = (loan_id, DATE) => {
  // console.log(loan_id,DATE,'DATE');

  return new Promise(async (resolve, reject) => {
    try {
      var select = `period, disb_dt, prn_disb_amt, intt_cal_amt, outstanding, tot_emi, instl_start_dt, instl_end_dt, recovery_day, period_mode`,
        table_name = "td_loan",
        whr = `loan_id = '${loan_id}'`,
        order = null;

      var get_data = await db_Select(select, table_name, whr, order);
      //  console.log(get_data,'ok');

      if (get_data.suc > 0 && get_data.msg.length > 0) {
        var instl_st_dt = get_data.msg[0].instl_start_dt;
        var instl_end_dt = get_data.msg[0].instl_end_dt;
        end_dt = `${dateFormat(instl_end_dt, "yyyy-mm-dd")}`;
        // console.log(instl_end_dt,end_dt,'instl_end_dt');

        var tot_emi = get_data.msg[0].tot_emi;
        var outstanding = get_data.msg[0].outstanding;

        var ld_demand = 0;

        if (outstanding == 0) {
          ld_demand = 0;
        } else {
          if (DATE > end_dt) {
            // console.log(DATE > instl_end_dt,'test');

            ld_demand = outstanding;

            //  console.log(ld_demand,'ld_demand_dt');
          } else {
            /* var dayQuery = `EXTRACT(DAY FROM '${dateFormat(instl_st_dt, "yyyy-mm-dd")}') AS day`;
          var monthQuery = `EXTRACT(MONTH FROM '${dateFormat(DATE, "yyyy-mm-dd")}') AS month`;
          var yearQuery = `EXTRACT(YEAR FROM '${dateFormat(DATE, "yyyy-mm-dd")}') AS year`;
          
          var dayResult = await db_Select(dayQuery);
          var monthResult = await db_Select(monthQuery);
          var yearResult = await db_Select(yearQuery);
          
          console.log(dayResult, monthResult, yearResult, 'dmy');
          
         var day = dayResult.msg[0].day;  
         var month = monthResult.msg[0].month; 
         var year = yearResult.msg[0].year;  */

            //var create_date = `${year}-${month}-${day}`;

            var create_date = DATE;

            //  console.log("Created date:", create_date);

            if (get_data.msg[0].period_mode === "Monthly") {
              var date_diff = `CEIL(DATEDIFF('${dateFormat(
                create_date,
                "yyyy-mm-dd"
              )}', '${dateFormat(
                instl_st_dt,
                "yyyy-mm-dd"
              )}') / 30)+1 AS date_diff`;
            } else {
              var date_diff = `CEIL(DATEDIFF('${dateFormat(
                create_date,
                "yyyy-mm-dd"
              )}', '${dateFormat(
                instl_st_dt,
                "yyyy-mm-dd"
              )}') / 7)+1 AS date_diff`;
            }

            var date_diffs = await db_Select(date_diff);
            //  console.log(date_diffs);

            var ld_actual_amt = date_diffs.msg[0].date_diff * tot_emi;
            //  console.log(ld_actual_amt);

            var select = "SUM(credit) credit",
              table_name = "td_loan_transactions",
              whr = `loan_id ='${loan_id}' AND tr_type = 'R' AND payment_date <= '${dateFormat(
                create_date,
                "yyyy-mm-dd"
              )}'`,
              order = null;
            var ld_paid_amt = await db_Select(select, table_name, whr, order);
            //  console.log(ld_paid_amt);

            ld_demand =
              parseFloat(ld_actual_amt) - parseFloat(ld_paid_amt.msg[0].credit);
            ld_demand = Math.max(0, ld_demand);
            //  console.log(ld_demand,'ld');
          }
        }
        // console.log(ld_demand,'dd');

        if (ld_demand <= 0) {
          ld_demand = 0;
        } else {
          ld_demand = ld_demand;
        }
        resolve({ suc: 1, demand: { ld_demand } });
      } else {
        console.log("No data found");
        resolve(null);
      }
    } catch (error) {
      console.error("Error calculating month difference:", error);
      reject(error);
    }
  });
};

/**Function to get Loan Balance against a particular date */
/**Function used in Loan demand report, */
const getLoanBal = (loan_id, to_dt,ret_pram) => {
  // console.log(loan_id,to_dt,'lolo');
  
  return new Promise(async (resolve, reject) => {
    try {
      var res_dt = 0;

      var select = "max(payment_date) payment_date",
        table_name = "td_loan_transactions",
        whr = `loan_id = '${loan_id}' AND tr_type != 'I' AND date(payment_date) <= '${to_dt}'`,
        order = null;

      var pay_data = await db_Select(select, table_name, whr, order);
      // console.log(to_dt,'ppp');
      
      if (pay_data.suc > 0 && pay_data.msg.length > 0) {
        var latestPaymentDate = pay_data.msg[0].payment_date;
        // console.log(latestPaymentDate,"latestPaymentDate");

        var select = "max(payment_id) payment_id",
          table_name = "td_loan_transactions",
          whr = `loan_id = '${loan_id}' AND tr_type != 'I' AND payment_date = '${dateFormat(
            latestPaymentDate,
            "yyyy-mm-dd"
          )}'`,
          order = null;

        var pay_id = await db_Select(select, table_name, whr, order);
        // console.log(dateFormat(
        //   latestPaymentDate,
        //   "yyyy-mm-dd"),'lili');
        
        if (pay_id.suc > 0 && pay_id.msg.length > 0) {
          let latestPaymentId = pay_id.msg[0].payment_id;
          // console.log(latestPaymentId,'lastpaymentid');
          
          
          if (ret_pram === 'O') {
            select = "(balance + od_balance + intt_balance) balance";
          } else if (ret_pram === 'P') {
            select = "(balance + od_balance) prn_amt"; 
          } else {
            select = "(intt_balance) intt_amt";
          }

          whr = `loan_id = '${loan_id}' AND payment_date = '${dateFormat(
            latestPaymentDate,
            "yyyy-mm-dd"
          )}' AND payment_id = '${latestPaymentId}'`,
          order = null;
          var balance = await db_Select(select, table_name, whr, order);

        if (balance && balance.suc > 0 && balance.msg.length > 0) {
          resolve(balance.msg[0]);
        } else {
          resolve({ message: "Balance data not found" });
        }
      } else {
        resolve({ message: "Payment ID not found" });
      }
      } else {
        resolve("balance not found", res_dt);
      }
    } catch (error) {
      console.error("Error calculating balance:", error);
      reject(error);
    }
  });
};

const loan_balance_outstanding = (loan_id, os_dt) => {
  // console.log(loan_id,os_dt);

  return new Promise(async (resolve, reject) => {
    try {
      // Fetch the most recent repayment balance
      var select = "balance",
        table_name = "td_loan_transactions",
        whr = `
          loan_id = '${loan_id}' AND tr_type = 'R' 
          AND payment_date = (
            SELECT MAX(payment_date)
            FROM td_loan_transactions
            WHERE loan_id = '${loan_id}' 
              AND payment_date <= '${os_dt}'
              AND tr_type = 'R'
          )`;
      var transactionDetails = await db_Select(select, table_name, whr);
      // console.log(transactionDetails,'trans');

      if (transactionDetails.suc > 0 && transactionDetails.msg.length > 0) {
        var balance = transactionDetails.msg[0].balance || 0;
        // console.log(balance,'bal');

        resolve({ suc: 1, balance_dt: { balance } });
      } else {
        // console.log("No transactions found for the given date.");
        resolve(null);
      }
    } catch (error) {
      console.error("Error fetching loan balance outstanding:", error);
      reject(error);
    }
  });
};

const loan_od_balance_outstanding = (loan_id, os_dt) => {
  // console.log(loan_id,os_dt);

  return new Promise(async (resolve, reject) => {
    try {
      // Fetch the most recent repayment balance
      var select = "od_balance",
        table_name = "td_loan_transactions",
        whr = `
          loan_id = '${loan_id}' AND tr_type = 'R' 
          AND payment_date = (
            SELECT MAX(payment_date)
            FROM td_loan_transactions
            WHERE loan_id = '${loan_id}' 
              AND payment_date <= '${os_dt}'
              AND tr_type = 'R'
          )`;
      var od_transactionDetails = await db_Select(select, table_name, whr);
      // console.log(od_transactionDetails,'trans');

      if (
        od_transactionDetails.suc > 0 &&
        od_transactionDetails.msg.length > 0
      ) {
        var od_balance = od_transactionDetails.msg[0].od_balance || 0;
        // console.log(od_balance,'bal');

        resolve({ suc: 1, od_balance_dt: { od_balance } });
      } else {
        // console.log("No transactions found for the given date.");
        resolve(null);
      }
    } catch (error) {
      console.error("Error fetching loan balance outstanding:", error);
      reject(error);
    }
  });
};

const loan_intt_balance_outstanding = (loan_id, os_dt) => {
  // console.log(loan_id,os_dt);

  return new Promise(async (resolve, reject) => {
    try {
      // Fetch the most recent repayment balance
      var select = "intt_balance",
        table_name = "td_loan_transactions",
        whr = `
          loan_id = '${loan_id}' AND tr_type = 'R' 
          AND payment_date = (
            SELECT MAX(payment_date)
            FROM td_loan_transactions
            WHERE loan_id = '${loan_id}'
              AND payment_date <= '${os_dt}'
              AND tr_type = 'R'
          )`;
      var intt_transactionDetails = await db_Select(select, table_name, whr);
      // console.log(intt_transactionDetails,'trans');

      if (
        intt_transactionDetails.suc > 0 &&
        intt_transactionDetails.msg.length > 0
      ) {
        var intt_balance = intt_transactionDetails.msg[0].intt_balance || 0;
        // console.log(intt_balance,'bal');

        resolve({ suc: 1, intt_balance_dt: { intt_balance } });
      } else {
        // console.log("No transactions found for the given date.");
        resolve(null);
      }
    } catch (error) {
      console.error("Error fetching loan balance outstanding:", error);
      reject(error);
    }
  });
};

const fetch_last_date = (get_year, get_month) => {
  // console.log(get_year, get_month);
  return new Promise(async (resolve, reject) => {
    try {
      var get_last_day = new Date(get_year, get_month, 0);

      var fetch_date = dateFormat(get_last_day, "yyyy-mm-dd");
      resolve(fetch_date);
    } catch (error) {
      console.error("Error fetching loan balance outstanding:", error);
      reject(error);
    }
  });
};

//Function to get the principal amount against a loan id on a particular date
const get_prn_amt = (loan_id, get_date) => {
  // console.log(loan_id, get_date, "fetch_data");
  return new Promise(async (resolve, reject) => {
    try {
      var fetch_balance = {suc : 0, msg : []};

      var select = "max(payment_date) payment_date",
        table_name = "td_loan_transactions",
        whr = `loan_id = '${loan_id}' AND tr_type != 'I' AND payment_date <= '${get_date}'`,
        order = null;
      var fetch_max_pay_date = await db_Select(select, table_name, whr, order);  
      // console.log(fetch_max_pay_date.msg[0].payment_date);
          

      if (fetch_max_pay_date.suc > 0 && fetch_max_pay_date.msg.length > 0) {
        var select = "max(payment_id) payment_id",
          table_name = "td_loan_transactions",
          whr = `loan_id = '${loan_id}' AND tr_type != 'I' AND payment_date = '${dateFormat(fetch_max_pay_date.msg[0].payment_date,'yyyy-mm-dd')}'`,
          order = null;
        var fetch_max_pay_id = await db_Select(select, table_name, whr, order);

        if (fetch_max_pay_id.suc > 0 && fetch_max_pay_id.msg.length > 0) {
          var select = "sum(balance + od_balance) prn_amt",
            table_name = "td_loan_transactions",
            whr = `loan_id = '${loan_id}' AND payment_date = '${dateFormat(fetch_max_pay_date.msg[0].payment_date,'yyyy-mm-dd')}' AND payment_id = '${fetch_max_pay_id.msg[0].payment_id}'`,
            order = null;
          fetch_balance = await db_Select(select, table_name, whr, order);
        }
      }else {
        reject({ suc: 0, msg: "fetch payment date wrong" });
      }
      resolve(fetch_balance);
    } catch (error) {
      console.error("Error on calculating principal amount:", error);
      reject(error);
    }
  });
};

//Function to get the interest amount against a loan id on a particular date
const get_intt_amt = (loan_id, get_date) => {
  // console.log(loan_id, get_date, "fetch_data");
  return new Promise(async (resolve, reject) => {
    try {
      var fetch_intt_balance = {suc : 0, msg : []};

      var select = "max(payment_date) payment_date",
        table_name = "td_loan_transactions",
        whr = `loan_id = '${loan_id}' AND tr_type != 'I' AND payment_date <= '${get_date}'`,
        order = null;
      var fetch_intt_max_pay_date = await db_Select(select, table_name, whr, order);  
      console.log(fetch_intt_max_pay_date.msg[0].payment_date);
          

      if (fetch_intt_max_pay_date.suc > 0 && fetch_intt_max_pay_date.msg.length > 0) {
        var select = "max(payment_id) payment_id",
          table_name = "td_loan_transactions",
          whr = `loan_id = '${loan_id}' AND tr_type != 'I' AND payment_date = '${dateFormat(fetch_intt_max_pay_date.msg[0].payment_date,'yyyy-mm-dd')}'`,
          order = null;
        var fetch_intt_max_pay_id = await db_Select(select, table_name, whr, order);

        if (fetch_intt_max_pay_id.suc > 0 && fetch_intt_max_pay_id.msg.length > 0) {
          var select = "intt_balance",
            table_name = "td_loan_transactions",
            whr = `loan_id = '${loan_id}' AND payment_date = '${dateFormat(fetch_intt_max_pay_date.msg[0].payment_date,'yyyy-mm-dd')}' AND payment_id = '${fetch_intt_max_pay_id.msg[0].payment_id}'`,
            order = null;
          fetch_intt_balance = await db_Select(select, table_name, whr, order);
        }
      }else {
        reject({ suc: 0, msg: "fetch payment date wrong" });
      }
      resolve(fetch_intt_balance);
    } catch (error) {
      console.error("Error on calculating principal amount:", error);
      reject(error);
    }
  });
};

//Function to get date
const fetch_date = (branch_code, get_dt) => {
  // console.log(branch_code, get_dt, "fetch_data");

  return new Promise(async (resolve, reject) => {
    try {
      let formattedDate = dateFormat(new Date(get_dt), "yyyy-mm-dd");

      let select = "closed_upto",
        table_name = "td_month_close",
        whr = `branch_code = '${branch_code}'`,
        order = null;

      let result = await db_Select(select, table_name, whr, order);

      if (result.suc > 0 && result.msg.length > 0) {
        let closed_upto = result.msg[0].closed_upto; 
        // console.log(closed_upto,'upppp');
        
        
        // if (!closed_upto) {
        //   reject({ suc: 0, msg: "closed_upto date is missing" });
        //   return;
        // }

        // Convert both dates to Date objects for comparison
        let closedDate = (dateFormat(closed_upto,'yyyy-mm-dd'));
        let formDate = (dateFormat(formattedDate,'yyyy-mm-dd'));
        // console.log(closedDate,formDate,'formDate');

        if (closedDate >= formDate) {
          resolve({ suc: 0, msg: "Error: formDate must be greater than closed_upto." });
        } else {
          resolve({ suc: 1, msg: `Success! formDate ${formDate} is greater than closed_upto ${closedDate}` });          
        }
      } else {
        reject({ suc: 0, msg: "No matching record found for this branch_code." });
      }
    } catch (error) {
      console.error("Error on fetching date:", error);
      reject(error);
    }
  });
};

// CALCULATE LOAN DEMAND
const f_getdemand = (loan_id,adt_dt) => {
   return new Promise(async (resolve, reject) => {
    try{
     //Fetch loan details
     var select = "disb_dt,period,period_mode,instl_start_dt,instl_end_dt,tot_emi,prn_amt,intt_amt",
     table_name = "td_loan",
     whr = `loan_id = '${loan_id}'`,
     order = null;
     var get_data = await db_Select(select,table_name,whr,order);

    const {disb_dt,period,period_mode,instl_start_dt,instl_end_dt,tot_emi,prn_amt,intt_amt} = get_data[0];

    //Get paid amount up to adt_dt
     const paid_result = await db_Select(
        "IFNULL(SUM(credit), 0) as paid_amt",
        "td_loan_transactions",
        `loan_id = '${loan_id}' AND tr_type = 'R' AND payment_date <= '${adt_dt}'`,
        null
      );
      const paid_amt = parseFloat(paid_result[0]?.paid_amt || 0);

      let ld_demand = 0;

      if (new Date(adt_dt) >= new Date(instl_end_dt)) {
        ld_demand = parseFloat(prn_amt) + parseFloat(intt_amt);
      } else {
        // Calculate how many periods have passed
         const instl_start = new Date(instl_start_dt);
         const get_adt_dt = new Date(adt_dt);
         let diff = 0;

        if (period_mode === "Monthly") {
          diff =
            (get_adt_dt.getFullYear() - instl_start.getFullYear()) * 12 +
            (get_adt_dt.getMonth() - instl_start.getMonth()) +
            1;
        } else {
          // Weekly mode: calculate total weeks
          const timeDiff = get_adt_dt.getTime() - instl_start.getTime();
          diff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7)) + 1;
        }
        const actual_amt = diff * parseFloat(tot_emi);
        ld_demand = actual_amt - paid_amt;
      }
      if (ld_demand <= 0) ld_demand = 0;

      resolve(Math.round(ld_demand));

    } catch (error) {
      console.error("Error calculating month difference:", error);
      reject(error);
    }
  });
}

// FUNCTION TO POPULATE LOAN OVERDUE 24.07.2025

const populateOverdue = (branch_code, DATE) => {
  return new Promise(async (resolve, reject) => {
    try {
      var select = `loan_id,branch_code,group_code,member_code,(prn_disb_amt + intt_cal_amt) disb_amt, (prn_amt + intt_amt) outstanding,tot_emi,period_mode,instl_start_dt`,
      table_name = "td_loan",
      whr = `branch_code = '${branch_code}' AND outstanding > 0 AND disb_dt <= '${DATE}'`,
      order = null;
      var get_loan_data = await db_Select(select, table_name, whr, order);

      // loop through each loan and process
      if (Array.isArray(get_loan_data)) {
         for (let loan of get_loan_data) {

           // Get sum of credits
          var select = "SUM(credit) collc_amt",
          table_name = "td_loan_transactions",
          whr = `loan_id = '${loan.loan_id}' AND payment_date <= '${DATE}'`,
          order = null;
          var get_credit = await db_Select(select, table_name, whr, order);
          let collc_amt = parseFloat(get_credit[0]?.collc_amt || 0);

          // Get calculated values from functions loan demand
          let dmd_amt = await f_getdemand(loan.loan_id, DATE);

          // demand amount > 0 then calculate period
          if (dmd_amt > 0) {
            let li_period = Math.round(collc_amt / loan.tot_emi);

         // calculate overdue date   
         let od_dt;
         let instl_date = new Date(loan.instl_start_dt);
         if (loan.period_mode === 'Monthly') {
              instl_date.setMonth(instl_date.getMonth() + li_period);
         } else {
              instl_date.setDate(instl_date.getDate() + (li_period * 7));
            }
         od_dt = instl_date.toISOString().slice(0, 10);

         // check if overdue
          if (new Date(od_dt) <= new Date(DATE)) {
          
          // Insert into td_od_loan
          var table_name = "td_od_loan",
          fields = "(trf_date, od_date, loan_id, branch_code, disb_amt, collc_amt, od_amt, outstanding, remarks)",
          values =  `('${DATE}', '${od_dt}', '${loan.loan_id}', '${loan.branch_code}', '${loan.disb_amt}', '${collc_amt}', '${dmd_amt}', '${loan.outstanding}', 'To OD')`,
          whr = null,
          flag = 0;
          var insert_od_data = await db_Insert(table_name,fields,values,whr,flag);
          }
           }
           }
      } else {
           console.error("Expected an array but got:", get_loan_data);
      }
      resolve("Overdue processing completed");
    } catch (error) {
      console.error("Error calculating month difference:", error);
      reject(error);
    }
  });
};


module.exports = {
  getFormNo,
  groupCode,
  getMemberCode,
  getLoanCode,
  interest_cal_amt,
  calculate_prn_emi,
  calculate_intt_emi,
  installment_end_date,
  periodic,
  payment_code,
  getBankCode,
  genDate,
  getLoanDmd,
  getLoanBal,
  dayRevarseList,
  loan_balance_outstanding,
  loan_od_balance_outstanding,
  loan_intt_balance_outstanding,
  fetch_last_date,
  get_prn_amt,
  get_intt_amt,
  fetch_date,
  getDistCode,
  getBlockCode,
  getPurposeCode,
  getFundCode,
  getSchemeCode,
  f_getdemand,
  populateOverdue
};
