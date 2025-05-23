const { db_Select, db_Insert } = require("../../../model/mysqlModel");

const express = require("express"),
  monthEndRouter = express.Router(),
  dateFormat = require("dateformat");

monthEndRouter.post("/fetch_monthend_branch_details", async (req, res) => {
  try {
    var select =
        "a.branch_code, a.branch_name,LAST_DAY(DATE_ADD(b.closed_upto, INTERVAL 1 MONTH)) AS closed_upto,b.outstanding_flag outstanding_process,b.demand_flag demand_process",
      table_name =
        "md_branch a LEFT JOIN td_month_close b ON a.branch_code = b.branch_code",
      whr = `a.branch_code <> 100`,
      order = null;

    var branch_data = await db_Select(select, table_name, whr, order);

    res.send(branch_data);
  } catch (error) {
    console.error("Error fetching month-end branch details:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

monthEndRouter.post("/update_month_end_data", async (req, res) => {
  var data = req.body;
  // console.log(data);

  const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

  try {
    if (data.month_end_dt && data.month_end_dt.length > 0) {
      for (let dt of data.month_end_dt) {
        // console.log(dt, "dt");

        var brn_code_arr = data.month_end_dt.map(
          (pdt) => `'${pdt.branch_code}'`
        );
        // console.log(brn_code_arr, "brn_code");

        var table_name = "td_month_close",
          fields = `closed_upto = '${dt.closed_upto}', outstanding_flag = 'N',demand_flag = 'N',closed_by = '${data.closed_by}', closed_at = '${datetime}'`,
          values = null,
          whr = `branch_code IN (${brn_code_arr.join(",")})`,
          flag = 1;

        var month_end_details_save = await db_Insert(
          table_name,
          fields,
          values,
          whr,
          flag
        );
      }
      res.send({ suc: 1, msg: "Month end done successfully" });
    } else {
      res.send({ suc: 0, msg: "No details provided" });
    }
  } catch (error) {
    console.error(error);
    res.send({ suc: 0, msg: "Error occurred", details: error });
  }
});

// monthEndRouter.post("/fetch_unapproved_dtls_before_monthend",async (req, res) => {
//     var data = req.body;
//     // console.log(data,'ll');
    
//     try {
//       if (data.month_end_dtls && data.month_end_dtls.length > 0) {
//         let unapprovedDetails = [];

//         for (let dt of data.month_end_dtls) {
//           // console.log(dt,'lolo');

//           // var select = "branch_id,count(*) AS tot_unapprove",
//           // table_name = "td_loan_transactions",
//           // whr = `branch_id = '${dt.branch_code}'
//           //   AND tr_type != 'I'
//           //   AND status = 'U'
//           //   order = `Group BY;
          
//           var select = "*",
//             table_name = "td_loan_transactions",
//             whr = `branch_id = '${dt.branch_code}'
//               AND tr_type != 'I'
//               AND status = 'U'`;

//           var res_dt = await db_Select(select, table_name, whr, null);

//           // if (res_dt.suc > 0 && res_dt.msg.length > 0) {
//           //   unapprovedDetails.push(res_dt.msg[0].branch_id || '');
//           // // console.log(unapprovedDetails,'unapp');
//           // }

//            // Push branch_id or null (if no data found)
//            unapprovedDetails.push(res_dt.suc > 0 && res_dt.msg.length > 0 
//            ? res_dt.msg[0].branch_id : null);
//         }

//         res.send({ suc: 1, msg: "Data fetched successfully", details: unapprovedDetails.filter(item => item !== null) });
//         // console.log(unapprovedDetails,'deta');
        
//       } else {
//         res.send({ suc: 0, msg: "No details provided" });
//       }
//     } catch (error) {
//       console.error(error);
//       res.send({ suc: 0, msg: "Error occurred", details: error });
//     }
//   }
// );

monthEndRouter.post("/fetch_unapproved_dtls_before_monthend", async (req, res) => {
  var data = req.body;

  try {
    if (data.month_end_dtls && data.month_end_dtls.length > 0) {
      let unapprovedDetails = [];
      let allApproved = true;

      for (let dt of data.month_end_dtls) {
        var select = "branch_id, COUNT(*) as tot_unapprove",
          table_name = "td_loan_transactions",
          whr = `branch_id = '${dt.branch_code}'
                 AND tr_type != 'I'
                 AND status = 'U'`,
          order = "GROUP BY branch_id";

        var res_dt = await db_Select(select, table_name, whr, order);

        if (res_dt.suc > 0 && res_dt.msg.length > 0) {
          let record = res_dt.msg[0];
          if (parseInt(record.tot_unapprove) > 0) {
            allApproved = false;
            unapprovedDetails.push({
              branch_id: record.branch_id,
              unapproved_count: record.tot_unapprove
            });
          }else {
            allApproved = true;
          }
        }
      }

      res.send({
        suc: 1,
        msg: "Data fetched successfully",
        details: unapprovedDetails
        // can_month_end: allApproved
      });

    } else {
      res.send({ suc: 0, msg: "No details provided" });
    }
  } catch (error) {
    console.error(error);
    res.send({ suc: 0, msg: "Error occurred", details: error });
  }
});



module.exports = { monthEndRouter };
