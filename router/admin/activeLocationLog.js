const actLocLogRouter = require('express').Router();
const { getAttendanceDetailsByDate } = require('../../modules/api/attendance_module/attendanceModule');
const fs = require("fs");
const path = require("path");
const { db_Select } = require('../../model/mysqlModel');

// actLocLogRouter.post("/", async (req, res) => {
//     const data = req.body;
//     let save_loc_acc_dt
//     await getAttendanceDetailsByDate(data.emp_id, data.act_dt).then(resDt => {
//         if (resDt.suc > 0 && resDt.msg.length > 0) {
//             const locationPathName = resDt.msg[0].location_acc_save_file_path;
//             const filePath = path.join(__dirname, `../../${locationPathName}`);
//             const fileData = fs.readFileSync(filePath, "utf-8");
//             let locations = JSON.parse(fileData);

//             locations.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//             save_loc_acc_dt = { suc: 1, msg: locations };
//         } else {
//             save_loc_acc_dt = { suc: 1, msg: [] };
//         }
//     }).catch(err => {
//         console.log(err);
//         save_loc_acc_dt = { suc: 0, msg: [], err }
//     }).finally(() => {
//         res.send(save_loc_acc_dt)
//     })
// });

actLocLogRouter.post("/", async (req, res) => {

    try {
        const data = req.body;
        // console.log(data, 'ddd');

        // ================= FETCH LOCATION DATA =================
        let select = `sl_no,branch_code,DATE_FORMAT(datetime_plot,'%Y-%m-%d %H:%i:%s') AS datetime_plot,opt_type,plot_lat,plot_long`;
        let table_name = `td_plot`;
        let whr = `branch_code = '${data.branch_code}' AND created_by = '${data.emp_id}'
            AND DATE(datetime_plot) = '${data.act_dt}'`;
        let order = `ORDER BY sl_no`;

        let locationData = await db_Select(select,table_name,whr,order);

        if (locationData.suc > 0 && locationData.msg.length > 0) {

            // ================= FORMAT LIKE OLD JSON =================
            let locations = locationData.msg.map(dt => ({
                sl_no: dt.sl_no,
                lat: dt.plot_lat,
                lng: dt.plot_long,
                datetime_plot: dt.datetime_plot,
                member_code: dt.member_code,
                opt_type: dt.opt_type
            }));

            res.send({
                suc: 1,
                msg: locations
            });

        } else {

            res.send({
                suc: 1,
                msg: []
            });

        }

    } catch (err) {

        console.log(err);

        res.send({
            suc: 0,
            msg: [],
            err
        });

    }

});

module.exports = { actLocLogRouter };