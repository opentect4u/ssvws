const { adminuserRouter } = require('./admin/adminuserRouter');
const { blockRouter } = require('./admin/block/blockRouter');
const { dashboard_dataRouter } = require('./admin/dashboard/dashboard_dataRouter');
const { desigRouter } = require('./admin/designation/desigRouter');
const { districtRouter } = require('./admin/district/districtrouter');
const { fetchRouter } = require('./admin/fetchRouter');
const { loanRouter } = require('./admin/loanRouter');
const { monthEndRouter } = require('./admin/month_end/monthEndRouter');
const { purposeRouter } = require('./admin/purpose/purposeRouter');
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
    adminRouter.use(monthEndRouter);
    adminRouter.use(districtRouter)
    adminRouter.use(blockRouter);
    adminRouter.use(dashboard_dataRouter);
    adminRouter.use(purposeRouter);

module.exports = {adminRouter}
    