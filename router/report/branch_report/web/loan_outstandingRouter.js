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
                "a.branch_code,a.group_code, d.group_name, a.member_code, b.client_name, a.loan_id, b.client_mobile, b.gurd_name, b.client_addr, b.aadhar_no, b.pan_no, b.acc_no, e.purpose_id, f.sub_purp_name, g.scheme_name, h.fund_name, a.applied_dt, a.applied_amt, a.disb_dt, a.prn_disb_amt, a.curr_roi, a.period, a.period_mode, a.instl_end_dt, a.tot_emi",
            table_name =
                "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_purpose e ON a.purpose = e.purp_id LEFT JOIN md_sub_purpose f ON a.sub_purpose = f.sub_purp_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_fund h ON a.fund_id = h.fund_id",
            whr = `a.branch_code = '${data.branch_code}' AND a.disb_dt <= '${data.os_dt}'`,
            order = `ORDER BY a.disb_dt LIMIT ${data.min},${data.max}`;

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
                    var balance = balanceData?.balance_dt?.balance || 0;
                    var od_balance = od_balanceData?.balance_dt?.od_balance || 0;
                    var intt_balance = intt_balanceData?.balance_dt?.intt_balance || 0;
                    var total_outstanding = (balance + od_balance + intt_balance);

                    // console.log(balance,od_balance,intt_balance,total_outstanding);
                    

                    // Collect all balances and push to the results array
                   if(total_outstanding > 0){
                    outstandingResults.push({
                        loan_id: loan_id,branch_code,group_code,group_name,member_code,client_name,disb_dt,
                        curr_roi,period,period_mode,tot_emi,instl_end_dt,balance,od_balance,intt_balance,total_outstanding
                        // balance: balanceData?.balance_dt?.balance || 0,
                        // od_balance: od_balanceData?.balance_dt?.od_balance || 0,
                        // intt_balance: intt_balanceData?.balance_dt?.intt_balance || 0,
                    });
                }else {

                }
                } catch (err) {
                    console.error(`Error fetching balance data for loan ID ${loan_id}:`, err);
                }
            }
            // res.setTimeout(10*1000)
            res.send({ suc: 1, msg: outstandingResults });
            // console.log(outstandingResults);
            
        } else {
            res.send({ suc: 0, msg: [] });
        }
    } catch (error) {
        console.error("Error fetching loan outstanding report:", error);
        res.status(500).send({ suc: 0, msg: "An error occurred" });
    }
});

loan_outstandingRouter.post("/loan_outstanding_report_groupwise", async (req, res) => {
    try {
        var data = req.body;

        // Fetch outstanding details group-wise
        var select =
                "a.branch_code,a.group_code, d.group_name, d.created_by co_code, i.emp_name co_name, a.member_code, b.client_name, a.loan_id, b.client_mobile, b.gurd_name, b.client_addr, b.aadhar_no, b.pan_no, b.acc_no, e.purpose_id, f.sub_purp_name, g.scheme_name, h.fund_name, a.applied_dt, a.applied_amt, a.disb_dt, a.prn_disb_amt, a.curr_roi,a.period, a.period_mode, a.instl_start_dt,a.instl_end_dt, a.tot_emi",
            table_name =
                "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_purpose e ON a.purpose = e.purp_id LEFT JOIN md_sub_purpose f ON a.sub_purpose = f.sub_purp_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_fund h ON a.fund_id = h.fund_id LEFT JOIN md_employee i ON d.created_by = i.emp_id",
            whr = `a.branch_code = '${data.branch_code}' AND a.disb_dt <= '${data.os_dt}'`,
            order = `ORDER BY a.disb_dt LIMIT ${data.min},${data.max}`;

        var loanOutstandingData_grp = await db_Select(select, table_name, whr, order);

        if (loanOutstandingData_grp.suc > 0 && loanOutstandingData_grp.msg.length > 0) {
            var groupwiseBalance = {};
        
            for (let dt of loanOutstandingData_grp.msg) {
                try {
                    var loan_id = dt.loan_id;
                    
                    // Fetch balances for the current loan
                    var balanceData = await loan_balance_outstanding(loan_id, data.os_dt);
                    var od_balanceData = await loan_od_balance_outstanding(loan_id, data.os_dt);
                    var intt_balanceData = await loan_intt_balance_outstanding(loan_id, data.os_dt);
        
                    // Extract details from the record
                    var branch_code = dt.branch_code;
                    var group_code = dt.group_code;
                    var group_name = dt.group_name;
                    var co_name = dt.emp_name;
                    var purpose_name = dt.purpose_id;
                    var sub_purp_name = dt.sub_purp_name;
                    var scheme_name = dt.scheme_name;
                    var fund_name = dt.fund_name;
                    var applied_dt = `${dateFormat(dt.applied_dt, "yyyy-mm-dd")}`;
                    var applied_amt = dt.applied_amt;
                    var disb_dt = `${dateFormat(dt.disb_dt, "yyyy-mm-dd")}`;
                    var prn_disb_amt = dt.prn_disb_amt;
                    var curr_roi = dt.curr_roi;
                    var period = dt.period;
                    var period_mode = dt.period_mode;
                    var tot_emi = dt.tot_emi;
                    var instl_start_dt = dt.instl_start_dt;
                    var instl_end_dt = dt.instl_end_dt;
        
                    // Use `group_code` as the key to group balances
                    if (!groupwiseBalance[group_code]) {
                        groupwiseBalance[group_code] = {
                            branch_code,
                            loan_id,
                            group_code,
                            group_name,
                            co_name,purpose_name,sub_purp_name,scheme_name,fund_name,
                            applied_dt,applied_amt,prn_disb_amt,
                            disb_dt,
                            curr_roi,
                            instl_start_dt,
                            period,
                            period_mode,
                            tot_emi,
                            instl_end_dt,
                            total_balance: 0,
                            total_od_balance: 0,
                            total_intt_balance: 0,
                        };
                    }
        
                    // Update group totals
                    groupwiseBalance[group_code].total_balance += balanceData?.balance_dt?.balance || 0;
                    groupwiseBalance[group_code].total_od_balance += od_balanceData?.balance_dt?.od_balance || 0;
                    groupwiseBalance[group_code].total_intt_balance += intt_balanceData?.balance_dt?.intt_balance || 0;
        
                    // Add individual loan details to `members` array
                    groupwiseBalance[group_code].members.push({
                        balance: balanceData?.balance_dt?.balance || 0,
                        od_balance: od_balanceData?.balance_dt?.od_balance || 0,
                        intt_balance: intt_balanceData?.balance_dt?.intt_balance || 0,
                    });
                } catch (err) {
                    // console.error(`Error fetching balance data for loan ID ${loan_id}:`, err);
                }
            }
        
            // Convert groupwiseBalance object to an array format if needed
            var groupwiseResults = Object.keys(groupwiseBalance).map((key) => groupwiseBalance[key]);
        
            res.setTimeout(10 * 1000);
            res.send({ suc: 1, msg: groupwiseResults });
        } else {
            res.send({ suc: 0, msg: [] });
        }
    } catch (error) {
        console.error("Error fetching loan outstanding report:", error);
        res.status(500).send({ suc: 0, msg: "An error occurred" });
    }
}); 

module.exports = {loan_outstandingRouter}