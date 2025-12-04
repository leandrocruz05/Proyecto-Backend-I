const express = require('express')
const app = express()
const port = 8080

app.use(express.json())
let productos = []

//? Manejo de productos
app.get('(/api/products/', (req, res) => { //Lista todos los productos
    res.json(productos)
})

app.get('/api/products/:pid', (req, res) => { //Lista producto por ID
    const { id } = req.params
    const producto = productos.find(p => p.id === parseInt(id))
    if (!producto) return res.status(404).json({ mensaje: "El producto no fue encontrado" })
    res.json(producto)
})

app.post('/api/products', (req, res) => { // Crea un nuevo producto
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    const nuevoProducto = { id: productos.length + 1, title, description, code, price, status, stock, category, thumbnails }
    productos.push(nuevoProducto)
    res.status(201).json(nuevoProducto)
})

app.put('/api/products/:pid', (req, res) => { // Actualiza un producto por ID
    const { id } = req.params
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    const producto = productos.find(p => p.id === parseInt(id))
    if (!producto) return res.status(404).json({ mensaje: "El producto no fue encontrado" })
    producto.title = title || producto.title
    producto.description = description || producto.description
    producto.code = code || producto.code
    producto.price = price || producto.price
    producto.status = status || producto.status
    producto.stock = stock || producto.stock
    producto.category = category || producto.category
    producto.thumbnails = thumbnails || producto.thumbnails
    res.json(producto)
})

app.delete('/api/products/:pid', (req, res) => { // Elimina un producto por ID
    const { id } = req.params
    productos = productos.filter(p => p.id !== parseInt(id))
    res.json({ mensaje: "Producto eliminado" })
})

//? Manejo de carritos
app.post('/api/carts', (req, res) => { // Crea carrito
    const nuevoCarrito = { id: carrito.length + 1, products: [] }
    carrito.push(nuevoCarrito)
    res.status(201).json(nuevoCarrito)
})

app.get('/api/carts/:cid', (req, res) => { // Lista productos del carrito por ID
    const { id } = req.params
    const productoCarrito = carrito.find(p => p.id === parseInt(id))
    if (!productoCarrito) return res.status(404).json({ mensaje: "El producto no fue encontrado en el carrito" })
    res.json(productoCarrito)
})

app.post('/api/carts/:cid/product/:pid', (req, res) => { // Agrega un producto al carrito por ID
    const { pid, cid } = req.params
    const carritoEncontrado = carrito.find(c => c.id === parseInt(cid))
    const producto = productos.find(p => p.id === parseInt(pid))

    if (!carritoEncontrado) return res.status(404).json({ mensaje: "El carrito no fue encontrado" })
    if (!producto) return res.status(404).json({ mensaje: "El producto no fue encontrado" })

    // Busca si el producto ya existe en el carrito
    const productoExiste = carritoEncontrado.products.find(p => p.product === parseInt(pid))

    if (productoExiste) {
        productoExiste.quantity += 1 // Si existe, incremento quantity
    } else { // Si no existe, lo agrego
        carritoEncontrado.products.push({
            product: parseInt(pid),
            quantity: 1
        })
    }
    res.json(carritoEncontrado)
})

app.listen(port, () => { // Inicia el servidor
    console.log(`Servidor corriendo en el puerto ${port}`);
})