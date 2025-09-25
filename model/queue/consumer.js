const amqp = require("amqplib");
const { db_Delete, db_Select } = require("../mysqlModel"),
dateFormat = require("dateformat");

async function startOutStandRepoConsumer(io) {
    // const conn = await amqp.connect("amqp://localhost");
    const conn = await amqp.connect("amqp://subham:Samanta%53421d@localhost");
    const channel = await conn.createChannel();
    await channel.assertQueue("report_jobs", { durable: true });
    // console.log("Consumer is waiting for messages...");

    channel.consume("report_jobs", async (msg) => {
        if (msg !== null) {
            const job = JSON.parse(msg.content.toString());
            // console.log("Received job:", job);

            try {
                // await runReportProcedure(job.userId, job.dateRange);
                var data = job, insert_outstanding_data = { suc: 0, msg: '' };
                // console.log(data,'juju');


                if (!data.branches || !Array.isArray(data.branches) || data.branches.length === 0) {
                    return res.send({ suc: 0, msg: "Invalid input data" });
                }

                //Delete existing data against branch_code
                const branchCodes = data.branches.map(b => `'${b.branch_code}'`).join(",");
                var delete_data = await db_Delete('tt_loan_outstanding', null);

                //Call procedure in a loop for each branch_code
                for (let dt of data.branches) {
                    insert_outstanding_data = await db_Select(null, null, null, null, true, `CALL p_loan_out_standing('${dt.branch_code}','${data.from_dt}')`);
                    // console.log(insert_outstanding_data, 'insert_outstanding_data');
                    
                }

                var outstanding_data = await db_Select(null, null, null, null, true, `SELECT * FROM tt_loan_outstanding`);

                io.to(`user-${job.userId}`).emit("report-done", {
                    message: outstanding_data.suc > 0 ? "Your report is ready!" : "Something went wrong!",
                    data: JSON.stringify(outstanding_data),
                    err: ''
                });
                channel.ack(msg);
            } catch (err) {
                console.error("Error processing report:", err);
                channel.nack(msg);
                io.to(`user-${job.userId}`).emit("report-done", {
                    message: "Something went wrong!",
                    data: JSON.stringify({suc: 0, msg: []}),
                    err: err
                });
            }
        }
    });
}

async function startMonthEndProcessConsumer(io, userId) {
    // const conn = await amqp.connect("amqp://localhost");
    const conn = await amqp.connect("amqp://subham:Samanta%53421d@localhost");
    const channel = await conn.createChannel();
    await channel.assertQueue("month_end_jobs", { durable: true });
    // console.log("Consumer is waiting for messages...");

    channel.consume("month_end_jobs", async (msg) => {
        if (msg !== null) {
            const job = JSON.parse(msg.content.toString());
            // console.log("Received job:", job);

            try {
                // await runReportProcedure(job.userId, job.dateRange);
                var data = job, jobStatus = [];
                if (!data.month_end_dt) {
                    return io.to(`user-${userId}`).emit("receive_notification", {
                        suc: 0,
                        msg: "Invalid input data",
                        err: true
                    });
                }
                
                if(Array.isArray(data.month_end_dt)){
                    for (let dt of data.month_end_dt) {
                        // console.log(dt,'lolo');
                        
                        var pocRes = await db_Select(null, null, null, null, true, `CALL p_pop_od('${dateFormat(new Date(dt.closed_upto), "yyyy-mm-dd")}', ${+dt.branch_code})`);
                        jobStatus.push({
                            branch_code: dt.branch_code,
                            res: pocRes
                        })
                        // console.log(pocRes, 'poc status');
                    }
                }else{
                    return io.to(`user-${userId}`).emit("receive_notification", {
                        suc: 0,
                        msg: "Invalid input data",
                        err: true
                    });
                }
                
                io.to(`user-${userId}`).emit("receive_notification", {
                    message: jobStatus.length > 0 ? "Month End Process Completed!" : "Something went wrong!",
                    err: false,
                    msg: jobStatus
                });
                channel.ack(msg);
            } catch (err) {
                console.error("Error processing report:", err);
                channel.nack(msg);
                io.to(`user-${userId}`).emit("receive_notification", {
                    suc: 0,
                    msg: "Error occurred",
                    err: err
                });
            }
        }
    });
}

