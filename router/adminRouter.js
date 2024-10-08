const { adminuserRouter } = require('./admin/adminuserRouter');

const express = require('express'),
    adminRouter = express.Router();

    adminRouter.use(adminuserRouter)

module.exports = {adminRouter}
    