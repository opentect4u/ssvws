const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_outstandingRouter = express.Router(),
dateFormat = require('dateformat');

loan_outstandingRouter.post("/loan_outstanding_report", async (req, res) => {
    try {
    var data = req.body;
    console.log(data,'data');
    

    //FETCH OUTSTANDING DETAILS MEMBER WISE
    var select = "a.group_code,d.group_name,a.member_code,b.client_name,a.loan_id,b.client_mobile,b.gurd_name,b.client_addr,b.aadhar_no,b.pan_no,b.acc_no,e.purpose_id,f.sub_purp_name,g.scheme_name,h.fund_name,a.applied_dt,a.applied_amt,a.disb_dt,a.prn_disb_amt,a.curr_roi,a.period_mode,a.instl_end_dt",
    table_name = "td_loan a LEFT JOIN md_member b ON a.member_code = b.member_code LEFT JOIN md_group d ON a.group_code = d.group_code LEFT JOIN md_purpose e ON a.purpose = e.purp_id LEFT JOIN md_sub_purpose f ON a.sub_purpose = f.sub_purp_id LEFT JOIN md_scheme g ON a.scheme_id = g.scheme_id LEFT JOIN md_fund h ON a.fund_id = h.fund_id",
    whr = `a.branch_code = '${data.branch_code}' AND a.disb_dt <= '${data.os_dt}' AND a.outstanding > 0`,
    order = null;
    var loan_outstanding_dt = await db_Select(select,table_name,whr,order); 
    console.log(loan_outstanding_dt,'lolo');
     

    if(loan_outstanding_dt.suc > 0 && loan_outstanding_dt.msg.length > 0){
        var detailsoutstanding = [];
        for (let dt of loan_outstanding_dt.msg) {
            console.log(dt,'dt');
            

                        var loan_id = dt.loan_id;
        
                        // Calculate balance
                        var select = "balance,od_balance,intt_balance";
                        table_name = "td_loan_transactions";
                        whr = `loan_id = '${loan_id}' AND tr_type = 'R'
                                            AND payment_date = (SELECT MAX(payment_date)
                                                            FROM td_loan_transactions
                                                            WHERE loan_id = '${loan_id}' 
                                                            AND payment_date <= '${data.os_dt}'
                                                            AND tr_type = 'R')`;
                        var details = await db_Select(select, table_name, whr, null);

                        if(details.suc > 0 && details.msg.length > 0){
                            detailsoutstanding.push({ loan_id, details });
                
                        }
        }
        res.send({ suc: 1, msg: detailsoutstanding });
    }else {
        res.send({ suc: 0, msg: [] });
    }
        } catch (error) {
    console.error(error);
    res.status(500).send({ suc: 0, msg: "An error occurred" });
    }
    });

module.exports = {loan_outstandingRouter}