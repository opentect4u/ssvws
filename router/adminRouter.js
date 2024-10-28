const { adminuserRouter } = require('./admin/adminuserRouter');
const { fetchRouter } = require('./admin/fetchRouter');
const { userRouter } = require('./admin/userRouter');

const express = require('express'),
    adminRouter = express.Router();

    adminRouter.use(adminuserRouter);
    adminRouter.use(fetchRouter);
    adminRouter.use(userRouter);

module.exports = {adminRouter}
    