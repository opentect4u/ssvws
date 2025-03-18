const express = require("express");

    app = express(),
    // session = require("express-session"),
    expressLayouts = require("express-ejs-layouts"),
    path = require("path"),
    https = require('https'),
    fs = require('fs'),
    cors = require('cors'),
    port = process.env.PORT || 3014;

   
    // const EventEmitter = require('events');

    // const emitter = new EventEmitter();
    // emitter.setMaxListeners(20);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// SET VIEW ENGINE AND PATH //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.use(cors());
app.set("layout", "templates/layout");

// SET ASSETS AS A STATIC PATH //
app.use(express.static(path.join(__dirname, "assets/")));

// Set up the session middleware
// app.use(
//   session({
//     secret: "Vivekananda Micro Finance", // Change this to a secure random string
//     resave: false,
//     saveUninitialized: true,
//     cookie : {
//       maxAge: 3600000
//     }
//   })
// );

// const options = {
//   key: fs.readFileSync(path.join(__dirname, 'ssvwsadmin_certificate/private-key.txt')),
//   cert: fs.readFileSync(path.join(__dirname, 'ssvwsadmin_certificate/ssvwsadmin.crt')),
// };

// var server = https.createServer(options, app);

// app.use((req, res, next) => {
//   res.locals.user = req.session.user;
//   res.locals.path = req.path;
//   res.locals.message = req.session.message;
//   delete req.session.message;
//   next();
// });

const { adminRouter } = require("./router/adminRouter");
const { appdashboardRouter } = require("./router/api/dashboardRouter");
const { grtformRouter } = require("./router/api/grtformRouter");
const { masterRouter } = require("./router/api/masterRouter");
const { memberRouter } = require("./router/api/memberRouter");
const { recoveryRouter } = require("./router/api/recoveryRouter");
const { reportRouter } = require("./router/api/reportRouter");
const { testRouter } = require("./router/api/testRouter");
const { userRouter } = require("./router/api/userRouter");
const { DashboardRouter } = require("./router/dashboardRouter");
const { LoginRouter } = require("./router/loginRouter");
const { loan_statementRouter } = require("./router/report/branch_report/web/loan_statementRouter");
const { loan_transRouter } = require("./router/report/branch_report/web/loan_transRouter");
const { loan_demandRouter } = require("./router/report/branch_report/web/loan_demandRouter");
const { loan_outstandingRouter } = require("./router/report/branch_report/web/loan_outstandingRouter");
const { loan_recov_approveRouter } = require("./router/admin/loan/loan_recov_approve");
const { empRouter } = require("./router/admin/employee/empRouter");
const { userwebRouter } = require("./router/admin/user/userwebRouter");
const { transferUserRouter } = require("./router/admin/transfer_user/transferUserRouter");
const { loan_transAdminRouter } = require("./router/report/branch_report/admin_web/loan_transAdminRouter");
const { loan_statementAdminRouter } = require("./router/report/branch_report/admin_web/loan_statementAdminRouter");
const { loan_outstandingAdminrouter } = require("./router/report/branch_report/admin_web/loan_outstandingAdminrouter");
const { loan_summaryrouter } = require("./router/report/branch_report/web/loan_summaryRouter");
const { loan_summaryAdminRouter } = require("./router/report/branch_report/admin_web/loan_summaryAdminRouter");
const { dmd_vs_collRouter } = require("./router/report/branch_report/web/dmd_vs_collRouter");
const { getLoanBal } = require("./modules/api/masterModule");
const { dmd_vs_collAdminRouter } = require("./router/report/branch_report/admin_web/dmd_vs_collAdminRouter");
const { loan_demandAdminRouter } = require("./router/report/branch_report/admin_web/loan_demandAdminRouter");
const { attendanceRouter } = require("./router/api/emp_attandence/attendanceRouter");
const { app_attendanceRouter } = require("./router/report/branch_report/mobile/attendance/app_attendanceRouter");
const { attenAdminRouter } = require("./router/report/branch_report/admin_web/attendance/attenAdminRouter");
const { attendancewebRouter } = require("./router/report/branch_report/web/attendancewebRouter");
const { loan_closeRouter } = require("./router/report/branch_report/web/loan_close_reportRouter");
const { userMenuRouter } = require("./router/api/userMenuRouter");
const { loan_disb_approveRouter } = require("./router/admin/loan/loan_disb_approve");
const { transferCoRouter } = require("./router/admin/transfer_co/transferCoRouter");
const { transferMemRouter } = require("./router/admin/transfer_member/transferMemRouter");
const { menu_permissionRouter } = require("./router/admin/menu/menu_permissionRouter");
const { authCheckForLogin } = require("./middleware/authMiddleware");

