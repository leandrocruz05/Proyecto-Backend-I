# Proyecto Backend I - E-commerce API

## 📋 Descripción
> Proyecto integral de backend desarrollado en Node.js y Express que implementa un sistema completo de gestión de productos y carritos de compra, con persistencia en MongoDB, vistas dinámicas en tiempo real utilizando Handlebars y WebSockets, paginación avanzada y sistema de filtros.

---

## Tabla de contenidos
- [Tecnologías y dependencias principales](#tecnologías-y-dependencias-principales)
- [Entregas del proyecto](#entregas-del-proyecto)
  - [Entrega 3 - Paginación, Filtros y Vistas Avanzadas](#entrega-3---paginación-filtros-y-vistas-avanzadas)
  - [Parcial 2 - Handlebars & WebSockets](#parcial-2---handlebars--websockets)
  - [Parcial 1 - API RESTful](#parcial-1---api-restful)
- [Endpoints API](#endpoints-api)
- [Rutas de vistas](#rutas-de-vistas)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Contacto](#contacto)

## Tecnologías y dependencias principales

El stack usado para este proyecto es:

![Node.js Badge](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express Badge](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB Badge](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose Badge](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![Socket.io Badge](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Handlebars Badge](https://img.shields.io/badge/Handlebars.js-f0772b?style=for-the-badge&logo=handlebarsdotjs&logoColor=white)
![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Entregas del proyecto

### FINAL - Paginación, Filtros y Vistas Avanzadas
```
Implementar sistema de paginación avanzada con filtros, ordenamiento y vistas dinámicas para productos y carritos.
```

#### Requerimientos Implementados
#### 1. Sistema de Paginación y Filtros (Productos)

El endpoint `GET /api/products` ahora acepta los siguientes **query params**:

| Parámetro | Tipo | Descripción | Valor por defecto |
|-----------|------|-------------|-------------------|
| `limit` | Number | Número de productos por página | `10` |
| `page` | Number | Número de página a consultar | `1` |
| `sort` | String | Ordenamiento por precio (`asc` / `desc`) | Sin ordenamiento |
| `query` | String | Filtro por categoría o disponibilidad | Búsqueda general |

**Ejemplos de uso:**
```bash
# Obtener primera página con 5 productos
GET /api/products?limit=5&page=1

# Buscar productos de categoría "Camisetas" ordenados por precio ascendente
GET /api/products?query=Camisetas&sort=asc

# Productos disponibles (status=true) en página 2
GET /api/products?query=available&page=2
```

#### 2. Respuesta Estructurada con Metadata

La respuesta del endpoint `GET /api/products` devuelve un **objeto completo** con la siguiente estructura:

```json
{
  "status": "success",
  "payload": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Camiseta Titular",
      "description": "Camiseta oficial del club",
      "code": "PRD001",
      "price": 70000,
      "status": true,
      "stock": 10,
      "category": "Camisetas",
      "thumbnails": ["/img/camiseta.jpg"]
    }
  ],
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?page=1&limit=10",
  "nextLink": "/api/products?page=3&limit=10"
}
```

#### 3. Endpoints Avanzados de Carritos

Se agregaron nuevos endpoints al router `/api/carts`:

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `DELETE` | `/api/carts/:cid/products/:pid` | Elimina un producto específico del carrito | - |
| `PUT` | `/api/carts/:cid` | Actualiza el carrito con un array completo de productos | `{ "products": [...] }` |
| `PUT` | `/api/carts/:cid/products/:pid` | Actualiza solo la cantidad de un producto | `{ "quantity": 5 }` |
| `DELETE` | `/api/carts/:cid` | Elimina todos los productos del carrito | - |

#### 4. Vistas Dinámicas con Handlebars

##### Vista `/products`
- ✅ Muestra todos los productos con **paginación**
- ✅ Controles de navegación entre páginas (prev/next)
- ✅ Dos modos de interacción:
  - **Opción A:** Enlace a `/products/:pid` para ver detalles completos + botón "Agregar al carrito"
  - **Opción B:** Botón "Agregar al carrito" directo desde el listado

##### Vista `/carts/:cid`
- ✅ Visualiza un carrito específico por su ID
- ✅ Lista **solo los productos** que pertenecen a ese carrito
- ✅ Muestra cantidad y subtotal por producto
- ✅ Utiliza `.populate()` para mostrar información completa de productos

### Parcial 2 - Handlebars & WebSockets

```
Integrar al servidor basado en express un motor de plantillas Handlebars y un servidor de socket.io para implementar vistas dinámicas que se actualicen en tiempo real. 
```

#### Requerimientos Implementados

##### 1. Configuración del Servidor
- ✅ Integración del motor de plantillas **Handlebars**
- ✅ Instalación y configuración de servidor **Socket.io**
- ✅ Configuración de archivos estáticos con Express

##### 2. Vista `home.handlebars`
- ✅ Endpoint: `/` (raíz del sitio)
- ✅ Muestra lista completa de productos agregados
- ✅ Renderizado con datos desde el servidor
- ✅ Enlace para acceder a vista en tiempo real

##### 3. Vista `realTimeProducts.handlebars`
- ✅ Endpoint: `/realtimeproducts`
- ✅ Formulario para **agregar productos** mediante WebSockets
- ✅ Lista dinámica de productos con **actualización en tiempo real**
- ✅ Botones para **eliminar productos** individualmente
- ✅ Sincronización automática entre todos los clientes conectados

#### 🔧 Aspectos Técnicos Destacados

**Integración HTTP con WebSockets:**
```javascript
// app.js - Permite usar Socket.io desde rutas HTTP
app.set('socketServer', socketServer)

// Ejemplo en routes/products.routes.js
const socketServer = req.app.get('socketServer')
socketServer.emit('productos', productos)
```

---

### Parcial 1 - API RESTful
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
| `POST` | `/api/carts` | Crea nuevo carrito vacío | - |
| `GET` | `/api/carts/:cid` | Obtiene carrito con productos completos | - |
| `POST` | `/api/carts/:cid/product/:pid` | Agrega producto al carrito | `{ "quantity": 2 }` |
| `DELETE` | `/api/carts/:cid/products/:pid` | Elimina un producto del carrito | - |
| `PUT` | `/api/carts/:cid` | Actualiza carrito completo | `{ "products": [...] }` |
| `PUT` | `/api/carts/:cid/products/:pid` | Actualiza cantidad de un producto | `{ "quantity": 5 }` |
| `DELETE` | `/api/carts/:cid` | Vacía el carrito | - |


#### Estructura de Carrito
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "products": [
    {
      "product": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Camiseta Titular",
        "price": 70000
      },
      "quantity": 3
    }
  ]
}
```

---

## Rutas de Vistas

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | `home.handlebars` | Lista estática de productos |
| `/realtimeproducts` | `realTimeProducts.handlebars` | Gestión en tiempo real con WebSockets |
| `/products` | `products.handlebars` | Lista de productos con paginación |
| `/products/:pid` | `productDetail.handlebars` | Detalle completo de un producto |
| `/carts/:cid` | `cart.handlebars` | Visualización de carrito específico |

---


## Instalación y ejecución local

### Prerrequisitos
- Node.js v14 o superior
- npm
- MongoDB instalado y corriendo localmente o MongoDB Atlas

### Pasos de Instalación

```bash
# 1. Clona este repositorio
git clone https://github.com/leandrocruz05/Proyecto-Backend-I.git

# 2. Ingresa al directorio
cd Proyecto-Backend-I

# 3. Instala las dependencias
npm install

# 4. (Opcional) Configura tus variables de entorno en .env
# Ejemplo: MONGO_URI=mongodb://localhost:27017/ecommerce

# 5. Inicia la app en modo desarrollo
npm run dev

# O iniciar en modo producción
npm start
```

### Acceso a la Aplicación
- **Servidor:** http://localhost:8080
- **Vista Home:** http://localhost:8080/
- **Vista Tiempo Real:** http://localhost:8080/realtimeproducts
- **Vista Productos (Paginación):** http://localhost:8080/products
- **API Productos:** http://localhost:8080/api/products
- **API Carritos:** http://localhost:8080/api/carts

---

## 👤 Autor

**Leandro Cruz** - [@leandrocruz05](https://github.com/leandrocruz05)  
Proyecto: [https://github.com/leandrocruz05/Proyecto-Backend-I](https://github.com/leandrocruz05/Proyecto-Backend-I)

---

**Última actualización:** Enero 2026