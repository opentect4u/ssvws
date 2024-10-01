const { db_Insert } = require('../model/mysqlModel');

const LoginRouter = require('express').Router();
dateFormat = require('dateformat');
const bcrypt = require("bcrypt");

LoginRouter.get('/login', (req, res) => {
    res.render('login/login')
})

LoginRouter.post('/login', async (req, res) => {
    // var data = req.body,
    //     result;
    // const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    // var log_dt = await admin_login_data(data);
    // if (log_dt.suc > 0) {
    //     if (log_dt.msg.length > 0) {
    //         if (await bcrypt.compare(data.password, log_dt.msg[0].password)) {
    //             try {
    //                 await db_Insert('td_user', `last_login="${datetime}"`, null, `user_id='${log_dt.msg[0].user_id}'`, 1)
    //             } catch (err) {
    //                 console.log(err);
    //             }
    //             req.session.message = {
    //                 type: "success",
    //                 message: "Successfully loggedin",
    //             };
    //             req.session.user = log_dt.msg[0];
    //             res.redirect("/dashboard");
    //         } else {
    //             req.session.message = {
    //                 type: "warning",
    //                 message: "Please check your userid or password",
    //             };
    //             res.redirect("/login");
    //         }
    //     } else {
    //         req.session.message = {
    //             type: "warning",
    //             message: "Please check your userid or password",
    //         };
    //         res.redirect("/admin/login");
    //     }
    // } else {
    //     req.session.message = {
    //         type: "warning",
    //         message: "Please check your userid or password",
    //     };
    //     res.redirect("/admin/login");
    // }

    res.redirect('/dashboard')

})


module.exports = {LoginRouter}