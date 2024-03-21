const mongoose = require("mongoose")
const { Schema } = mongoose

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: String,
        required: true
    },
    cartQuantity: {
        type: Number
    },
    status: {
        type: String
    },
    image: {
        type: String,
        // required: true
    }
})

module.exports = mongoose.model("Products", productSchema)