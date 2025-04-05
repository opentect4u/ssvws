const { db_Select } = require('../../../../model/mysqlModel');

const express = require('express'),
loan_demandDayRouter = express.Router(),
dateFormat = require('dateformat');

module.exports = {loan_demandDayRouter}