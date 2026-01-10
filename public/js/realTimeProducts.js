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

    const producto = {
        title: evento.target.title.value,
        description: evento.target.description.value,
        code: evento.target.code.value,
        price: parseFloat(evento.target.price.value),
        status: evento.target.status.checked,
        stock: parseInt(evento.target.stock.value),
        category: evento.target.category.value,
        thumbnails: []
    }
    socket.emit('agregarProducto', producto)
    evento.target.reset()
})


