import express from 'express'
import CartManager from '../managers/CartManager.js'

const router = express.Router()
const CM = new CartManager()

//! GET / - Lista todos los carritos
router.get('/', async (req, res) => {
    try {
        const carritos = await CM.consultaCarrito()

        if (carritos.status === 'error') {
            return res.status(500).json(carritos)
        }

        res.json(carritos)
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        })
    }
})

//! POST / - Crear un nuevo carrito vacío
router.post('/', async (req, res) => {
    try {
        const nuevoCarrito = await CM.crearCarrito()

        if (nuevoCarrito.status === 'error') {
            return res.status(500).json(nuevoCarrito)
        }

        res.status(201).json({ mensaje: "Carrito creado", carrito: nuevoCarrito })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        })
    }
})

//! GET /:cid - Lista carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const carrito = await CM.consultaCarritoxId(cid)

        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' })
        }

        if (carrito.status === 'error') {
            return res.status(500).json(carrito)
        }

        res.json(carrito)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//! POST /:cid/product/:pid - Agrega un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const resultado = await CM.agregarProductoACarrito(cid, pid, quantity || 1)

        if (!resultado) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' })
        }

        if (resultado.status === 'error') {
            return res.status(500).json(resultado)
        }

        res.status(200).json({ mensaje: "Producto agregado al carrito", carrito: resultado })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        })
    }
})

//! DELETE /:cid/products/:pid - Elimina un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const resultado = await CM.eliminarProductoDeCarrito(cid, pid)

        if (!resultado) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' })
        }

        if (resultado.status === 'error') {
            return res.status(500).json(resultado)
        }

        res.status(200).json({ mensaje: "Producto eliminado del carrito", carrito: resultado })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        })
    }
})

//! PUT /:cid - Actualiza el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const { productos } = req.body

        const resultado = await CM.actualizarCarrito(cid, productos)

        if (!resultado) {
            return res.status(404).json({ error: 'Carrito no encontrado' })
        }

        if (resultado.status === 'error') {
            return res.status(500).json(resultado)
        }

        res.status(200).json({ mensaje: "Carrito actualizado", carrito: resultado })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        })
    }
})

//! PUT /:cid/products/:pid - Actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        if (!quantity || quantity <= 0 || typeof quantity !== 'number') {
            return res.status(400).json({
                mensaje: "El campo 'quantity' es requerido y debe ser un número mayor a 0"
            })
        }

        const resultado = await CM.actualizarCantidadProducto(cid, pid, quantity)

        if (!resultado) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' })
        }

        if (resultado.status === 'error') {
            return res.status(500).json(resultado)
        }

        res.status(200).json({ mensaje: "Cantidad actualizada", carrito: resultado })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        })
    }
})

//! DELETE /:cid - Vacía el carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params

        const resultado = await CM.vaciarCarrito(cid)

        if (!resultado) {
            return res.status(404).json({ error: 'Carrito no encontrado' })
        }

        if (resultado.status === 'error') {
            return res.status(500).json(resultado)
        }

        res.status(200).json({ mensaje: "Carrito vaciado", carrito: resultado })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        })
    }
})

//! POST /:cid/checkout - Finalizar compra (guarda el carrito actual y crea uno nuevo)
router.post('/:cid/checkout', async (req, res) => {
    try {
        const { cid } = req.params
        
        const carritoActual = await CM.consultaCarritoxId(cid)
        
        if (!carritoActual || carritoActual.products.length === 0) {
            return res.status(400).json({ error: 'No se puede finalizar una compra con el carrito vacío' })
        }

        const nuevoCarrito = await CM.crearCarrito()

        if (nuevoCarrito.status === 'error') {
            return res.status(500).json(nuevoCarrito)
        }

        res.status(200).json({ 
            mensaje: "Compra finalizada con éxito", 
            carritoFinalizado: carritoActual,
            nuevoCarrito: nuevoCarrito
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        })
    }
})

//! DELETE /:cid/delete-permanent - Elimina permanentemente un carrito
router.delete('/:cid/delete-permanent', async (req, res) => {
    try {
        const { cid } = req.params

        const resultado = await CM.eliminarCarrito(cid)

        if (!resultado) {
            return res.status(404).json({ error: 'Carrito no encontrado' })
        }

        if (resultado.status === 'error') {
            return res.status(500).json(resultado)
        }

        res.status(200).json({ mensaje: "Carrito eliminado permanentemente", status: 'success' })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        })
    }
})

export default router