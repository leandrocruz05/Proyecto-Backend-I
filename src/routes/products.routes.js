const express = require('express')
const ProductManager = require('../managers/ProductManager')
const router = express.Router()
const PM = new ProductManager()

// Lista todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await PM.consultaProductos()
        if (!productos || productos.length === 0) {
            return res.status(404).json({ mensaje: "No hay productos disponibles" })
        }
        res.json(productos)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Lista producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const producto = await PM.consultaProductosxId(pid)
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" })
        }
        res.json(producto)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Crea un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body
        const nuevoProducto = await PM.agregarProducto(title, description, code, price, status, stock, category, thumbnails)

        const socketServer = req.app.get('socketServer') // Obtener io desde app
        const productos = await PM.consultaProductos()
        socketServer.emit('productos', productos) // Emite evento de actualización

        res.status(201).json({ mensaje: "Producto creado", producto: nuevoProducto })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Actualiza un producto por ID
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const { title, description, code, price, status, stock, category, thumbnails } = req.body
        const resultado = await PM.actualizarProducto(pid, title, description, code, price, status, stock, category, thumbnails)
        if (!resultado) {
            return res.status(404).json({ mensaje: "Error al actualizar el producto" })
        }

        const socketServer = req.app.get('socketServer') // Obtener io desde app
        const productos = await PM.consultaProductos()
        socketServer.emit('productos', productos) // Emite evento de actualización
        
        res.status(200).json({ mensaje: "Producto actualizado", producto: resultado })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Elimina un producto por ID
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const resultado = await PM.eliminarProducto(pid)
        if (!resultado) {
            return res.status(404).json({ mensaje: "Error al eliminar el producto" })
        }
        res.status(200).json({ mensaje: "Producto eliminado" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router