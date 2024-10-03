const express = require("express"),
    app = express(),
    session = require("express-session"),
    expressLayouts = require("express-ejs-layouts"),
    path = require("path"),
    port = process.env.PORT || 3014;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// SET VIEW ENGINE AND PATH //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);

app.set("layout", "templates/layout");

// SET ASSETS AS A STATIC PATH //
app.use(express.static(path.join(__dirname, "assets/")));

// Set up the session middleware
app.use(
  session({
    secret: "Vivekananda Micro Finance", // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
    cookie : {
      maxAge: 3600000
    }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.path = req.path;
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

const { grtformRouter } = require("./router/api/grtformRouter");
const { masterRouter } = require("./router/api/masterRouter");
const { memberRouter } = require("./router/api/memberRouter");
const { userRouter } = require("./router/api/userRouter");
const { DashboardRouter } = require("./router/dashboardRouter");
const { LoginRouter } = require("./router/loginRouter");

app.use(LoginRouter)
app.use(DashboardRouter)
app.use(masterRouter)
app.use(grtformRouter)
app.use(userRouter)
app.use(memberRouter)

app.get("/",async (req, res) => {
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