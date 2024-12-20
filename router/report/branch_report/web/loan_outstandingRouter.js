const { db_Select } = require('../../../../model/mysqlModel');
const { loan_balance_outstanding, loan_od_balance_outstanding, loan_intt_balance_outstanding } = require('../../../../modules/api/masterModule');

const express = require('express'),
loan_outstandingRouter = express.Router(),
dateFormat = require('dateformat');

loan_outstandingRouter.post("/loan_outstanding_report_memberwise", async (req, res) => {
    try {
        var data = req.body;

        // Fetch outstanding details member-wise
        var select =
                "a.branch_code,a.group_code, d.group_name, a.member_code, b.client_name, a.loan_id, b.client_mobile, b.gurd_name, b.client_addr, b.aadhar_no, b.pan_no, b.acc_no, e.purpose_id, f.sub_purp_name, g.scheme_name, h.fund_name, a.applied_dt, a.applied_amt, a.disb_dt, a.prn_disb_amt, a.curr_roi, a.period_mode, a.instl_end_dt, a.tot_emi",
            table_name =
                "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_purpose e ON a.purpose = e.purp_id LEFT JOIN md_sub_purpose f ON a.sub_purpose = f.sub_purp_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_fund h ON a.fund_id = h.fund_id",
            whr = `a.branch_code = '${data.branch_code}' AND a.disb_dt <= '${data.os_dt}'`,
            order = `LIMIT ${data.min},${data.max}`;

        var loanOutstandingData = await db_Select(select, table_name, whr, order);

        if (loanOutstandingData.suc > 0 && loanOutstandingData.msg.length > 0) {
            var outstandingResults = [];
            for (let dt of loanOutstandingData.msg) {
                try {
                    var loan_id = dt.loan_id;
                    var balanceData = await loan_balance_outstanding(loan_id, data.os_dt);
                    var od_balanceData = await loan_od_balance_outstanding(loan_id, data.os_dt);
                    var intt_balanceData = await loan_intt_balance_outstanding(loan_id, data.os_dt);
                    var branch_code = dt.branch_code;
                    var group_code = dt.group_code;
                    var group_name = dt.group_name;
                    var member_code = dt.member_code;
                    var client_name = dt.client_name;
                    var disb_dt = `${dateFormat(dt.disb_dt, "yyyy-mm-dd")}`;
                    var curr_roi = dt.curr_roi;
                    var period = dt.period;
                    var period_mode = dt.period_mode;
                    var tot_emi = dt.tot_emi;
                    var instl_end_dt = dt.instl_end_dt;

                    // Collect all balances and push to the results array
                    outstandingResults.push({
                        loan_id: loan_id,branch_code,group_code,group_name,member_code,client_name,disb_dt,
                        curr_roi,period,period_mode,tot_emi,instl_end_dt,
                        balance: balanceData?.balance_dt?.balance || 0,
                        od_balance: od_balanceData?.balance_dt?.od_balance || 0,
                        intt_balance: intt_balanceData?.balance_dt?.intt_balance || 0,
                    });
                } catch (err) {
                    console.error(`Error fetching balance data for loan ID ${loan_id}:`, err);
                }
            }
            res.setTimeout(10*1000)
            res.send({ suc: 1, msg: outstandingResults });
        } else {
            res.send({ suc: 0, msg: [] });
        }
    } catch (error) {
        console.error("Error fetching loan outstanding report:", error);
        res.status(500).send({ suc: 0, msg: "An error occurred" });
    }
});

  

module.exports = {loan_outstandingRouter}