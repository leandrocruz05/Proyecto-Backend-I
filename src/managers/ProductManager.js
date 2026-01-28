// const fs = require('fs').promises //? Migro a MongoDB
// const path = require('path') //? Migro a MongoDB
import ProductModel from '../models/products.model.js'


class ProductManager {
    constructor() {
        //? Migro a MongoDB
        // this.productos = []
        // this.PRODUCTOS_FILE = path.join(__dirname, '../data/products.json')
    }

    async consultaProductos() {
        try {
            // const contenido = await fs.readFile(this.PRODUCTOS_FILE, 'utf-8')
            // return JSON.parse(contenido || '[]')

            //! Armo consulta a MongoDB usando el modelo con paginacion, filtros y ordenamiento
            const {
                limit = 10, //? Cantidad de productos por página
                page = 1, //? Página actual
                sort, //? Ordenamiento por precio (asc o desc)
                query
            } = queryParams

            //! Pipeline de agregacion
            let pipeline = []

            //! Filtros
            let filtro = {}
            if (query) {
                filtro = query
            }
            pipeline.push({ $match: filtro })

            //! Ordenamiento por precio
            if (sort === 'asc' || sort === 'desc') {
                pipeline.push({
                    $sort: { price: sort === 'asc' ? 1 : -1 }
                })
            }

            //! Paginación
            const skip = (page - 1) * limit // Documentos a saltar
            pipeline.push({ $skip: skip }) // Salto de documentos
            pipeline.push({ $limit: limit }) // Cantidad de productos por página

            const productos = await ProductModel.aggregate(pipeline)

            console.log(productos)
            return productos

        } catch (error) {
            console.error("Error al leer el archivo de productos:", error)
            return []
        }
    }

    async consultaProductosxId(id) {
        //? Migro a MongoDB
        // const productoBuscado = await this.consultaProductos()
        // return productoBuscado.find(p => p.id === parseInt(id))
        try {
            const producto = await ProductModel.findOne({ _id: id })
            return producto
        } catch (error) {
            console.error("Error al consultar el producto por ID:", error)
            return null
        }
    }

    async agregarProducto(title, description, code, price, status = true, stock, category, thumbnails = []) {
        //? Migro a MongoDB
        // const productos = await this.consultaProductos()
        // const nuevoProducto = { id: productos.length + 1, title, description, code, price, status, stock, category, thumbnails };
        // productos.push(nuevoProducto)
        // await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productos))
        // console.log("El producto se ha agregado!");
        // return nuevoProducto
        try {
            const nuevoProducto = await ProductModel.collection.insertOne({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            })
            console.log("El producto se ha agregado!")
            return nuevoProducto
        } catch (error) {
            console.error("Error al agregar el producto:", error)
            return null
        }
    }

    async agregarProductos(productos) {
        try {
            const nuevosProductos = await ProductModel.insertMany(productos)
            console.log(`Se agregaron ${nuevosProductos.length} productos!`)
            return nuevosProductos
        } catch (error) {
            console.error("Error al agregar productos:", error)
            return null
        }
    }

    // async actualizarProducto(id, title, description, code, price, status, stock, category, thumbnails) {
    async actualizarProducto(id, data) {
        //? Migro a MongoDB
        // const productos = await this.consultaProductos()
        //     const producto = productos.find(p => p.id === parseInt(id))
        //     if (!producto) {
        //         console.log("Producto no encontrado")
        //         return
        //     }
        //     producto.title = title || producto.title
        //     producto.description = description || producto.description
        //     producto.code = code || producto.code
        //     producto.price = price || producto.price
        //     producto.status = status || producto.status
        //     producto.stock = stock || producto.stock
        //     producto.category = category || producto.category
        //     producto.thumbnails = thumbnails || producto.thumbnails
        //     await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productos))
        //     console.log("El Usuario se ha actualizado");
        //     return producto
        try {
            //! Busco el producto
            let producto = await ProductModel.findOne({ _id: id })

            if (!producto) {
                console.log("Producto no encontrado")
                return null
            }

            //! Actualizar el producto
            await ProductModel.updateOne({ _id: id }, { $set: data }, producto)
            console.log("El producto se ha actualizado")
            return producto
        } catch (error) {
            console.error("Error al actualizar el producto:", error)
            return null
        }
    }

    async eliminarProducto(id) {
        //? Migro a MongoDB
        // const productos = await this.consultaProductos();
        // const productoAEliminar = productos.filter(p => p.id !== Number(id));
        // await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productoAEliminar));
        // console.log("El Usuario se ha eliminado correctamente!");
        // return true
        try {
            //! Busco el producto
            let producto = await ProductModel.findOne({ _id: id })

            if (!producto) {
                console.log("Producto no encontrado")
                return null
            }

            //! Eliminar el producto
            await ProductModel.deleteOne({ _id: id })

            console.log("El producto se ha eliminado correctamente!")
            return true
        } catch (error) {
            console.error("Error al eliminar el producto:", error)
            return false
        }
    }
}

export default ProductManager