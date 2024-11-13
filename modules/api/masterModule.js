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

        var select = "IF(MAX(SUBSTRING(payment_id, 8)) > 0, MAX(cast(SUBSTRING(payment_id, 8) as unsigned))+1, 1) max_pay_id",
        table_name = "td_loan_transactions",
        whr = ` YEAR(payment_date) = YEAR(NOW());`,
        order = null;
        var pay_dt = await db_Select(select,table_name,whr,order);

        let newPayCode = pay_dt.msg[0].max_pay_id;   
        console.log(newPayCode,'paycode');
         
        var newPayId = `${year}` + `${branch_code}` + newPayCode        
      resolve(newPayId);
    });
  };

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

  const getBankCode = () => {
    return new Promise(async (resolve, reject) => {

        var select = "max(bank_code) as max_bank_code",
            table_name = "md_bank",
            whr = null,
            order = null;
        try {
            var result = await db_Select(select, table_name, whr, order);
            
            let newBankCode = result.msg[0].max_bank_code ? parseInt(result.msg[0].max_bank_code) + 1 : 1001;

            resolve(newBankCode);
        } catch (error) {
            reject(error);
        }
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
      div_period: 1,
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

const genDate = (period,mode,emiDate,selDay) => {
  return new Promise((resolve, reject) => {
    const dateFormat = require('dateformat')
    var currDate = new Date()
    // user input //
    // var period = 48, mode = 'W', emiDate = 15, selDay = 2;
    // end //
    // OUTPUT //
    var emiStartDate = '', emiEndDate = '';
    // END //
  
    var dayList = {
      1: 'Sunday',
      2: 'Monday',
      3: 'Tuesday',
      4: 'Wednesday',
      5: 'Thursday',
      6: 'Friday',
      7: 'Saturday'
    }
  
    var dayRevarseList = {
      'Sunday': 1,
      'Monday': 2,
      'Tuesday': 3,
      'Wednesday': 4,
      'Thursday': 5,
      'Friday': 6,
      'Saturday': 7
    }
    switch (mode) {
      case 'Monthly':
        var modDt = new Date(currDate.setMonth((currDate.getMonth() + 1) + period))
        emiEndDate = new Date(modDt.getFullYear(), modDt.getMonth(), emiDate)
        var modStDt = new Date()
        modStDt.setMonth((modStDt.getMonth() + 1))      
        emiStartDate = new Date(modStDt.getFullYear(), modStDt.getMonth(), emiDate)
        break;
      case 'Weekly':
        var emiEndDate = new Date(currDate.setDate(currDate.getDate() + (period * 7)))
  
        for(let i=emiEndDate.getDate(); i < new Date(emiEndDate.getFullYear(), emiEndDate.getMonth(), 0).getDate(); i++){
          var selectedMon = dayList[selDay]
          if(selectedMon == dateFormat(new Date(emiEndDate), 'dddd')){
            break;
          }
          emiEndDate.setDate(emiEndDate.getDate() + 1)
        }
  
        var modStDt = new Date()
        var selDayNum = dayRevarseList[dateFormat(new Date(modStDt), 'dddd')]
        emiStartDate = new Date(modStDt.setDate((modStDt.getDate() + (7-selDayNum))))
        
        for(let i=emiStartDate.getDate(); i < new Date(emiStartDate.getFullYear(), emiStartDate.getMonth(), 0).getDate(); i++){
          var selectedMon = dayList[selDay]
          if(selectedMon == dateFormat(new Date(emiStartDate), 'dddd')){
            break;
          }
          emiStartDate.setDate(emiStartDate.getDate() + 1)
        }
        break;
      default:
        emiStartDate = new Date()
        emiEndDate = new Date()
        break;
    }
    
    // console.log(dateFormat(new Date(emiStartDate), 'dd/mm/yyyy'), dateFormat(new Date(emiEndDate), 'dd/mm/yyyy'));
    resolve({emtStart: emiStartDate, emiEnd: emiEndDate})
  })
}

  
  module.exports = {getFormNo, groupCode, getMemberCode, getLoanCode, interest_cal_amt, calculate_prn_emi, calculate_intt_emi, installment_end_date, periodic, payment_code, getBankCode, genDate}