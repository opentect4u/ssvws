const amqp = require("amqplib");

async function publishReportJob(data) {
    const conn = await amqp.connect("amqp://localhost");
    const channel = await conn.createChannel();
    await channel.assertQueue("report_jobs", { durable: true });
    channel.sendToQueue("report_jobs", Buffer.from(JSON.stringify(data)), {
        persistent: true
    });
    setTimeout(() => conn.close(), 500);
}

async function publishMonthEndJob(data) {
    const conn = await amqp.connect("amqp://localhost");
    const channel = await conn.createChannel();
    await channel.assertQueue("month_end_jobs", { durable: true });
    channel.sendToQueue("month_end_jobs", Buffer.from(JSON.stringify(data)), {
        persistent: true
    });
    setTimeout(() => conn.close(), 500);
}

module.exports = { publishReportJob, publishMonthEndJob };