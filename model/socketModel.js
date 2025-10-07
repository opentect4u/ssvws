const { Server } = require("socket.io");
const { startOutStandRepoConsumer, startMonthEndProcessConsumer, startLoanTrnsRepoProcessConsumer, startOverdueRepoProcessConsumer } = require("./queue/consumer");
let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            // origin: "http://localhost:3000",
            origin: "https://ssvws.opentech4u.co.in",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            socket.join(`user-${userId}`);
            console.log(`User ${userId} joined room user-${userId}`);
        }
        // console.log(`User connected: ${userId}`);

        socket.on("initiate-outstanging-report", (data) => {
            // console.log("Initiating outstanding report for user:");
            startOutStandRepoConsumer(io)
        })

        socket.on("month_end_process", async (data) => {
            // console.log("Initiating Month End Process for user:");
            // console.log(data, 'data');
            await startMonthEndProcessConsumer(io, userId);
            // startMonthEndProcessConsumer(io)
        })

         socket.on("loan_trns_repo_process", async (data) => {
            // console.log("Initiating Loan Transaction Report Process for user:");
            // console.log(data, 'data');
            await startLoanTrnsRepoProcessConsumer(io, userId);
            // startMonthEndProcessConsumer(io)
        })

        socket.on("loan_overdue_repo_process", async (data) => {
            // console.log("Initiating Loan Transaction Report Process for user:");
            // console.log(data, 'data');
            await startOverdueRepoProcessConsumer(io, userId);
            // startMonthEndProcessConsumer(io)
        })
    });


    io.on("disconnect", (socket) => {
        const userId = socket.handshake.query.userId;
        // console.log(`User disconnected: ${userId}`);
    });
}

function getIO() {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}

const sendOutSReportSocket = (userId, data) => {
    // console.log("Sending report data to socket:", data);
    // console.log(io, 'io');
    
    
    // if (!io) throw new Error("Socket.io not initialized");
    // logger.info("Sending report data to socket:", data);
    // io.to(`user-${userId}`).emit("report-done", {
    //     message: data.suc > 0 ? "Your report is ready!" : "Something went wrong!",
    //     data: data
    // });
}

module.exports = { initSocket, getIO, sendOutSReportSocket };