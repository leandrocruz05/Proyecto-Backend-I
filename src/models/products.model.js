import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        index: true  // Índice para buscar rapido por precio
    },
    status: {
        type: Boolean
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true  // Índice para buscar rapido por categoria
    },
    thumbnails: {
        type: [String],
        default: []
    }
})

productSchema.plugin(mongoosePaginate) // Agrego plugin de paginacion

const ProductModel = mongoose.model('Productos', productSchema)

export default ProductModel