# Proyecto Backend I - E-commerce API

## 📋 Descripción
> Proyecto integral de backend desarrollado en Node.js y Express que implementa un sistema completo de gestión de productos y carritos de compra, con vistas dinámicas en tiempo real utilizando Handlebars y WebSockets.

---

## Parcial 2 - Handlebars & WebSockets
```
Integrar al servidor basado en express un motor de plantillas Handlebars y un servidor de socket.io para implementar vistas dinámicas que se actualicen en tiempo real. 
```
### Requerimientos Implementados

#### 1.  Configuración del Servidor
- ✅ Integración del motor de plantillas **Handlebars**
- ✅ Instalación y configuración de servidor **Socket.io**
- ✅ Configuración de archivos estáticos con Express

#### 2. Vista `home.handlebars`
- ✅ Endpoint:  `/` (raíz del sitio)
- ✅ Muestra lista completa de productos agregados
- ✅ Renderizado con datos desde el servidor
- ✅ Enlace para acceder a vista en tiempo real

#### 3. Vista `realTimeProducts.handlebars`
- ✅ Endpoint: `/realtimeproducts`
- ✅ Formulario para **agregar productos** mediante WebSockets
- ✅ Lista dinámica de productos con **actualización en tiempo real**
- ✅ Botones para **eliminar productos** individualmente
- ✅ Sincronización automática entre todos los clientes conectados

### 🔧 Aspectos Técnicos Destacados

#### Integración HTTP con WebSockets
```javascript
// app.js - Permite usar Socket.io desde rutas HTTP
app.set('socketServer', socketServer)

// Ejemplo en routes/products.routes.js
const socketServer = req.app.get('socketServer')
socketServer.emit('productos', productos)
```


---
## Parcial 1.
```
Desarrollar un servidor que contenga los endpoints y servicios necesarios para gestionar los productos y carritos de compra para tu API.
```
### Desarrollo de servidor
- ✅ Servidor basado en **Node.js** y **Express**
- ✅ Puerto:  **8080**
- ✅ Arquitectura RESTful con routers separados */products y /carts*
- ✅ Persistencia en archivos JSON

## 🛣️ Endpoints API
### 📦 Productos (`/api/products`)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `GET` | `/api/products` | Lista todos los productos | - |
| `GET` | `/api/products/:pid` | Obtiene producto por ID | - |
| `POST` | `/api/products` | Crea nuevo producto | Ver estructura ⬇️ |
| `PUT` | `/api/products/:pid` | Actualiza producto | Campos a modificar |
| `DELETE` | `/api/products/:pid` | Elimina producto | - |

#### Estructura de Producto
```json
{
  "id": 1,                    // Autogenerado
  "title": "Camiseta Titular",
  "description": "Camiseta oficial.. .",
  "code": "PRD001",
  "price": 70000,
  "status": true,
  "stock": 10,
  "category": "Camisetas",
  "thumbnails": ["/img/camiseta. jpg"]
}
```
### 🛒 Carritos (`/api/carts`)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `POST` | `/api/carts` | Crea nuevo carrito | - |
| `GET` | `/api/carts/: cid` | Lista productos del carrito | - |
| `POST` | `/api/carts/:cid/product/: pid` | Agrega producto al carrito | `{ "quantity": 2 }` |

#### Estructura de Carrito
```json
{
  "id": 1,                    // Autogenerado
  "products": [
    {
      "product":  5,           // ID del producto
      "quantity": 3           // Se incrementa si ya existe
    }
  ]
}
```

## 🖥️ Rutas de Vistas

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | `home.handlebars` | Lista estática de productos |
| `/realtimeproducts` | `realTimeProducts.handlebars` | Gestión en tiempo real con WebSockets |

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js v14 o superior
- npm

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/leandrocruz05/Proyecto-Backend-I.git
cd Proyecto-Backend-I

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor en modo desarrollo
npm run dev

# O iniciar en modo producción
npm start
```

### Acceso a la Aplicación
- **Servidor:** http://localhost:8080
- **Vista Home:** http://localhost:8080/
- **Vista Tiempo Real:** http://localhost:8080/realtimeproducts
- **API Productos:** http://localhost:8080/api/products
- **API Carritos:** http://localhost:8080/api/carts

## 📄 Licencia

ISC

---

## 👤 Autor

**Leandro Cruz**  
GitHub: [@leandrocruz05](https://github.com/leandrocruz05)

---

**Última actualización:** Enero 2026