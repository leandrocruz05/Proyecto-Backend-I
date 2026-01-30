//* const fs = require('fs').promises
//* const path = require('path')
import CartModel from '../models/carts.model.js'
import ProductModel from '../models/products.model.js'

class CartManager {
    constructor() {
        //* this.CARRITO_FILE = path.join(__dirname, '../data/carts.json')
        //* this.PM = new ProductManager()
    }

    async consultaCarrito() {
        try {
            //* const contenido = await fs.readFile(this.CARRITO_FILE, 'utf-8')
            //* return JSON.parse(contenido || '[]')

            const carritos = await CartModel.find().populate('products.product')
            return carritos
        }
        catch (error) {
            console.error("Error al consultar carritos:", error);
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    async consultaCarritoxId(id) {
        try {
            //* const carritos = await this.consultaCarrito()
            //* return carritos.find(c => c.id === parseInt(id))

            const carrito = await CartModel.findById(id).populate('products.product')

            if (!carrito) {
                console.log("Carrito no encontrado")
                return {
                    status: 'error',
                    error: "Carrito no encontrado"
                }
            }
            return carrito

        } catch (error) {
            console.error("Error al consultar carrito por ID:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    async crearCarrito() {
        try {
            //* const carritos = await this.consultaCarrito()
            //* const nuevoCarrito = { id: carritos.length + 1, products: [] }
            //* carritos.push(nuevoCarrito)
            //* await fs.writeFile(this.CARRITO_FILE, JSON.stringify(carritos))
            //* console.log("Carrito creado correctamente!")
            //* return nuevoCarrito

            const nuevoCarrito = new CartModel({ products: [] })
            await nuevoCarrito.save()
            console.log("Carrito creado correctamente!")
            return nuevoCarrito
        } catch (error) {
            console.error("Error al crear el carrito:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }


    async agregarProductoACarrito(cid, pid, quantity = 1) {
        try {
            //* const carritos = await this.consultaCarrito()
            //* const carrito = carritos.find(c => c.id === parseInt(cid))
            //* const producto = await this.PM.consultaProductosxId(pid)

            const carrito = await CartModel.findById(cid)
            const producto = await ProductModel.findById(pid)

            if (!carrito) {
                console.log("Carrito no encontrado")
                return {
                    status: 'error',
                    error: "Carrito no encontrado"
                }
            }

            if (!producto) {
                console.log("Producto no encontrado")
                return {
                    status: 'error',
                    error: "Producto no encontrado"
                }
            }

            //! Si existe el producto en el carrito, incremento quantity
            //* const productoExiste = carrito.products.find(p => p.product === parseInt(pid))
            const productoExiste = carrito.products.find(p => p.product.toString() === pid)

            if (productoExiste) {
                productoExiste.quantity += quantity
            } else { //! Si no existe, lo agrego
                carrito.products.push({
                    product: pid,
                    quantity: quantity
                })
            }

            //* await fs.writeFile(this.CARRITO_FILE, JSON.stringify(carritos))
            await carrito.save()
            console.log("Producto agregado al carrito")
            return await CartModel.findById(cid).populate('products.product')
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    async eliminarProductoDeCarrito(cid, pid) {
        try {
            const carrito = await CartModel.findById(cid)

            if (!carrito) {
                console.log("Carrito no encontrado")
                return {
                    status: 'error',
                    error: "Carrito no encontrado"
                }
            }

            carrito.products = carrito.products.filter(p => p.product.toString() !== pid)

            await carrito.save()
            console.log("Producto eliminado del carrito")

            return await CartModel.findById(cid).populate('products.product')
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    async actualizarCarrito(cid, productos) {
        try {
            const carrito = await CartModel.findById(cid)

            if (!carrito) {
                console.log("Carrito no encontrado")
                return {
                    status: 'error',
                    error: "Carrito no encontrado"
                }
            }

            //! Verificar que todos los productos existen
            for (const item of productos) {
                const producto = await ProductModel.findById(item.product)

                if (!producto) {
                    console.log(`Producto con ID ${item.product} no encontrado`)
                    return {
                        status: 'error',
                        error: `Producto con ID ${item.product} no encontrado`
                    }
                }
            }

            //! Actualizar productos
            carrito.products = productos
            await carrito.save()
            console.log("Carrito actualizado correctamente")

            return await CartModel.findById(cid).populate('products.product')
        } catch (error) {
            console.error("Error al actualizar el carrito:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    async actualizarCantidadProducto(cid, pid, quantity) {
        try {
            const carrito = await CartModel.findById(cid)

            if (!carrito) {
                console.log("Carrito no encontrado")
                return {
                    status: 'error',
                    error: "Carrito no encontrado"
                }
            }

            //! Buscar el producto en el carrito
            const productoEnCarrito = carrito.products.find(p => p.product.toString() === pid)

            if (!productoEnCarrito) {
                console.log("Producto no encontrado en el carrito")
                return {
                    status: 'error',
                    error: "Producto no encontrado en el carrito"
                }
            }

            //! Actualizar la cantidad
            productoEnCarrito.quantity = quantity
            await carrito.save()
            console.log("Cantidad de producto actualizada correctamente")

            return await CartModel.findById(cid).populate('products.product')
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    async vaciarCarrito(cid) {
        try {
            const carrito = await CartModel.findById(cid)

            if (!carrito) {
                console.log("Carrito no encontrado")
                return {
                    status: 'error',
                    error: "Carrito no encontrado"
                }
            }

            carrito.products = []
            await carrito.save()

            console.log("Carrito vaciado correctamente")
            return carrito
        } catch (error) {
            console.error("Error al vaciar el carrito:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }

    async eliminarCarrito(cid) {
        try {
            const carrito = await CartModel.findByIdAndDelete(cid)

            if (!carrito) {
                console.log("Carrito no encontrado")
                return {
                    status: 'error',
                    error: "Carrito no encontrado"
                }
            }

            console.log("Carrito eliminado permanentemente")
            return { status: 'success', mensaje: 'Carrito eliminado' }
        } catch (error) {
            console.error("Error al eliminar el carrito:", error)
            return {
                status: 'error',
                error: error.message
            }
        }
    }
}

export default CartManager