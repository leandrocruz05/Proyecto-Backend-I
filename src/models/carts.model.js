import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productos',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        },
        _id: false
    }]
}, {
    timestamps: true
})

const CartModel = mongoose.model('carritos', cartSchema)

export default CartModel