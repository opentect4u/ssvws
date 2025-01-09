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

app.use(LoginRouter)
app.use(DashboardRouter)
app.use(masterRouter)
app.use(grtformRouter)
app.use(userRouter)
app.use(memberRouter)
app.use(recoveryRouter)
app.use(reportRouter)
app.use(appdashboardRouter)
app.use(testRouter)
app.use(loan_statementRouter)
app.use(loan_transRouter)
app.use(loan_demandRouter)
app.use(loan_outstandingRouter)
app.use(loan_recov_approveRouter)
app.use(empRouter)
app.use('/admin', adminRouter)

app.get("/",async (req, res) => {
  // const bcrypt = require("bcrypt");
  // var pass = bcrypt.hashSync('8910622991', 10)
  // console.log(pass);
  
//   var user = req.session.user;
//   if (!user) {
//     res.redirect("/login");
//   } else {
    res.redirect("/login");
//   }
// res.send('Welcome')
});

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