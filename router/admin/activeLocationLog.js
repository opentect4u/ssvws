const actLocLogRouter = require('express').Router();

actLocLogRouter.post("/", async (req, res) => {
    const data = req.body;
    res.send({suc: 1, msg: "Location access log saved successfully", data});
})

module.exports = {actLocLogRouter};