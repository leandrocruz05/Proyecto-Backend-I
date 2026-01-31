const socket = io()
const productoForm = document.getElementById('listaProductos')
let usuario
let productosActuales = []
let categoriasUnicas = new Set()

// Recibir lista de productos
socket.on('productos', (productos) => {
    productosActuales = productos
    actualizarCategorias(productos)
    renderizarProductos(productos)
})

// Función para actualizar categorías del filtro
function actualizarCategorias(productos) {
    categoriasUnicas.clear()
    productos.forEach(producto => {
        if (producto.category) {
            categoriasUnicas.add(producto.category)
        }
    })
    
    const categoryFilter = document.getElementById('categoryFilter')
    const categoriaActual = categoryFilter.value
    categoryFilter.innerHTML = '<option value="">Todas las categorías</option>'
    
    Array.from(categoriasUnicas).sort().forEach(categoria => {
        const option = document.createElement('option')
        option.value = categoria
        option.textContent = categoria
        if (categoria === categoriaActual) {
            option.selected = true
        }
        categoryFilter.appendChild(option)
    })
}

// Función para renderizar productos
function renderizarProductos(productos) {
    productoForm.innerHTML = ''

    productos.forEach((producto) => {
        const tr = `<tr>
                        <td>${producto.title}</td>
                        <td>${producto.description}</td>
                        <td class="text-nowrap">$${producto.price}</td>
                        <td><span class="badge bg-info">${producto.stock}</span></td>
                        <td><span class="badge bg-secondary">${producto.category}</span></td>
                        <td>
                            <button class="btn btn-warning btn-sm me-1" onclick="abrirModalEditar('${producto._id}')" title="Editar">
                                <i class="bi bi-pencil-fill"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${producto._id}')" title="Eliminar">
                                <i class="bi bi-trash-fill"></i>
                            </button>
                        </td>
                    </tr>`
        productoForm.innerHTML += tr
    })
}

// Aplicar filtros y ordenamiento
async function aplicarFiltros() {
    const query = document.getElementById('searchQuery').value
    const category = document.getElementById('categoryFilter').value
    const sort = document.getElementById('sortOrder').value
    
    try {
        let url = '/api/products?limit=100'
        
        if (sort) url += `&sort=${sort}`
        if (category) url += `&query=${encodeURIComponent(category)}`
        
        const response = await fetch(url)
        const data = await response.json()
        
        let productos = data.payload || []
        
        // Filtrar por búsqueda local
        if (query) {
            const queryLower = query.toLowerCase()
            productos = productos.filter(p => 
                p.title.toLowerCase().includes(queryLower) ||
                p.description.toLowerCase().includes(queryLower) ||
                p.code.toLowerCase().includes(queryLower)
            )
        }
        
        productosActuales = productos
        renderizarProductos(productos)
    } catch (error) {
        console.error('Error al aplicar filtros:', error)
        alert('Error al filtrar productos')
    }
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('searchQuery').value = ''
    document.getElementById('categoryFilter').value = ''
    document.getElementById('sortOrder').value = ''
    renderizarProductos(productosActuales)
}

// Abrir modal de edición
function abrirModalEditar(id) {
    const producto = productosActuales.find(p => p._id === id)
    
    if (!producto) {
        alert('Producto no encontrado')
        return
    }
    
    document.getElementById('edit_id').value = producto._id
    document.getElementById('edit_title').value = producto.title
    document.getElementById('edit_description').value = producto.description
    document.getElementById('edit_code').value = producto.code
    document.getElementById('edit_price').value = producto.price
    document.getElementById('edit_stock').value = producto.stock
    document.getElementById('edit_category').value = producto.category
    
    const modal = new bootstrap.Modal(document.getElementById('editModal'))
    modal.show()
}

// Guardar edición del producto
async function guardarEdicion() {
    const form = document.getElementById('formEditarProducto')
    const formData = new FormData(form)
    
    const id = formData.get('id')
    const productoActualizado = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        category: formData.get('category')
    }
    
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoActualizado)
        })
        
        if (!response.ok) {
            throw new Error('Error al actualizar el producto')
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'))
        modal.hide()
        
        alert('Producto actualizado exitosamente')
    } catch (error) {
        console.error('Error:', error)
        alert('Error al actualizar el producto')
    }
}

// Cargar y mostrar carritos
async function cargarCarritos() {
    try {
        const response = await fetch('/api/carts')
        
        if (!response.ok) {
            throw new Error('Error al cargar carritos')
        }
        
        const carritos = await response.json()
        const listaCarritos = document.getElementById('listaCarritos')
        
        if (!carritos || carritos.length === 0) {
            listaCarritos.innerHTML = '<p class="text-muted">No hay carritos creados.</p>'
            return
        }
        
        let html = '<div class="accordion" id="accordionCarritos">'
        
        carritos.forEach((carrito, index) => {
            const totalProductos = carrito.products.reduce((sum, item) => sum + item.quantity, 0)
            const totalPrecio = carrito.products.reduce((sum, item) => {
                const precio = item.product?.price || 0
                return sum + (precio * item.quantity)
            }, 0)
            
            html += `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${index}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                data-bs-target="#collapse${index}" aria-expanded="false">
                            <strong>Carrito ID:</strong>&nbsp;${carrito._id} 
                            <span class="ms-3 badge bg-primary">${totalProductos} productos</span>
                            <span class="ms-2 badge bg-success">Total: $${totalPrecio.toFixed(2)}</span>
                        </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#accordionCarritos">
                        <div class="accordion-body">
                            ${carrito.products.length === 0 ? 
                                '<p class="text-muted">Carrito vacío</p>' : 
                                `<table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio</th>
                                            <th>Cantidad</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${carrito.products.map(item => {
                                            const producto = item.product || {}
                                            const subtotal = (producto.price || 0) * item.quantity
                                            return `<tr>
                                                <td>${producto.title || 'Producto eliminado'}</td>
                                                <td>$${(producto.price || 0).toFixed(2)}</td>
                                                <td>${item.quantity}</td>
                                                <td>$${subtotal.toFixed(2)}</td>
                                            </tr>`
                                        }).join('')}
                                    </tbody>
                                </table>`
                            }
                            <div class="mt-3">
                                <a href="/carts/${carrito._id}" class="btn btn-sm btn-info" target="_blank">
                                    Ver detalles completos
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `
        })
        
        html += '</div>'
        listaCarritos.innerHTML = html
        
    } catch (error) {
        console.error('Error al cargar carritos:', error)
        document.getElementById('listaCarritos').innerHTML = 
            '<div class="alert alert-danger">Error al cargar los carritos</div>'
    }
}

// Escuchar notificación de usuario conectado
socket.on('usuarioConectado', (mensaje) => {
    alert(mensaje)
})

// Funcion eliminar producto
function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        socket.emit('eliminarProducto', id)
    }
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
        thumbnails: []
    }
    socket.emit('agregarProducto', producto)
    evento.target.reset()
})



