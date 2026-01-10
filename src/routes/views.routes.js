const express = require('express')
const viewsRouter = express.Router()
const ProductManager = require('../managers/ProductManager')
const PM = new ProductManager()

// Ruta para home.hbs
viewsRouter.get('/', async (req, res) => {
    try {
        const productos = await PM.consultaProductos()
        res.render('home', { productos })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Ruta para realTimeProducts.hbs
viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const productos = await PM.consultaProductos()
        res.render('realTimeProducts', { productos })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = viewsRouter