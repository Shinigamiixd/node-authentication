require("dotenv").config()
require("./config/db")()
const express = require("express")
// const express_async_handler = require('express-async-handler')
// const webtoken = require("jsonwebtoken")
// const cors = require("cors")
// const bcryptjs = require("bcryptjs")

const app = express()

app.get("/", (req, res, next) => {
    next()
})





app.listen(process.env.PORT, () => {
    console.log("Listening on PORT", process.env.PORT)
})