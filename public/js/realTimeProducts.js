const socket = io()
const productoForm = document.getElementById('listaProductos')
let usuario

// Recibir lista de productos
socket.on('productos', (productos) => {
    productoForm.innerHTML = ''

    productos.forEach((producto) => {
        const tr = `<tr>
                        <td>${producto.id}</td>
                        <td>${producto.title}</td>
                        <td>${producto.description}</td>
                        <td>${producto.price}</td>
                        <td>${producto.stock}</td>
                        <td>${producto.category}</td>
                        <td><button onclick="eliminarProducto(${producto.id})">Eliminar</button></td>
                    </tr>`
        productoForm.innerHTML += tr
    })
})

// Escuchar notificación de usuario conectado
socket.on('usuarioConectado', (mensaje) => {
    alert(mensaje)
})

// Funcion eliminar producto
function eliminarProducto(id) {
    socket.emit('eliminarProducto', id)
}

// Funcion agregar producto
document.getElementById('formAgregarProducto').addEventListener('submit', (evento) => {
    evento.preventDefault()
    
    const formData = new FormData(evento.target)
    const producto = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        category: formData.get('category'),
        status: true,
        thumbnails: []
    }
    socket.emit('agregarProducto', producto)
    evento.target.reset()
})


