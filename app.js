const express = require('express')
const handlebars = require('express-handlebars')
const { server, Server } = require('socket.io')
const productsRouter = require('./src/routes/products.routes.js')
const cartsRouter = require('./src/routes/carts.routes.js')
const viewRouter = require('./src/routes/views.routes.js')
const __dirname = require('./src/utils.js')
const productsManager = require('./src/managers/products.manager.js')

const port = 8080
const app = express()

// Configuracion de Handlebars
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

// Configuración de Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public")) // Para archivos estáticos (CSS, JS)

// Routes
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewRouter)

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ mensaje: "API de Productos y Carritos" })
})

// Inicia el servidor HTTP
const httpServer = app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})

// Configurar Socket.io
const socketServer = new Server(httpServer)
const PM = new productsManager()

// Manejo de conexiones
socketServer.on('connection', async (socket) => {
    socket.on('usuarioConectado', data => {
       socket.broadcast.emit('usuarioConectado', data + ' se ha conectado')
    })

    // Enviar productos 
    const productos = await PM.consultaProductos()
    socket.emit('productos', productos)

    // Escuchar agregar producto
    socket.on('agregarProducto', async (producto) => {
        await PM.agregarProducto(
            producto.title,
            producto.description,
            producto.code,
            producto.price,
            producto.status,
            producto.stock,
            producto.category,
            producto.thumbnails
        )
        const productos = await PM.consultaProductos()
        socketServer.emit('productos', productos)
    })

    // Escuchar eliminar producto
    socket.on('eliminarProducto', async (id) => {
        await PM.eliminarProducto(id)
        const productos = await PM.consultaProductos()
        socketServer.emit('productos', productos)
    })
})











