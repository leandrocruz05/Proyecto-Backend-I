const fs = require('fs').promises
const path = require('path')
const ProductManager = require('./ProductManager')

class CartManager {
    constructor() {
        this.CARRITO_FILE = path.join(__dirname, '../data/carts.json')
        this.PM = new ProductManager()
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
        const producto = await this.PM.consultaProductosxId(pid)

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

module.exports = CartManager