const { db_Select } = require("../../model/mysqlModel");

const express = require("express"),
  masterRouter = express.Router(),
  dateFormat = require("dateformat");

masterRouter.get("/get_group", async (req, res) => {
  var data = req.query;

  //get group details
  if (data.branch_code == "100") {
    var select = "*",
      table_name = "md_group",
      whr = null,
      order = `ORDER BY group_name`;
    var group_dt = await db_Select(select, table_name, whr, order);
  } else {
    var select = "*",
      table_name = "md_group",
      whr = `branch_code = '${data.branch_code}'`,
      order = `ORDER BY group_name`;
    var group_dt = await db_Select(select, table_name, whr, order);
  }
  res.send(group_dt);
});

masterRouter.get("/get_group_add", async (req, res) => {
  var data = req.query;

  //add group
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Fetch data in chunks
  let offset = 0;
  const limit = 100; // Define chunk size

  const fetchChunk = async () => {
    var select = "*",
      table_name = "md_group",
      whr = `branch_code = '${data.branch_code}'`,
      order = `LIMIT ${limit} OFFSET ${offset}`;
    var group_dt = await db_Select(select, table_name, whr, order);

    if (group_dt.suc > 0) {
      for (let dt of group_dt.msg) {
        res.write(`data: ${JSON.stringify(dt)}\n\n`);
      }

      offset += limit;

      // Check if more data is available, else end the stream
      if (group_dt.msg.length < limit) {
        res.end();
      } else {
        setTimeout(fetchChunk, 1000); // Delay before sending the next chunk
      }
    } else {
      res.end();
    }
  };
  fetchChunk();
});

masterRouter.get("/get_religion", async (req, res) => {
  //get religion from mastertable
  var religion_dt = [
    {
      id: "Hinduism",
      name: "Hinduism",
    },
    {
      id: "Islam",
      name: "Islam",
    },
    {
      id: "Christianity",
      name: "Christianity",
    },
    {
      id: "Jainism",
      name: "Jainism",
    },
    {
      id: "Buddhism",
      name: "Buddhism",
    },
    {
      id: "Sikhism",
      name: "Sikhism",
    },
    {
      id: "Others",
      name: "Others",
    },
  ];
  res.send(religion_dt);
});

masterRouter.get("/get_caste", async (req, res) => {
  //get caste from master details
  var caste_dt = [
    {
      id: "General",
      name: "General",
    },
    {
      id: "SC",
      name: "SC",
    },
    {
      id: "ST",
      name: "ST",
    },
    {
      id: "OBC",
      name: "OBC",
    },
    {
      id: "OBCA",
      name: "OBCA",
    },
    {
      id: "OBCB",
      name: "OBCB",
    },
    {
      id: "Others",
      name: "Others",
    },
    {
      id: "Minority",
      name: "Minority",
    },
  ];
  res.send(caste_dt);
});

masterRouter.get("/get_education", async (req, res) => {
  //get educations
  var edu_dt = [
    {
      id: "Secondary",
      name: "Secondary",
    },
    {
      id: "Intermidiate",
      name: "Intermidiate",
    },
    {
      id: "Graduate",
      name: "Graduate",
    },
    {
      id: "Post Graduate",
      name: "Post Graduate",
    },
    {
      id: "Voccational",
      name: "Voccational",
    },
    {
      id: "Others",
      name: "Others",
    },
  ];
  res.send(edu_dt);
});

//    masterRouter.post("/fetch_validation", async (req, res) => {
//     var data = req.body;

//     var select = "*",
//     table_name = "td_grt_basic",
//     whr = data.flag == 'M' ? `client_mobile = '${data.user_dt}' : 'data no found'` : data.flag == 'A' ? `aadhar_no = '${data.user_dt}' : 'data no found'` : data.flag == 'P' ? `pan_no = '${data.user_dt}' : 'data no found'` : '',
//     order = null;
//     var valid_data = await db_Select(select,table_name,whr,order);
//     res.send(valid_data)
// });

// masterRouter.post("/fetch_validation", async (req, res) => {
//     var data = req.body;

//     var select = "a.*, b.group_name",
//         table_name = "td_grt_basic a, md_group b",
//         whr = `a.prov_grp_code = b.group_code
//         AND data.flag == 'M' ? `a.client_mobile = '${data.user_dt}'` :  data.flag == 'A' ? `a.aadhar_no = '${data.user_dt}'` :  data.flag == 'P' ? `a.pan_no = '${data.user_dt}'` : '',
//         order = null;
//         var res_dt = await db_Select(select,table_name,whr,order)
//         res.send(res_dt)
// });

