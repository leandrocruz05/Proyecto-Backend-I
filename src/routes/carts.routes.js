const express = require('express')
const CartManager = require('../managers/CartManager')
const router = express.Router()
const CM = new CartManager()

// Crea un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const nuevoCarrito = await CM.crearCarrito()
        if (!nuevoCarrito) {
            return res.status(404).json({ mensaje: "Error al crear el carrito" })
        }
        res.status(201).json({ mensaje: "Carrito creado", carrito: nuevoCarrito })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Lista carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const carrito = await CM.consultaCarritoxId(cid)
        if (!carrito) {
            return res.status(404).json({ mensaje: "Carrito no encontrado" })
        }
        res.json(carrito)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Agrega un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body
        const resultado = await CM.agregarProductoACarrito(cid, pid, quantity || 1)
        if (!resultado) {
            return res.status(404).json({ mensaje: "Error al agregar el producto al carrito" })
        }
        res.status(200).json({ mensaje: "Producto agregado al carrito", carrito: resultado })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router