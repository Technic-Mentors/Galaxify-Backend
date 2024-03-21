const mongoose = require("mongoose")
const { Schema } = mongoose

const OrderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postCode: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    addInformation: {
        type: String
    },
    orderAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    orderNumber:{
        type: String
    }
})

module.exports = mongoose.model("Order", OrderSchema)