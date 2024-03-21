const mongoose = require("mongoose")
const { Schema } = mongoose

const OrderDetailSchema = new Schema({
    orderId:{
        type: Schema.Types.ObjectId,
        ref:"Order"
    },
    productId:{
        type: Schema.Types.ObjectId,
        ref:"Products"
    },
    quantity: {
        type: Number,
        required: true
    },
    subTotal:{
        type: Number,
        required: true
    },
    image: {
        type: String
    }
})

module.exports = mongoose.model("OrderDetail", OrderDetailSchema)