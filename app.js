import express from 'express'
import handlebars from 'express-handlebars'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Server } from 'socket.io'
import productsRouter from './src/routes/products.routes.js'
import cartsRouter from './src/routes/carts.routes.js'
import viewRouter from './src/routes/views.routes.js'
import ProductManager from './src/managers/ProductManager.js'
import connectDB from './src/config/database.js'

// Conecto a la base de datos
connectDB()

const port = 8080
const app = express()
const __filename = fileURLToPath(import.meta.url) // Obtengo el path del archivo actual
const __dirname = dirname(__filename) // Obtengo el directorio actual

// Configuracion de Handlebars
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/src/views')

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
const PM = new ProductManager()
app.set('socketServer', socketServer) //Permite conectar http con socket.io

// Manejo de conexiones
socketServer.on('connection', async (socket) => {
    socket.on('usuarioConectado', data => {
        socket.broadcast.emit('usuarioConectado', data + ' se ha conectado')
    })

    // Enviar productos 
    const productos = await PM.consultaProductos({ limit: 100 })
    socket.emit('productos', productos.docs)

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
        const productos = await PM.consultaProductos({ limit: 100 })
        socketServer.emit('productos', productos.docs)
    })

    // Escuchar eliminar producto
    socket.on('eliminarProducto', async (id) => {
        await PM.eliminarProducto(id)
        const productos = await PM.consultaProductos({ limit: 100 })
        socketServer.emit('productos', productos)
    })
})











