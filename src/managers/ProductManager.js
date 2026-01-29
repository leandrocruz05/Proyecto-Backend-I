//* const fs = require('fs').promises //? Migro a MongoDB
//* const path = require('path') //? Migro a MongoDB
import ProductModel from '../models/products.model.js'


class ProductManager {
    constructor() {
        //* this.productos = []
        //* this.PRODUCTOS_FILE = path.join(__dirname, '../data/products.json')
    }

    async consultaProductos(queryParams = {}) {
        try {
            //* const contenido = await fs.readFile(this.PRODUCTOS_FILE, 'utf-8')
            //* return JSON.parse(contenido || '[]')

            //! Armo consulta a MongoDB usando el modelo con paginacion, filtros y ordenamiento
            const {
                limit = 10,
                page = 1,
                sort,
                query
            } = queryParams

            //! Filtros
            let filtro = {}
            if (query) {
                if (typeof query === 'string') {
                    try {
                        filtro = JSON.parse(query)
                    } catch (error) {
                        filtro = { category: query }
                    }
                } else {
                    filtro = query
                }
            }

            //! Ordenamiento por precio
            let orden = {}
            if (sort) {
                orden.price = sort === 'asc' ? 1 : -1
            }

            //! Paginación usando plugin
            const pagina = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: orden,
                lean: true  //? Devuelve objetos planos de JavaScript
            }

            const productos = await ProductModel.paginate(filtro, pagina)

            //! Armo links de paginación
            const baseLink = (PageNum) => {
                let link = `/api/products?limit=${limit}&page=${PageNum}` //? Link base con limit y page
                if (sort) { link += `&sort=${sort}` } //? Agrego sort (orden) si existe
                if (query) { link += `&query=${encodeURIComponent(typeof query === 'string' ? query : JSON.stringify(query))}` } //? Agrego query (filtro) si existe
                return link
            }

            //! Devuelvo estructura completa
            return {
                status: "success",
                payload: productos.docs,
                totalPages: productos.totalPages,
                prevPage: productos.prevPage,
                nextPage: productos.nextPage,
                page: productos.page,
                hasPrevPage: productos.hasPrevPage,
                hasNextPage: productos.hasNextPage,
                prevLink: productos.hasPrevPage ? baseLink(productos.prevPage) : null,
                nextLink: productos.hasNextPage ? baseLink(productos.nextPage) : null
            }
        } catch (error) {
            console.error("Error al consultar productos:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    async consultaProductosxId(id) {
        //* const productoBuscado = await this.consultaProductos()
        //* return productoBuscado.find(p => p.id === parseInt(id))
        try {
            const producto = await ProductModel.findOne({ _id: id })
            return producto
        } catch (error) {
            console.error("Error al consultar el producto por ID:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    async agregarProducto(title, description, code, price, status = true, stock, category, thumbnails = []) {
        //* const productos = await this.consultaProductos()
        //* const nuevoProducto = { id: productos.length + 1, title, description, code, price, status, stock, category, thumbnails };
        //* productos.push(nuevoProducto)
        //* await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productos))
        //* console.log("El producto se ha agregado!");
        //* return nuevoProducto
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
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    async agregarProductos(productos) {
        try {
            const nuevosProductos = await ProductModel.insertMany(productos)
            console.log(`Se agregaron ${nuevosProductos.length} productos!`)
            return nuevosProductos
        } catch (error) {
            console.error("Error al agregar productos:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    //* async actualizarProducto(id, title, description, code, price, status, stock, category, thumbnails) {
    async actualizarProducto(id, data) {
        //* const productos = await this.consultaProductos()
        //*     const producto = productos.find(p => p.id === parseInt(id))
        //*     if (!producto) {
        //*         console.log("Producto no encontrado")
        //*         return
        //*     }
        //*     producto.title = title || producto.title
        //*     producto.description = description || producto.description
        //*     producto.code = code || producto.code
        //*     producto.price = price || producto.price
        //*     producto.status = status || producto.status
        //*     producto.stock = stock || producto.stock
        //*     producto.category = category || producto.category
        //*     producto.thumbnails = thumbnails || producto.thumbnails
        //*     await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productos))
        //*     console.log("El Usuario se ha actualizado");
        //*     return producto
        try {
            //! Busco el producto
            let producto = await ProductModel.findOne({ _id: id })

            if (!producto) {
                console.log("Producto no encontrado")
                return {
                    status: 'error',
                    error: 'Producto no encontrado'
                }
            }

            //! Actualizar el producto
            await ProductModel.updateOne({ _id: id }, { $set: data }, producto)
            console.log("El producto se ha actualizado")
            return producto
        } catch (error) {
            console.error("Error al actualizar el producto:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    async eliminarProducto(id) {
        //* const productos = await this.consultaProductos();
        //* const productoAEliminar = productos.filter(p => p.id !== Number(id));
        //* await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productoAEliminar));
        //* console.log("El Usuario se ha eliminado correctamente!");
        //* return true
        try {
            //! Busco el producto
            let producto = await ProductModel.findOne({ _id: id })

            if (!producto) {
                console.log("Producto no encontrado")
                return {
                    status: 'error',
                    error: 'Producto no encontrado'
                }
            }

            //! Eliminar el producto
            await ProductModel.deleteOne({ _id: id })

            console.log("El producto se ha eliminado correctamente!")
            return true
        } catch (error) {
            console.error("Error al eliminar el producto:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }
}

export default ProductManager