async function getgroupwiseReport(data) {
  let select, table_name, whr, order, transaction_group_data;

  if(data.tr_type === 'D'){
    select = `a.payment_date,b.branch_code,e.branch_name,b.group_code,c.group_name,f.bank_name,f.branch_name  bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name co_name,SUM(a.debit) AS debit,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON  b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_branch e ON b.branch_code = e.branch_code LEFT JOIN md_bank f ON c.bank_name = f.bank_code",
    whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
           AND a.tr_type = '${data.tr_type}'`,
    order = `GROUP BY b.branch_code,e.branch_name,a.payment_date,b.group_code,c.group_name,f.bank_name,f.branch_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name
             ORDER BY a.payment_date`;
    transaction_group_data = await db_Select(select,table_name,whr,order);
    }else if (data.tr_type === 'R'){
     select = `a.payment_date,b.branch_code,e.branch_name,b.group_code,c.group_name,f.bank_name,f.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name co_name,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON  b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_branch e ON b.branch_code = e.branch_code LEFT JOIN md_bank f ON c.bank_name = f.bank_code",
    whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
           AND a.tr_type = '${data.tr_type}'`,
    order = `GROUP BY b.branch_code,e.branch_name,a.payment_date,b.group_code,c.group_name,f.bank_name,f.branch_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name
             ORDER BY a.payment_date`;
    transaction_group_data = await db_Select(select,table_name,whr,order);
    }else {
    select = `a.payment_date,b.branch_code,e.branch_name,b.group_code,c.group_name,f.bank_name,f.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name co_name,SUM(a.debit) AS debit,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,
      (
                SELECT SUM(prn_amt + od_prn_amt + intt_amt)
                FROM td_loan a
                WHERE a.group_code = b.group_code
              ) AS curr_balance`
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON  b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_branch e ON b.branch_code = e.branch_code LEFT JOIN md_bank f ON c.bank_name = f.bank_code",
    whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type IN ('D','R')`,
    order = `GROUP BY b.branch_code,e.branch_name,a.payment_date,b.group_code,c.group_name,f.bank_name,f.branch_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name
             ORDER BY a.payment_date`;
    transaction_group_data = await db_Select(select,table_name,whr,order);
    }

    return transaction_group_data;
}


async function getmemberwiseReport(data) {
  let select, table_name, whr, order, transaction_member_data;

  if(data.tr_type === 'D'){
      select = `a.payment_date,b.branch_code,i.branch_name,b.loan_id,b.member_code,e.client_name,b.group_code,c.group_name,j.bank_name,j.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name,b.scheme_id,f.scheme_name,a.debit AS debit,(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance,a.created_by created_code,a.created_at,g.emp_name created_by,a.approved_by approved_code,h.emp_name approved_by,a.approved_at`,
      table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code LEFT JOIN md_scheme f ON b.scheme_id = f.scheme_id LEFT JOIN md_employee g ON a.created_by = g.emp_id LEFT JOIN md_employee h ON a.approved_by = h.emp_id LEFT JOIN md_branch i ON b.branch_code = i.branch_code LEFT JOIN md_bank j ON c.bank_name = j.bank_code",
      whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
      order = `ORDER BY a.payment_date`;
      transaction_member_data = await db_Select(select,table_name,whr,order);
      }else if (data.tr_type === 'R'){
      select = `a.payment_date,b.branch_code,i.branch_name,b.loan_id,b.member_code,e.client_name,b.group_code,c.group_name,j.bank_name,j.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name,b.scheme_id,f.scheme_name,a.credit AS credit,a.prn_recov AS prn_recov,a.intt_recov AS intt_recov,(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance,a.created_by created_code,a.created_at,g.emp_name created_by,a.approved_by approved_code,h.emp_name approved_by,a.approved_at`,
      table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code LEFT JOIN md_scheme f ON b.scheme_id = f.scheme_id LEFT JOIN md_employee g ON a.created_by = g.emp_id LEFT JOIN md_employee h ON a.approved_by = h.emp_id LEFT JOIN md_branch i ON b.branch_code = i.branch_code LEFT JOIN md_bank j ON c.bank_name = j.bank_code",
      whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
      order = `ORDER BY a.payment_date`;
      transaction_member_data = await db_Select(select,table_name,whr,order);
      }else {
      select = `a.payment_date,b.branch_code,i.branch_name,b.loan_id,b.member_code,e.client_name,b.group_code,c.group_name,j.bank_name,j.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name,b.scheme_id,f.scheme_name,a.debit AS debit,a.credit AS credit,a.prn_recov AS prn_recov,a.intt_recov AS intt_recov,(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance,a.created_by created_code,a.created_at,g.emp_name created_by,a.approved_by approved_code,h.emp_name approved_by,a.approved_at`,
      table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_member e ON b.member_code = e.member_code LEFT JOIN md_scheme f ON b.scheme_id = f.scheme_id LEFT JOIN md_employee g ON a.created_by = g.emp_id LEFT JOIN md_employee h ON a.approved_by = h.emp_id LEFT JOIN md_branch i ON b.branch_code = i.branch_code LEFT JOIN md_bank j ON c.bank_name = j.bank_code",
      whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type IN ('D','R')`,
      order = `ORDER BY a.payment_date`;
      transaction_member_data = await db_Select(select,table_name,whr,order);
      }

    return transaction_group_data;
}


async function getfundwiseReport(data) {
  let select, table_name, whr, order, transaction_fund_data;

  if(data.tr_type === 'D'){
    select = `a.payment_date,b.branch_code,f.branch_name,b.group_code,c.group_name,g.bank_name,g.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name co_name,b.fund_id,e.fund_name,SUM(a.debit) AS debit,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON  b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_fund e ON b.fund_id = e.fund_id LEFT JOIN md_branch f ON b.branch_code = f.branch_code LEFT JOIN md_bank g ON c.bank_name = g.bank_code",
    whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
           AND b.fund_id IN (${data.fund_id}) AND a.tr_type = '${data.tr_type}'`,
    order = `GROUP BY b.branch_code,f.branch_name,a.payment_date,b.group_code,c.group_name,b.fund_id,e.fund_name,g.bank_name,g.branch_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name
             ORDER BY a.payment_date`;
    transaction_fund_data = await db_Select(select,table_name,whr,order);
    }else if(data.tr_type === 'R'){
     select = `a.payment_date,b.branch_code,f.branch_name,b.group_code,c.group_name,g.bank_name,g.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name co_name,b.fund_id,e.fund_name,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON  b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_fund e ON b.fund_id = e.fund_id LEFT JOIN md_branch f ON b.branch_code = f.branch_code LEFT JOIN md_bank g ON c.bank_name = g.bank_code",
    whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
           AND b.fund_id IN (${data.fund_id}) AND a.tr_type = '${data.tr_type}'`,
    order = `GROUP BY b.branch_code,f.branch_name,a.payment_date,b.group_code,c.group_name,b.fund_id,e.fund_name,g.bank_name,g.branch_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name
             ORDER BY a.payment_date`;
    transaction_fund_data = await db_Select(select,table_name,whr,order);
    }else {
     select = `a.payment_date,b.branch_code,f.branch_name,b.group_code,c.group_name,g.bank_name,g.branch_name bank_branch_name,c.acc_no1 sb_account,c.acc_no2 loan_account,c.grp_addr,c.co_id,d.emp_name co_name,b.fund_id,e.fund_name,SUM(a.debit) AS debit,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,(
                SELECT SUM(prn_amt + od_prn_amt + intt_amt)
                FROM td_loan a
                WHERE a.group_code = b.group_code
              ) AS curr_balance`,
    table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON  b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_fund e ON b.fund_id = e.fund_id LEFT JOIN md_branch f ON b.branch_code = f.branch_code LEFT JOIN md_bank g ON c.bank_name = g.bank_code",
    whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
           AND b.fund_id IN (${data.fund_id}) AND a.tr_type IN ('D','R')`,
    order = `GROUP BY b.branch_code,f.branch_name,a.payment_date,b.group_code,c.group_name,b.fund_id,e.fund_name,g.bank_name,g.branch_name,c.acc_no1,c.acc_no2,c.grp_addr,c.co_id,d.emp_name
             ORDER BY a.payment_date`;
    transaction_fund_data = await db_Select(select,table_name,whr,order);
    }

    return transaction_fund_data;
}


async function getcowiseReport(data) {
  let select, table_name, whr, order, transaction_co_data;

  if(data.tr_type === 'D'){
      select = `a.payment_date,b.branch_code,f.branch_name,c.co_id,d.emp_name co_name,COUNT(DISTINCT c.group_code) AS total_group,COUNT(b.member_code) AS total_member,b.fund_id,e.fund_name,SUM(a.debit) AS debit,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
      table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_fund e ON b.fund_id = e.fund_id LEFT JOIN md_branch f ON b.branch_code = f.branch_code",
      whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
             AND c.co_id IN (${data.co_id}) AND a.tr_type = '${data.tr_type}'`,
      order = `GROUP BY b.branch_code,f.branch_name,a.payment_date,c.co_id,d.emp_name,b.fund_id,e.fund_name
               ORDER BY a.payment_date`;
    transaction_co_data = await db_Select(select,table_name,whr,order);
    }else if (data.tr_type === 'R'){
     select = `a.payment_date,b.branch_code,f.branch_name,c.co_id,d.emp_name co_name,COUNT(DISTINCT c.group_code) AS total_group,COUNT(b.member_code) AS total_member,b.fund_id,e.fund_name,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
      table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_fund e ON b.fund_id = e.fund_id LEFT JOIN md_branch f ON b.branch_code = f.branch_code",
      whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
             AND c.co_id IN (${data.co_id}) AND a.tr_type = '${data.tr_type}'`,
      order = `GROUP BY b.branch_code,f.branch_name,a.payment_date,c.co_id,d.emp_name,b.fund_id,e.fund_name
               ORDER BY a.payment_date`;
    transaction_co_data = await db_Select(select,table_name,whr,order);
    }else {
      select = `a.payment_date,b.branch_code,f.branch_name,c.co_id,d.emp_name co_name,COUNT(DISTINCT c.group_code) AS total_group,COUNT(b.member_code) AS total_member,b.fund_id,e.fund_name,SUM(a.debit) AS debit,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,(
                SELECT SUM(prn_amt + od_prn_amt + intt_amt)
                FROM td_loan a
                WHERE a.group_code = b.group_code
              ) AS curr_balance`,
      table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_group c ON b.group_code = c.group_code LEFT JOIN md_employee d ON c.co_id = d.emp_id LEFT JOIN md_fund e ON b.fund_id = e.fund_id LEFT JOIN md_branch f ON b.branch_code = f.branch_code",
      whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}'
             AND c.co_id IN (${data.co_id}) AND a.tr_type IN ('D','R')`,
      order = `GROUP BY b.branch_code,f.branch_name,a.payment_date,c.co_id,d.emp_name,b.fund_id,e.fund_name
               ORDER BY a.payment_date`;
    transaction_co_data = await db_Select(select,table_name,whr,order);
    }   

    return transaction_co_data; 
}

async function getbranchwiseReport(data) {
  let select, table_name, whr, order, transaction_branch_data;

 if(data.tr_type === 'D'){
      select = `a.branch_id,c.branch_name,SUM(a.debit) AS debit,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
      table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_id = c.branch_code",
      whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
      order = `GROUP BY a.branch_id,c.branch_name`;
      transaction_branch_data = await db_Select(select,table_name,whr,order);
      }else if (data.tr_type === 'R'){
      select = `a.branch_id,c.branch_name,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,SUM(b.prn_amt + b.od_prn_amt + b.intt_amt)curr_balance`,
      table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_id = c.branch_code",
      whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type = '${data.tr_type}'`,
      order = `GROUP BY a.branch_id,c.branch_name`;
      transaction_branch_data = await db_Select(select,table_name,whr,order);
      }else {
       select = `a.branch_id,c.branch_name,SUM(a.debit) AS debit,SUM(a.credit) AS credit,SUM(a.prn_recov) AS prn_recov,SUM(a.intt_recov) AS intt_recov,
      (
                SELECT SUM(prn_amt + od_prn_amt + intt_amt)
                FROM td_loan a
                WHERE a.group_code = b.group_code
              ) AS curr_balance`,
      table_name = "td_loan_transactions a LEFT JOIN td_loan b ON a.loan_id = b.loan_id LEFT JOIN md_branch c ON a.branch_id = c.branch_code",
      whr = `a.branch_id IN (${data.branch_code}) AND a.payment_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.tr_type IN ('D','R')`,
      order = `GROUP BY a.branch_id,c.branch_name`;
      transaction_branch_data = await db_Select(select,table_name,whr,order);
      }

    return transaction_branch_data; 
}


async function startLoanTrnsRepoProcessConsumer(io, userId) {
    const conn = await amqp.connect("amqp://localhost");
    const channel = await conn.createChannel();
    await channel.assertQueue("loan_trns_jobs", { durable: true });
    // console.log("Consumer is waiting for messages...");

    channel.consume("loan_trns_jobs", async (msg) => {
        if (msg !== null) {
            const job = JSON.parse(msg.content.toString());
            // console.log("Received job:", job);

            try {
                // await runReportProcedure(job.userId, job.dateRange);
                var data = job, transaction_group_data;
                if (!data.branch_code) {
                    return io.to(`user-${userId}`).emit("loan_tns_repo_notification", {
                        suc: 0,
                        msg: "Invalid input data",
                        err: true
                    });
                }

                let reportData;
                switch (data.flag) {   
                case "F":
                  reportData = await getfundwiseReport(data);
                  break;
                case "C":
                  reportData = await getcowiseReport(data);
                  break;
                case "M":
                  reportData = await getmemberwiseReport(data);
                  break;
                case "G":
                  reportData = await getgroupwiseReport(data);
                  break;
                case "B":
                  reportData = await getbranchwiseReport(data);
                  break;
                default:
                reportData = { suc: 0, msg: "Invalid report type" };
              }

                io.to(`user-${userId}`).emit("loan_tns_repo_notification", {
                    message: reportData.suc > 0 ? "Loan Transaction Report generated successfull!" : "Something went wrong!",
                    err: false,
                    msg: reportData,
                    req_data: data
                });
                channel.ack(msg);
            } catch (err) {
                console.error("Error processing report:", err);
                channel.nack(msg);
                io.to(`user-${userId}`).emit("loan_tns_repo_notification", {
                    suc: 0,
                    msg: "Error occurred",
                    err: err
                });
            }
        }
    });
}

async function startOverdueRepoProcessConsumer(io, userId) {
    // const conn = await amqp.connect("amqp://localhost");
    const conn = await amqp.connect("amqp://subham:Samanta%53421d@localhost");
    const channel = await conn.createChannel();
    await channel.assertQueue("loan_overdue_jobs", { durable: true });
    // console.log("Consumer is waiting for messages...");

    channel.consume("loan_overdue_jobs", async (msg) => {
        if (msg !== null) {
            const job = JSON.parse(msg.content.toString());
            // console.log("Received job:", job);

            try {
                // await runReportProcedure(job.userId, job.dateRange);
                var data = job, transaction_group_data;
                if (!data.branch_code) {
                    return io.to(`user-${userId}`).emit("loan_overdue_repo_notification", {
                        suc: 0,
                        msg: "Invalid input data",
                        err: true
                    });
                }

                let reportData;
                switch (data.flag) {   
                case "F":
                //   reportData = await getfundwiseReport(data);
                  break;
                case "C":
                //   reportData = await getcowiseReport(data);
                  break;
                case "M":
                //   reportData = await getmemberwiseReport(data);
                  break;
                case "G":
                //   reportData = await getgroupwiseReport(data);
                  break;
                case "B":
                //   reportData = await getbranchwiseReport(data);
                  break;
                default:
                // reportData = { suc: 0, msg: "Invalid report type" };
              }

                io.to(`user-${userId}`).emit("loan_overdue_repo_notification", {
                    message: reportData.suc > 0 ? "Loan Overdue Report generated successfull!" : "Something went wrong!",
                    err: false,
                    msg: reportData,
                    req_data: data
                });
                channel.ack(msg);
            } catch (err) {
                console.error("Error processing report:", err);
                channel.nack(msg);
                io.to(`user-${userId}`).emit("loan_overdue_repo_notification", {
                    suc: 0,
                    msg: "Error occurred",
                    err: err
                });
            }
        }
    });
}

module.exports = { startOutStandRepoConsumer, startMonthEndProcessConsumer, startLoanTrnsRepoProcessConsumer, getgroupwiseReport, getmemberwiseReport, getfundwiseReport, getcowiseReport, getbranchwiseReport, startOverdueRepoProcessConsumer };