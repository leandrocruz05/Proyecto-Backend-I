const { log } = require('console');
const express = require('express');
const { json } = require('stream/consumers');
const fs = require('fs').promises
const port = 8080

const app = express();
app.use(express.json());

class ProductManager {
    constructor() {
        this.productos = []
        this.PRODUCTOS_FILE = 'products.json'
    }

    async consultaProductos() {
        try {
            const contenido = await fs.readFile(this.PRODUCTOS_FILE, 'utf-8')
            return JSON.parse(contenido || '[]')
        } catch (error) {
            return []
        }
    }

    async consultaProductosxId(id) {
        const productoBuscado = await this.consultaProductos()
        return productoBuscado.find(p => p.id === parseInt(id))
    }

    async agregarProducto(title, description, code, price, status, stock, category, thumbnails) {
        const productos = await this.consultaProductos()
        const nuevoProducto = { id: productos.length + 1, title, description, code, price, status, stock, category, thumbnails };
        productos.push(nuevoProducto)
        await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productos))
        console.log("El producto se ha agregado!");
        return nuevoProducto
    }

    async actualizarProducto(id, title, description, code, price, status, stock, category, thumbnails) {
        const productos = await this.consultaProductos()
        const producto = productos.find(p => p.id === parseInt(id))
        if (!producto) {
            console.log("Producto no encontrado")
            return
        }
        producto.title = title || producto.title
        producto.description = description || producto.description
        producto.code = code || producto.code
        producto.price = price || producto.price
        producto.status = status || producto.status
        producto.stock = stock || producto.stock
        producto.category = category || producto.category
        producto.thumbnails = thumbnails || producto.thumbnails
        await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productos))
        console.log("El Usuario se ha actualizado");
        return producto
    }

    async eliminarProducto(id) {
        const productos = await this.consultaProductos();
        const productoAEliminar = productos.filter(p => p.id !== Number(id));
        await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productoAEliminar));
        console.log("El Usuario se ha eliminado correctamente!");
        return true
    }

}

const PM = new ProductManager()
let productos = []

//? Manejo de productos
app.get('/api/products', async (req, res) => { //Lista todos los productos
    const productos = await PM.consultaProductos()
    if (!productos) { return res.status(404).json({ mensaje: "No hay productos disponibles" }) }
    res.json(productos)
})

app.get('/api/products/:pid', async (req, res) => { //Lista producto por ID
    const { pid } = req.params
    const producto = await PM.consultaProductosxId(pid)
    if (!producto) { return res.status(404).json({ mensaje: "Producto no encontrado" }) }
    res.json(producto)
})

app.post('/api/products', async (req, res) => { // Crea un nuevo producto
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    await PM.agregarProducto(title, description, code, price, status, stock, category, thumbnails)
    res.status(201).json({ mensaje: "Producto creado" })
})

app.put('/api/products/:pid', async (req, res) => { // Actualiza un producto por ID
    const { pid } = req.params
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    const resultado = await PM.actualizarProducto(pid, title, description, code, price, status, stock, category, thumbnails)
    if (!resultado) { return res.status(404).json({ mensaje: "Error al actualizar el producto" }) }
    res.status(201).json({ mensaje: "Producto actualizado" })
})

app.delete('/api/products/:pid', async (req, res) => { // Elimina un producto por ID
    const { pid } = req.params
    const resultado = await PM.eliminarProducto(pid)
    if (!resultado) { return res.status(404).json({ mensaje: "Error al eliminar el producto" }) }
    res.status(201).json({ mensaje: "Producto eliminado" })
})

class CartManager {
    constructor() {
        this.CARRITO_FILE = "carrito.json"
    }

    async consultaCarrito() {
        try {
            const contenido = await fs.readFile(this.CARRITO_FILE, 'utf-8')
            return JSON.parse(contenido || '[]')
        }
        catch (error) {
            return []
        }
    }

    async consultaCarritoxId(id) {
        const carritos = await this.consultaCarrito()
        return carritos.find(c => c.id === parseInt(id))
    }

    async crearCarrito() {
        const carritos = await this.consultaCarrito()
        const nuevoCarrito = { id: carritos.length + 1, products: [] }
        carritos.push(nuevoCarrito)
        await fs.writeFile(this.CARRITO_FILE, JSON.stringify(carritos))
        console.log("Carrito creado correctamente!")
        return nuevoCarrito
    }

    async agregarProductoACarrito(cid, pid, quantity = 1) {
        const carritos = await this.consultaCarrito()
        const carrito = carritos.find(c => c.id === parseInt(cid))
        const producto = await PM.consultaProductosxId(pid)

        if (!carrito) {
            console.log("Carrito no encontrado")
            return
        }

        if (!producto) {
            console.log("Producto no encontrado")
            return
        }

        // Si existe el producto en el carrito, incremento quantity
        const productoExiste = carrito.products.find(p => p.product === parseInt(pid))

        if (productoExiste) {
            productoExiste.quantity += quantity
        } else { // Si no existe, lo agrego
            carrito.products.push({
                product: parseInt(pid),
                quantity: quantity
            })
        }
        await fs.writeFile(this.CARRITO_FILE, JSON.stringify(carritos))
        console.log("Producto agregado al carrito")
        return carrito
    }
}

const CM = new CartManager()

//? Manejo de carritos
app.post('/api/carts', async (req, res) => { // Crea un nuevo carrito
    const nuevoCarrito = await CM.crearCarrito()
    if (!nuevoCarrito) { return res.status(404).json({ mensaje: "Error al crear el carrito" }) }
    res.status(201).json({ mensaje: "Carrito creado", carrito: nuevoCarrito })
})

app.get('/api/carts/:cid', async (req, res) => { //Lista carrito por ID
    const { cid } = req.params
    const carrito = await CM.consultaCarritoxId(cid)
    if (!carrito) { return res.status(404).json({ mensaje: "Carrito no encontrado" }) }
    res.json(carrito)
})

app.post('/api/carts/:cid/product/:pid', async (req, res) => { // Agrega un producto al carrito
    const { cid, pid } = req.params
    const { quantity } = req.body
    const resultado = await CM.agregarProductoACarrito(cid, pid, quantity)
    if (!resultado) { return res.status(404).json({ mensaje: "Error al agregar el producto al carrito" }) }
    res.status(201).json({ mensaje: "Producto agregado al carrito" })
})

app.listen(port, () => { // Inicia el servidor
    console.log(`Servidor corriendo en el puerto ${port}`);
})