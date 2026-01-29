import express from 'express'
import ProductManager from '../managers/ProductManager.js'

const router = express.Router()
const PM = new ProductManager()

//! GET / - Lista todos los productos con paginacion, filtros y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query

        const productos = await PM.consultaProductos({
            limit,
            page,
            sort,
            query
        })

        if (productos.status === 'error') {
            return res.status(400).json({ productos })
        }

        res.json(productos)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//! GET /:pid - Lista producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const producto = await PM.consultaProductosxId(pid)

        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" })
        }

        res.render('producto', { producto })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//! POST / - Crea un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body
        const nuevoProducto = await PM.agregarProducto(title, description, code, price, status, stock, category, thumbnails)

        const socketServer = req.app.get('socketServer') //? Obtener io desde app
        const productos = await PM.consultaProductos({ limit: 100 }); //? Obtener todos para socket
        socketServer.emit('productos', productos.payload)

        res.status(201).json({ mensaje: "Producto creado", producto: nuevoProducto })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//! PUT /:pid - Actualiza un producto por ID
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const updateData = req.body
        const resultado = await PM.actualizarProducto(pid, updateData)

        if (!resultado) {
            return res.status(404).json({ mensaje: "Error al actualizar el producto" })
        }

        const socketServer = req.app.get('socketServer') //? Obtener io desde app
        const productos = await PM.consultaProductos({ limit: 100 })
        socketServer.emit('productos', productos.payload)

        res.status(200).json({ mensaje: "Producto actualizado", producto: resultado })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//! DELETE /:pid - Elimina un producto por ID
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const resultado = await PM.eliminarProducto(pid)

        if (!resultado) {
            return res.status(404).json({ mensaje: "Error al eliminar el producto" })
        }

        res.status(200).json({ mensaje: "Producto eliminado" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

export default router