// masterRouter.post("/fetch_validation", async (req, res) => {
//     var data = req.body;
//     console.log(data,'gg');

//     //fetch validation
//     var select = "member_code";
//     var table_name = "md_member";

//     var whr = `branch_code = '${data.branch_code}'`;
//     if (data.flag == 'M') {
//         whr += `AND client_mobile = '${data.user_dt}'`;
//     }
//     if (data.flag == 'A') {
//         whr += `AND aadhar_no = '${data.user_dt}'`;
//     }
//     if (data.flag == 'P') {
//         whr += `AND pan_no = '${data.user_dt}'`;
//     }

//     var order = `GROUP BY member_code`;
//     var res_dt = await db_Select(select, table_name, whr, order);

//     if(res_dt.suc > 0 && res_dt.msg.length > 0){
//         for(let dt of res_dt.msg){
//             var select = "branch_code,member_code,gender,client_name,client_mobile,phone_verify_flag,email_id,gurd_name,gurd_mobile,client_addr,pin_no,aadhar_no,aadhar_verify_flag,pan_no,pan_verify_flag,religion,other_religion,caste,other_caste,education,other_education,dob",
//             table_name = "md_member",
//             whr = `member_code = '${dt.member_code}'`,
//             order = null;
//         }

//         // var res_dtls = await db_Select(select,table_name,whr,order);
//     }

//     try {
//         var res_dtls = await db_Select(select, table_name, whr, order);
//         // console.log(res_dtls, 'res_dtls');

//         var response_set = {}
//         if(res_dtls.suc > 0){
//             if(res_dtls.msg.length > 0){

//                   var select = "a.outstanding, b.branch_name",
//                   table_name = "td_loan a,md_branch b",
//                   whr = `a.branch_code = b.branch_code AND a.member_code = '${res_dtls.msg[0].member_code}' AND a.outstanding > 0`
//                   order = null;
//                   var default_chk = await db_Select(select,table_name,whr,order);
//                 //   console.log(default_chk, 'default_chk');

//                 if(default_chk.suc > 0){
//                     if(default_chk.msg.length > 0){
//                         response_set = {suc: 1, msg: [], status: `You are in ${default_chk.msg[0].branch_name} Branch and You are not eligible to get a new Loan. You have Rs. ${default_chk.msg[0].outstanding} outstanding.`}
//                     }else{
//                         response_set = {suc: 1, msg: res_dtls.msg, status: 'Existing User. Eligible to apply a new loan.'}
//                     }
//                 }else{
//                     response_set = {suc: 1, msg: res_dt.msg, status: 'Error to fetch outstanding data'}
//                 }

//             }else{
//                 response_set = {suc: 1, msg: [], status: 'Fresh User'}
//             }
//         }
//         res.send(response_set);
//     } catch (error) {
//         // Handle errors
//         res.send({ suc: 0, msg: [], status: 'Error to fetch user data' });
//     }
// });

// masterRouter.post("/fetch_validation", async (req, res) => {
//     var data = req.body;
//     console.log(data,'gg');

//     try {

//     //fetch member code
//     var select = "member_code";
//     var table_name = "md_member";

//     var whr = `branch_code = '${data.branch_code}'`;
//     if (data.flag == 'M') {
//         whr += `AND client_mobile = '${data.user_dt}'`;
//     }
//     if (data.flag == 'A') {
//         whr += `AND aadhar_no = '${data.user_dt}'`;
//     }
//     if (data.flag == 'P') {
//         whr += `AND pan_no = '${data.user_dt}'`;
//     }

//     var order = `GROUP BY member_code`;
//     var res_dt = await db_Select(select, table_name, whr, order);

//     if(res_dt.suc > 0 && res_dt.msg.length > 0){
//         for(let dt of res_dt.msg){
//             var select = "branch_code,member_code,gender,client_name,client_mobile,phone_verify_flag,email_id,gurd_name,gurd_mobile,husband_name,client_addr,pin_no,nominee_name,aadhar_no,aadhar_verify_flag,pan_no,pan_verify_flag,voter_id,voter_verify_flag,religion,other_religion,caste,other_caste,education,other_education,dob",
//             table_name = "md_member",
//             whr = `member_code = '${dt.member_code}'`,
//             order = null;
//         }
//         }

//         var res_dtls = await db_Select(select, table_name, whr, order);
//         // console.log(res_dtls, 'res_dtls');

//         var response_set = {}
//         if(res_dtls.suc > 0){
//             if(res_dtls.msg.length > 0){

//                   var select = "a.outstanding, b.branch_name",
//                   table_name = "td_loan a,md_branch b",
//                   whr = `a.branch_code = b.branch_code AND a.member_code = '${res_dtls.msg[0].member_code}' AND a.outstanding > 0`
//                   order = null;
//                   var default_chk = await db_Select(select,table_name,whr,order);
//                 //   console.log(default_chk, 'default_chk');

