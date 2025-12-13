const express = require('express')
const productsRouter = require('./src/routes/products.routes.js')
const cartsRouter = require('./src/routes/carts.routes.js')
const port = 8080
const app = express()

app.use(express. json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ mensaje: "API de Productos y Carritos" })
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})