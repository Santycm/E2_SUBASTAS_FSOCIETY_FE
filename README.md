# Plataforma de Subastas en Línea – Frontend

Aplicación web para una plataforma de subastas en línea que permite a los usuarios explorar artículos disponibles, participar mediante ofertas en tiempo real, publicar sus propias subastas y gestionar sus órdenes y ventas.

El frontend consume la API REST del proyecto **Plataforma de Subastas en Línea**, utiliza Socket.IO para recibir actualizaciones en tiempo real y se integra con Mercado Pago para el flujo de pago de las subastas ganadas.

## Nombre de la materia

ELECTIVA II - DESARROLLO

## Nombre del proyecto

Plataforma de Subastas en Línea

## Equipo

FSOCIETY

## Integrantes

- Santiago Castaño Moreno

## Tecnologías

- **Vue 3:** framework de JavaScript para la construcción de interfaces de usuario mediante componentes.
- **TypeScript:** lenguaje de programación que proporciona tipado estático y mayor seguridad durante el desarrollo.
- **Vite:** herramienta de desarrollo y compilación del proyecto.
- **Tailwind CSS 4:** framework de estilos basado en clases de utilidad.
- **Vue Router:** gestión de rutas y navegación entre las vistas de la aplicación.
- **Pinia:** administración del estado global, especialmente para la autenticación y los datos del usuario.
- **Axios:** cliente HTTP para consumir los endpoints de la API REST.
- **Socket.IO Client:** comunicación en tiempo real para recibir actualizaciones de ofertas y estados de las subastas.
- **Lucide Vue:** biblioteca de iconos para la interfaz.
- **Reka UI:** componentes y primitivas para construir elementos interactivos.
- **Vue Sonner:** notificaciones y mensajes de retroalimentación.
- **VeeValidate y Zod:** validación y gestión de formularios.
- **date-fns:** manipulación y presentación de fechas.

## Requisitos previos

- Node.js y npm.
- Una instancia de la API REST de la Plataforma de Subastas en Línea en ejecución.
- Acceso a la instancia de MongoDB configurada por el backend.
- Credenciales y configuración de Mercado Pago gestionadas desde el backend para las funcionalidades de pago.

## Instalación

Clona el repositorio y accede al directorio del proyecto:

```bash
git clone <URL_DEL_REPOSITORIO_FRONTEND>
cd e2-subastas-frontend
```

Instala las dependencias:

```bash
npm install
```

Configura las variables de entorno antes de iniciar la aplicación.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | Dirección base de la API REST utilizada para las solicitudes HTTP. |
| `VITE_SOCKET_URL` | Dirección del servidor utilizado para establecer la conexión mediante Socket.IO. |

Los valores indicados corresponden a una ejecución local del backend en el puerto `5000`. Deben ajustarse según la dirección y el puerto donde se encuentre desplegada la API.

Las variables utilizadas por Vite deben llevar el prefijo `VITE_` para estar disponibles en el código del frontend.

No almacenes credenciales privadas, secretos JWT ni credenciales de Mercado Pago en las variables del frontend. La gestión de estas credenciales corresponde exclusivamente al backend.

## Ejecución

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Compilar la aplicación para producción:

```bash
npm run build
```

El proceso de compilación ejecuta primero la verificación de tipos de TypeScript y posteriormente genera los archivos optimizados mediante Vite.

Previsualizar la versión compilada:

```bash
npm run preview
```

Por defecto, Vite inicia el servidor de desarrollo en el puerto `5173`. La dirección local se muestra en la terminal al ejecutar el proyecto.

## Funcionalidades

### Autenticación y usuarios

- Registro de nuevos usuarios.
- Inicio y cierre de sesión mediante autenticación JWT.
- Persistencia del estado de autenticación en la aplicación.
- Consulta de la información del perfil.
- Consulta de subastas publicadas y participaciones del usuario.

### Gestión de subastas

- Visualización del catálogo de subastas disponibles.
- Filtrado por categoría y estado.
- Navegación mediante paginación.
- Consulta del detalle de cada subasta.
- Publicación de nuevas subastas.
- Cancelación de subastas propias cuando se cumplen las condiciones establecidas por el backend.
- Consulta de información pública de los vendedores.

### Ofertas en tiempo real

- Consulta del historial de ofertas.
- Registro de nuevas ofertas.
- Visualización de ofertas aceptadas y rechazadas.
- Actualización de información mediante Socket.IO.
- Notificaciones de nuevas ofertas y cambios en el estado de las subastas.

