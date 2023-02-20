const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_KEY)
        console.log(`Connected to MongoDB: ${connect.connection.host}`)
    } catch (error) {
        console.error("Couldn't connect to MongoDB", error)
    }
}

module.exports = connectDB