//                 if(default_chk.suc > 0){
//                     if(default_chk.msg.length > 0){
//                         response_set = {suc: 1, msg: [], status: `You are in ${default_chk.msg[0].branch_name} Branch and You are not eligible to get a new Loan. You have Rs. ${default_chk.msg[0].outstanding} outstanding.`}
//                     }else{
//                         response_set = {suc: 1, msg: res_dtls.msg, status: 'Existing User.No outstanding.Eligible to apply a new loan.'}
//                     }
//                 }else{
//                     response_set = {suc: 1, msg: res_dt.msg, status: 'Error to fetch outstanding data'}
//                 }

//             }else{
//                 response_set = {suc: 1, msg: [], status: 'Fresh User'}
//             }
//         }
//         res.send(response_set);
//     } catch (error) {
//         // Handle errors
//         res.send({ suc: 0, msg: [], status: 'Error to fetch user data' });
//     }
// });

masterRouter.post("/fetch_validation", async (req, res) => {
  var data = req.body;
  console.log(data, "gg");

  var response_set = {};

  try {
    //fetch member code
    var select = "a.member_code";
    table_name = "md_member a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code and b.approval_status NOT IN ('R')";
    whr = `a.branch_code = '${data.branch_code}'`;

    if (data.flag == "M") {
      whr += `AND a.client_mobile = '${data.user_dt}'`;
    }
    if (data.flag == "A") {
      whr += `AND a.aadhar_no = '${data.user_dt}'`;
    }
    if (data.flag == "P") {
      whr += `AND a.pan_no = '${data.user_dt}'`;
    }
    if (data.flag == "V") {
      whr += `AND a.voter_id = '${data.user_dt}'`;
    }
    order = `GROUP BY a.member_code`;
    var res_dt = await db_Select(select, table_name, whr, order);

    if (res_dt.suc > 0 && res_dt.msg.length == 0) {
      response_set = {
        suc: 1,
        msg: [],
        status: "Fresh User",
      };
      return res.send(response_set);
    }

    // FETCH LATEST GRT (FORM NO)
    if (res_dt.suc > 0 && res_dt.msg.length > 0) {
      let member_code = res_dt.msg[0].member_code;

      var select = "form_no";
      table_name = "td_grt_basic";
      whr = `member_code='${member_code}' AND approval_status NOT IN ('R')`;
      order = "ORDER BY form_no DESC LIMIT 1";
      var grt_dt = await db_Select(select, table_name, whr, order);

      if (grt_dt.suc > 0 && grt_dt.msg.length > 0) {
        let form_no = grt_dt.msg[0].form_no;

        var select = "a.outstanding, b.branch_name,a.grt_form_no",
          table_name = "td_loan a,md_branch b",
          whr = `a.branch_code = b.branch_code 
         AND a.member_code='${member_code}' 
         AND (a.grt_form_no = '${form_no}' OR a.grt_form_no = 0)`,
          order = null;
        var loan_dt = await db_Select(select, table_name, whr, order);

        if (loan_dt.suc > 0 && loan_dt.msg.length == 0) {
          
          response_set = {
            suc: 3,
            msg: [],
            status: "GRT done but loan disbursement is pending",
          };
          return res.send(response_set);
        }

        if (loan_dt.suc > 0 && loan_dt.msg[0].outstanding > 0) {
          response_set = {
            suc: 3,
            msg: [],
            status: `You are in ${loan_dt.msg[0].branch_name} Branch and You are not eligible to get a new Loan. You have Rs. ${loan_dt.msg[0].outstanding} outstanding.`,
          };
          return res.send(response_set);
        }
      }
      var select =
          "a.branch_code,a.member_code,a.gender,a.client_name,a.client_mobile,a.phone_verify_flag,a.email_id,a.gurd_name,a.gurd_mobile,a.husband_name,a.client_addr,a.pin_no,a.nominee_name,a.aadhar_no,a.aadhar_verify_flag,a.pan_no,a.pan_verify_flag,a.voter_id,a.voter_verify_flag,a.religion,a.other_religion,a.caste,a.other_caste,a.education,a.other_education,a.dob",
        table_name = "md_member a LEFT JOIN td_grt_basic b On a.branch_code = b.branch_code AND b.approval_status NOT IN ('R')",
        whr = `a.member_code = '${member_code}'`,
        order = null;

      var res_dtls = await db_Select(select, table_name, whr, order);

      response_set = {
        suc: 2,
        msg: res_dtls.msg,
        status: "Existing User.No outstanding.Eligible to apply a new loan.",
      };
    } else {
      response_set = res_dt;
      response_set["status"] =
        res_dt.suc > 0 ? "Fresh User" : "Error while fetching user data.";
    }
    return res.send(response_set);
  } catch (error) {
    console.error(error);
    response_set = {
      suc: 0,
      msg: [],
      status: "Error fetching user data",
    };
    return res.send(response_set);
  }
});