// app.use(authCheckForLogin);
app.use( authCheckForLogin,LoginRouter)
app.use( authCheckForLogin,DashboardRouter)
app.use( authCheckForLogin,masterRouter)
app.use( authCheckForLogin,grtformRouter)
app.use(userRouter)
app.use( authCheckForLogin,memberRouter)
app.use( authCheckForLogin,recoveryRouter)
app.use( authCheckForLogin,reportRouter)
app.use( authCheckForLogin,appdashboardRouter)
app.use( authCheckForLogin,testRouter)
app.use( authCheckForLogin,loan_statementRouter)
app.use( authCheckForLogin,loan_transRouter)
app.use( authCheckForLogin,loan_demandRouter)
app.use( authCheckForLogin,loan_outstandingRouter)
app.use( authCheckForLogin,loan_recov_approveRouter)
app.use( authCheckForLogin,loan_disb_approveRouter)
app.use( authCheckForLogin,loan_summaryrouter)
app.use( authCheckForLogin,empRouter)
app.use( authCheckForLogin,userwebRouter)
app.use( authCheckForLogin,transferUserRouter)
app.use( authCheckForLogin,transferCoRouter)
app.use( authCheckForLogin,transferMemRouter)
app.use( authCheckForLogin,dmd_vs_collRouter)
app.use( authCheckForLogin,attendanceRouter)
app.use( authCheckForLogin,app_attendanceRouter)
app.use( authCheckForLogin,attendancewebRouter)
app.use( authCheckForLogin,loan_closeRouter)
app.use('/admin', authCheckForLogin, adminRouter)
app.use('/adminreport', authCheckForLogin, loan_transAdminRouter)
app.use('/adminreport', authCheckForLogin, loan_statementAdminRouter)
app.use('/adminreport', authCheckForLogin, loan_outstandingAdminrouter)
app.use('/adminreport', authCheckForLogin, loan_summaryAdminRouter)
app.use('/adminreport', authCheckForLogin, dmd_vs_collAdminRouter)
app.use('/adminreport', authCheckForLogin, loan_demandAdminRouter)
app.use('/adminreport', authCheckForLogin, attenAdminRouter)
app.use('/user_menu', authCheckForLogin, userMenuRouter)
app.use('/menu', authCheckForLogin, menu_permissionRouter)

app.get("/",async (req, res) => {
  // const bcrypt = require("bcrypt");
  // var pass = bcrypt.hashSync('SSVWS@2025',10)
  // console.log(pass);
  
//   var user = req.session.user;
//   if (!user) {
//     res.redirect("/login");
//   } else {
    res.redirect("/login");
//   }
// res.send(pass)
});

// app.get("/", async (req, res) => {
//   var get_loan_bal = await getLoanBal('12020623','2024-12-20')
//   console.log(get_loan_bal,'get');

//   res.send(get_loan_bal)
// })

app.get('/404', (req, res) => {
  res.render('pages/404')
})

app.get('*', function(req, res){
  res.redirect('404')
})


app.listen(port, (err) => {
    if (err) throw new Error(err);
    else console.log(`App is running at http://localhost:${port}`);
});

// server.listen(port, (err) => {
//   if (err) throw new Error(err);
//   else console.log(`App is running at http://localhost:${port}`);
// });