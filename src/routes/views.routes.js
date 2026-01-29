import express from 'express'
import ProductManager from '../managers/ProductManager.js'
import CartManager from '../managers/CartManager.js'

const viewsRouter = express.Router()
const PM = new ProductManager()
const CM = new CartManager()

//! GET / - Ruta para home.hbs (/products)
viewsRouter.get('/', (req, res) => {
    res.render('index', {
        title: 'E-Commerce - Inicio'
    });
})

//! GET /products - Vista de productos con paginación
viewsRouter.get('/products', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query

        const resultado = await PM.consultaProductos({
            limit: limit || 10,
            page: page || 1,
            sort,
            query
        })

        if (resultado.status === 'error') {
            return res.status(400).json({ error: resultado.message })
        }

        //! Reenderizo vista con productos y datos de paginación
        res.render('products', {
            title: 'Productos',
            products: resultado.payload,
            totalPages: resultado.totalPages,
            prevPage: resultado.prevPage,
            nextPage: resultado.nextPage,
            page: resultado.page,
            hasPrevPage: resultado.hasPrevPage,
            hasNextPage: resultado.hasNextPage,
            prevLink: resultado.prevLink,
            nextLink: resultado.nextLink,
            limit: limit || 10,
            sort,
            query
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//! GET /products/:pid - Vista de detalle de producto
viewsRouter.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const producto = await PM.consultaProductosxId(pid)

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }

        if (producto.status === 'error') {
            return res.status(400).json({ error: producto.message })
        }

        res.render('productDetail', { title: producto.title, product: producto })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//! GET /carts/:cid - Vista de detalle de carrito
viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const carrito = await CM.consultaCarritoxId(cid)

        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' })
        }

        if (carrito.status === 'error') {
            return res.status(400).json({ error: carrito.message })
        }

        res.render('cart', { title: `Mi Carrito ${cid}`, cart: carrito })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//! GET /realtimeproducts - Ruta para realTimeProducts.hbs
viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const resultado = await PM.consultaProductos({ limit: 100 })
        res.render('realTimeProducts', {
            title: 'Productos en Tiempo Real',
            productos: resultado.payload || []
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default viewsRouter