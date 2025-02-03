const { adminuserRouter } = require('./admin/adminuserRouter');
const { desigRouter } = require('./admin/designation/desigRouter');
const { fetchRouter } = require('./admin/fetchRouter');
const { loanRouter } = require('./admin/loanRouter');
const { reportwebRouter } = require('./admin/reportwebRouter');
const { userRouter } = require('./admin/userRouter');

const express = require('express'),
    adminRouter = express.Router();

    adminRouter.use(adminuserRouter);
    adminRouter.use(fetchRouter);
    adminRouter.use(userRouter);
    adminRouter.use(loanRouter);
    adminRouter.use(reportwebRouter);
    adminRouter.use(desigRouter);

module.exports = {adminRouter}
    