masterRouter.get("/get_state", async (req, res) => {
  var data = req.query;

  //get setate from master table
  var select = "*",
    table_name = "md_state",
    whr = null,
    order = null;
  var state_dt = await db_Select(select, table_name, whr, order);
  res.send(state_dt);
});

masterRouter.get("/get_district", async (req, res) => {
  var data = req.query;

  //get district from master table
  var select = "*",
    table_name = "md_district",
    whr = `state_id = '${data.state_id}'`,
    order = null;
  var district_dt = await db_Select(select, table_name, whr, order);
  res.send(district_dt);
});

masterRouter.get("/get_block", async (req, res) => {
  var data = req.query;

  //get block from master table
  var select = "*",
    table_name = "md_block",
    whr = `dist_id = '${data.dist_id}'`,
    order = null;
  var block_dt = await db_Select(select, table_name, whr, order);
  res.send(block_dt);
});

masterRouter.get("/get_purpose", async (req, res) => {
  var data = req.query;

  //get purpose from master table
  var select = "purp_id,CONCAT(sub_purpose,'-',purpose_id)purpose_id",
    table_name = "md_purpose",
    whr = null,
    order = null;
  var purpose_dt = await db_Select(select, table_name, whr, order);
  res.send(purpose_dt);
});

masterRouter.get("/get_sub_purpose", async (req, res) => {
  var data = req.query;

  //get sub purpose from master table
  var select = "*",
    table_name = "md_sub_purpose",
    whr = `purp_id = '${data.purp_id}'`,
    order = null;
  var sub_purpose_dt = await db_Select(select, table_name, whr, order);
  res.send(sub_purpose_dt);
});

//    masterRouter.get("/get_study", async (req, res) => {
//     var edu_dt = [
//         {
//             id: "Studying",
//             name: "Studying"
//         },
//         {
//             id: "Working",
//             name: "Working"
//         }
//     ]
//     res.send(edu_dt)
//    });

masterRouter.get("/get_scheme", async (req, res) => {
  var data = req.query;

  //get scheme purpose from master table
  var select =
      "scheme_id,scheme_name,min_amt,max_amt,min_period,max_period,payment_mode,roi",
    table_name = "md_scheme",
    whr = `active_flag = 'A'`,
    order = null;
  var scheme_dt = await db_Select(select, table_name, whr, order);
  res.send(scheme_dt);
});

masterRouter.get("/get_fund", async (req, res) => {
  var data = req.query;

  //get fund from master table
  var select = "fund_id,fund_name",
    table_name = "md_fund",
    whr = null,
    order = null;
  var fund_dt = await db_Select(select, table_name, whr, order);
  res.send(fund_dt);
});

masterRouter.get("/get_tr_type", async (req, res) => {
  //get sub purpose from master table
  var tr_type_dt = [
    {
      id: "D",
      name: "Disbursement",
    },
    {
      id: "R",
      name: "Recovery",
    },
    {
      id: "I",
      name: "Interest",
    },
  ];
  res.send(tr_type_dt);
});

masterRouter.get("/get_tr_mode", async (req, res) => {
  //gert transactions details
  var tr_mode_dt = [
    {
      id: "C",
      name: "Cash",
    },
    {
      id: "B",
      name: " Bank Transfer",
    },
  ];
  res.send(tr_mode_dt);
});

masterRouter.post("/get_bank", async (req, res) => {
  var data = req.body;

  //get bank details
  // var select = "CONCAT(bank_name, ' ' ,'-',' ' , branch_name, ' ' , '-',' ' , ifsc) AS bank_name",
  var select =
      "*,CONCAT(bank_name, ' ' ,'-',' ' , branch_name, ' ' , '-',' ' , ifsc) AS bank_name",
    table_name = "md_bank",
    whr = `dist_code = '${data.dist_code}'`,
    order = null;
  var bank_dt = await db_Select(select, table_name, whr, order);
  res.send(bank_dt);
});

masterRouter.get("/get_designation", async (req, res) => {
  var data = req.query;

  //get designation details
  var select = "*",
    table_name = "md_designation",
    whr = null,
    order = null;
  var desig_dt = await db_Select(select, table_name, whr, order);
  res.send(desig_dt);
});

module.exports = { masterRouter };
