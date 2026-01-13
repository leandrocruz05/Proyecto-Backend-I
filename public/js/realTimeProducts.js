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
                        <td class="text-nowrap">$${producto.price}</td>
                        <td><span class="badge bg-info">${producto.stock}</span></td>
                        <td><span class="badge bg-secondary">${producto.category}</span></td>
                        <td><button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button></td>
                    </tr>
                    `
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
        status: formData.get('status') === 'on',
        stock: parseInt(formData.get('stock')),
        category: formData.get('category'),
        thumbnails: []
    }
    socket.emit('agregarProducto', producto)
    evento.target.reset()
})


