require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { errorHandler } = require("./middleware/errorMiddleware")
require("./config/db")()
const app = express()

app.use(cors())
app.options("*", cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/api/ads", require("./routes/adRoutes"))
app.use("/api/users", require("./routes/userRoutes"))

app.use(errorHandler)

app.listen(process.env.PORT, () => console.log("Listening on PORT", process.env.PORT))