const amqp = require("amqplib");
const { db_Delete, db_Select } = require("../mysqlModel"),
dateFormat = require("dateformat");

async function startOutStandRepoConsumer(io) {
    // const conn = await amqp.connect("amqp://localhost");
    const conn = await amqp.connect("amqp://subham:Samanta%53421d@localhost");
    const channel = await conn.createChannel();
    await channel.assertQueue("report_jobs", { durable: true });
    console.log("Consumer is waiting for messages...");

    channel.consume("report_jobs", async (msg) => {
        if (msg !== null) {
            const job = JSON.parse(msg.content.toString());
            console.log("Received job:", job);

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
                    console.log(insert_outstanding_data, 'insert_outstanding_data');
                    
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
    console.log("Consumer is waiting for messages...");

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

module.exports = { startOutStandRepoConsumer, startMonthEndProcessConsumer };