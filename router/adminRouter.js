const { adminuserRouter } = require('./admin/adminuserRouter');
const { fetchRouter } = require('./admin/fetchRouter');

const express = require('express'),
    adminRouter = express.Router();

    adminRouter.use(adminuserRouter);
    adminRouter.use(fetchRouter);

module.exports = {adminRouter}
    