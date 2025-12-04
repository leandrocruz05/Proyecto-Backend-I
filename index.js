const express = require('express')
const fs = require('fs').promises
const port = 8080

const app = express();
app.use(express.json());

class ProductManager {
    constructor() {
        this.productos = []
        this.PRODUCTOS_FILE = 'products.json'
    }

    async getID() {
        return (await this.consultaProductos()).length + 1
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
        const nuevoProducto = { id: await this.getID(), title, description, code, price, status, stock, category, thumbnails };
        productos.push(nuevoProducto)
        await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productos))
        console.log("El producto se ha agregado correctamente!");
    }

    async actualizarProducto(id, title, description, code, price, status, stock, category, thumbnails) {
        const productos = await this.consultaProductos()
        const producto = productos.find(p => p.id === parseInt(id))
        if (!producto) { return res.status(404).json({ mensaje: "El producto no fue encontrado" }) }
        producto.title = title || producto.title
        producto.description = description || producto.description
        producto.code = code || producto.code
        producto.price = price || producto.price
        producto.status = status || producto.status
        producto.stock = stock || producto.stock
        producto.category = category || producto.category
        producto.thumbnails = thumbnails || producto.thumbnails
        await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productos))
        console.log("El Usuario se ha actualizado correctamente!");
    }

    async eliminarProducto(id) {
        const productos = await this.consultaProductos();
        const productoAEliminar = productos.filter(p => p.id !== Number(id));
        await fs.writeFile(this.PRODUCTOS_FILE, JSON.stringify(productoAEliminar));
        console.log("El Usuario se ha eliminado correctamente!");
    }

}

const PM = new ProductManager()
let productos = []

//? Manejo de productos
app.get('/api/products', async (req, res) => { //Lista todos los productos
    productos = await PM.consultaProductos()
    res.json(productos)
})

app.get('/api/products/:pid', async (req, res) => { //Lista producto por ID
    const { pid } = req.params
    const producto = await PM.consultaProductosxId(pid)
    if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" })
    }
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
    await PM.actualizarProducto(pid, title, description, code, price, status, stock, category, thumbnails)
    res.json({ mensaje: "Producto actualizado" })
})

app.delete('/api/products/:pid', async (req, res) => { // Elimina un producto por ID
    const { pid } = req.params
    await PM.eliminarProducto(pid)
    res.json({ mensaje: "Producto eliminado" })
})

app.listen(port, () => { // Inicia el servidor
    console.log(`Servidor corriendo en el puerto ${port}`);
})
