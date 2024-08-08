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
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
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
    images: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("Products", productSchema)