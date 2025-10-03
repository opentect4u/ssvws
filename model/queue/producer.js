const amqp = require("amqplib");

async function publishReportJob(data) {
    // const conn = await amqp.connect("amqp://localhost");
    // const conn = await amqp.connect("amqp://subham:Samanta%53421d@localhost");
    const conn = await amqp.connect("amqp://ssspl:Sign%232025@localhost");
    const channel = await conn.createChannel();
    await channel.assertQueue("report_jobs", { durable: true });
    channel.sendToQueue("report_jobs", Buffer.from(JSON.stringify(data)), {
        persistent: true
    });
    setTimeout(() => {
        channel.close()
        conn.close()
    }, 500);
}

async function publishMonthEndJob(data) {
    // const conn = await amqp.connect("amqp://localhost");
    // const conn = await amqp.connect("amqp://subham:Samanta%53421d@localhost");
    const conn = await amqp.connect("amqp://ssspl:Sign%232025@localhost");
    const channel = await conn.createChannel();
    await channel.assertQueue("month_end_jobs", { durable: true });
    channel.sendToQueue("month_end_jobs", Buffer.from(JSON.stringify(data)), {
        persistent: true
    });
    setTimeout(() => {
        channel.close()
        conn.close()
    }, 500);
}

async function publishLoanTrnsRepoJob(data) {
    // const conn = await amqp.connect("amqp://localhost");
    // const conn = await amqp.connect("amqp://subham:Samanta%53421d@localhost");
    const conn = await amqp.connect("amqp://ssspl:Sign%232025@localhost");
    const channel = await conn.createChannel();
    await channel.assertQueue("loan_trns_jobs", { durable: true });
    channel.sendToQueue("loan_trns_jobs", Buffer.from(JSON.stringify(data)), {
        persistent: true
    });
    setTimeout(() => {
        channel.close()
        conn.close()
    }, 500);
}

async function publishOverdueRepoJob(data) {
    // const conn = await amqp.connect("amqp://localhost");
    // const conn = await amqp.connect("amqp://subham:Samanta%53421d@localhost");
    const conn = await amqp.connect("amqp://ssspl:Sign%232025@localhost");
    const channel = await conn.createChannel();
    await channel.assertQueue("loan_overdue_jobs", { durable: true });
    channel.sendToQueue("loan_overdue_jobs", Buffer.from(JSON.stringify(data)), {
        persistent: true
    });
    setTimeout(() => {
        channel.close()
        conn.close()
    }, 500);
}

module.exports = { publishReportJob, publishMonthEndJob, publishLoanTrnsRepoJob, publishOverdueRepoJob };