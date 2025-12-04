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

app.post('/api/products', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    const nuevoProducto = { id: productos.length + 1, title, description, code, price, status, stock, category, thumbnails }
    productos.push(nuevoProducto)
    res.status(201).json(nuevoProducto)
})

app.put('/api/products/:pid', (req, res) => {
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

app.delete('/api/products/:pid', (req, res) => {
    const { id } = req.params
    productos = productos.filter(p => p.id !== parseInt(id))
    res.json({ mensaje: "Producto eliminado" })
})

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
})