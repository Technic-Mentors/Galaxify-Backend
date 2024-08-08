const mongoose = require("mongoose")
const { Schema } = mongoose

const reviewSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Reviews", reviewSchema)