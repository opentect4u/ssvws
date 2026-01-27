const actLocLogRouter = require('express').Router();
const { getAttendanceDetailsByDate } = require('../../modules/api/attendance_module/attendanceModule');
const fs = require("fs");
const path = require("path");

actLocLogRouter.post("/", async (req, res) => {
    const data = req.body;
    let save_loc_acc_dt
    await getAttendanceDetailsByDate(data.emp_id, data.act_dt).then(resDt => {
        if (resDt.suc > 0 && resDt.msg.length > 0) {
            const locationPathName = resDt.msg[0].location_acc_save_file_path;
            const filePath = path.join(__dirname, `../../${locationPathName}`);
            const fileData = fs.readFileSync(filePath, "utf-8");
            let locations = JSON.parse(fileData);

            locations.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            save_loc_acc_dt = { suc: 1, msg: locations };
        } else {
            save_loc_acc_dt = { suc: 1, msg: [] };
        }
    }).catch(err => {
        console.log(err);
        save_loc_acc_dt = { suc: 0, msg: [], err }
    }).finally(() => {
        res.send(save_loc_acc_dt)
    })
})

module.exports = { actLocLogRouter };