### Órdenes y pagos

- Consulta de órdenes de compra.
- Consulta de ventas realizadas por el usuario.
- Visualización del detalle de las órdenes.
- Consulta del estado y vencimiento de las órdenes.
- Redirección al checkout de Mercado Pago para completar los pagos.
- Consulta del resultado del proceso de pago y actualización del estado de la orden.

## Arquitectura y organización

El frontend utiliza una organización basada en componentes, vistas, servicios y módulos reutilizables de Vue.

La estructura separa la presentación de la lógica de comunicación con el backend, la administración del estado global y los tipos utilizados para representar la información de la aplicación.

```text
src/
├── assets/
│   └── main.css
├── components/
│   ├── auctions/
│   ├── common/
│   └── layout/
├── composables/
│   └── useAuctionSocket.ts
├── router/
│   └── index.ts
├── services/
│   ├── auction.service.ts
│   ├── auth.service.ts
│   ├── bid.service.ts
│   ├── category.service.ts
│   ├── http.ts
│   ├── order.service.ts
│   └── user.service.ts
├── stores/
│   └── auth.store.ts
├── types/
│   ├── auction.types.ts
│   ├── auth.types.ts
│   ├── bid.types.ts
│   ├── category.types.ts
│   ├── order.types.ts
│   ├── pagination.types.ts
│   └── user.types.ts
├── utils/
│   ├── currency.ts
│   └── date.ts
├── views/
│   ├── AuctionDetailView.vue
│   ├── AuctionsView.vue
│   ├── CreateAuctionView.vue
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── MyOrdersView.vue
│   ├── MyProfileView.vue
│   ├── MySalesView.vue
│   ├── OrderDetailView.vue
│   ├── PaymentResultView.vue
│   └── RegisterView.vue
├── App.vue
├── main.ts
└── env.d.ts
```

### Descripción de los módulos

| Módulo | Responsabilidad |
|---|---|
| `components/` | Componentes reutilizables de interfaz, tarjetas de subastas, formularios, navegación y elementos comunes. |
| `composables/` | Lógica reutilizable de Vue, incluyendo la conexión y gestión de eventos de Socket.IO. |
| `router/` | Definición de rutas y navegación de la aplicación. |
| `services/` | Comunicación HTTP con los endpoints de la API REST. |
| `stores/` | Administración del estado global mediante Pinia. |
| `types/` | Interfaces y tipos de TypeScript para las entidades y respuestas del backend. |
| `utils/` | Funciones auxiliares para formatos de moneda y fechas. |
| `views/` | Vistas principales de la aplicación. |

## Integración con el backend

La aplicación frontend se comunica con la API REST mediante Axios y utiliza Socket.IO Client para recibir eventos relacionados con las subastas.

Las principales funcionalidades integradas corresponden a:

- **Autenticación:** registro, inicio de sesión y consultas del usuario autenticado.
- **Subastas:** consulta, creación, filtrado y cancelación.
- **Categorías:** consulta de las categorías disponibles.
- **Ofertas:** registro y consulta de ofertas asociadas a una subasta.
- **Órdenes:** consulta de compras, ventas y detalles de las órdenes.
- **Pagos:** creación del proceso de pago y redirección al checkout de Mercado Pago.

La comunicación en tiempo real utiliza eventos de Socket.IO para mantener actualizada la información de las subastas, incluyendo nuevas ofertas, notificaciones de superación de ofertas y cierre de subastas.

## Consideraciones

- La API REST es responsable de aplicar las reglas de negocio y validar las operaciones realizadas desde el frontend.
- Las rutas que requieren autenticación utilizan el token JWT proporcionado por el backend.
- Los importes monetarios se representan en pesos colombianos (COP).
- Las fechas recibidas desde el backend se presentan utilizando la zona horaria local del navegador.
- El procesamiento y la validación de pagos se realizan desde el backend mediante la integración con Mercado Pago.
- Las credenciales privadas y secretos de integración no deben exponerse en el código del frontend.

## Proyecto relacionado

Este frontend forma parte del proyecto **Plataforma de Subastas en Línea**, desarrollado por el equipo FSOCIETY para la materia ELECTIVA II - DESARROLLO.

La aplicación trabaja conjuntamente con el backend, encargado de la lógica de negocio, persistencia de datos, autenticación, gestión de ofertas y procesamiento de pagos.