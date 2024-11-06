const { db_Select, db_Insert } = require("../../model/mysqlModel");

const getFormNo = () => {
    return new Promise(async (resolve, reject) => {
        year = new Date().getFullYear();

        var select = "IF(MAX(SUBSTRING(form_no, -5)) > 0, LPAD(MAX(cast(SUBSTRING(form_no, -5) as unsigned))+1, 5, '0'), '000001') max_form",
        table_name = "td_grt_basic",
        whr = `SUBSTRING(form_no, 1, 4) = YEAR(now())`,
        order = null;
        var res_dt = await db_Select(select, table_name, whr, order);
        var newId = `${year}${res_dt.msg[0].max_form}`        
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

        var select = "max(substr(group_code,3)) + 1 group_code",
        table_name = "md_group",
        whr = null,
        order = null;
        var res_dt = await db_Select(select, table_name, whr, order);

        let newGroupCode = res_dt.msg[0].group_code;
        let groupCode = `${branch_code}` + newGroupCode;

      resolve(groupCode);
    });
  };

  const getMemberCode = (branch_code) => {
    return new Promise(async (resolve, reject) => {

        var select = "max(substr(member_code,3)) + 1 member_code",
        table_name = "md_member",
        whr = null,
        order = null;
        var res_dt = await db_Select(select, table_name, whr, order);

        let newMemberCode = res_dt.msg[0].member_code;
        let memberCode = `${branch_code}` + newMemberCode;
        console.log(memberCode,'code');
        
      resolve(memberCode);
    });
  };

  const getLoanCode = (branch_code) => {
    return new Promise(async (resolve, reject) => {

        var select = "max(substr(loan_id,3)) + 1 loan_code",
        table_name = "td_loan",
        whr = null,
        order = null;
        var res_dt = await db_Select(select, table_name, whr, order);

        let newLoanCode = res_dt.msg[0].loan_code;        
        let loanCode = `${branch_code}` + newLoanCode;
        console.log(loanCode,'code');
        
      resolve(loanCode);
    });
  };

  const payment_code = (branch_code) => {
    return new Promise(async (resolve, reject) => {
        year = new Date().getFullYear();

        var select = ""
        var newPayId = `${year}+${branch_code}`        
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
      tot_period: 12
    },
    {
      id: "Weekly",
      name: "week",
      div_period: 4,
      tot_period: 48
    },
  ]

   const interest_cal_amt = async (principal, time, rate, period_mode) => {
    try {
      const period = periodic.filter((p) => p.id == period_mode);
  
      const periodValue = period[0].tot_period
      const interest = (((principal * rate) / 100) / periodValue) * time;
  
      console.log(interest);
      return Math.round(interest);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  const calculate_prn_emi = (principal, period) => {
    return new Promise((resolve, reject) => {
      let emi_prn;

      emi_prn = (principal / period);
      console.log(emi_prn.toFixed(2));
      
       resolve(emi_prn.toFixed(2));
    });
  };

  const calculate_intt_emi = (interest, period) => {
    return new Promise((resolve, reject) => {
      let emi_intt;

      emi_intt = (interest / period);
      console.log(emi_intt.toFixed(2));
      
       resolve(emi_intt.toFixed(2));
      //  resolve(Math.round(emi_intt));
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
          
          const selectedMode = modes_periodic.find(mode => mode.id === periodModeId);
  
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



  
  module.exports = {getFormNo, groupCode, getMemberCode, getLoanCode, interest_cal_amt, calculate_prn_emi, calculate_intt_emi, installment_end_date, periodic, payment_code}