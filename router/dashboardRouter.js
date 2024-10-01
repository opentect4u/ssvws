const DashboardRouter = require('express').Router()

DashboardRouter.get('/dashboard', (req, res) => {
    res.render('dashboard/view')
})

module.exports = {DashboardRouter}