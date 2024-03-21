const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const mongoUri = process.env.MONGODB_URI
const connectToMongo = async () => {
    try {
        mongoose.connect(mongoUri)
        console.log("successfully connected with mongodb")
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectToMongo