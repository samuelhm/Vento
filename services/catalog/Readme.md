
# DOCUMENTACIÓN DE API: CATEGORÍAS Y ANUNCIOS (LISTINGS)

## 1. CATEGORÍAS

### **Obtener categorías principales**

* **Ruta:** `GET /categories`
* **Descripción:** Retorna todas las categorías madres y la cantidad de artículos publicados por categoría.
* **Response:**

```json
{
  "status": "success",
  "data": [
    { "name": "Bicicletas", "count": 1 },
    { "name": "Cine, libros y música", "count": 0 },
    { "name": "Coches", "count": 0 },
    { "name": "Coleccionismo", "count": 0 },
    { "name": "Construcción y reformas", "count": 0 },
    { "name": "Deporte y ocio", "count": 4 },
    { "name": "Electrodomésticos", "count": 1 },
    { "name": "Empleo", "count": 0 },
    { "name": "Hogar y jardín", "count": 4 },
    { "name": "Industria y agricultura", "count": 0 },
    { "name": "Moda y accesorios", "count": 4 },
    { "name": "Motor y accesorios", "count": 0 },
    { "name": "Motos", "count": 0 },
    { "name": "Niños y bebés", "count": 0 },
    { "name": "Otros", "count": 0 },
    { "name": "Servicios", "count": 0 },
    { "name": "Tecnología y electrónica", "count": 6 }
  ]
}

```

### **Obtener árbol de categorías**

* **Ruta:** `GET /categories/tree`
* **Descripción:** Retorna todo el árbol de categorías y la cantidad de anuncios por cada categoría y subcategoría.
* **Response:**

```json
{
  "id": 4,
  "name": "Moda y accesorios",
  "count": 4,
  "path": "Moda y accesorios",
  "subcategories": [
    {
      "id": 38,
      "name": "Mujer",
      "count": 3,
      "path": "Moda y accesorios>Mujer",
      "subcategories": [
        { "id": 138, "name": "Calzado", "count": 1, "path": "Moda y accesorios>Mujer>Calzado", "subcategories": [] },
        { "id": 139, "name": "Ropa", "count": 2, "path": "Moda y accesorios>Mujer>Ropa", "subcategories": [] }
      ]
    },
    {
      "id": 39,
      "name": "Hombre",
      "count": 1,
      "path": "Moda y accesorios>Hombre",
      "subcategories": [
        { "id": 140, "name": "Calzado", "count": 1, "path": "Moda y accesorios>Hombre>Calzado", "subcategories": [] },
        { "id": 141, "name": "Ropa", "count": 0, "path": "Moda y accesorios>Hombre>Ropa", "subcategories": [] }
      ]
    },
    {
      "id": 40,
      "name": "Accesorios",
      "count": 0,
      "path": "Moda y accesorios>Accesorios",
      "subcategories": [
        { "id": 142, "name": "Accesorios para el cabello", "count": 0, "path": "Moda y accesorios>Accesorios>Accesorios para el cabello", "subcategories": [] },
        { "id": 143, "name": "Bolsos y mochilas", "count": 0, "path": "Moda y accesorios>Accesorios>Bolsos y mochilas", "subcategories": [] },
        { "id": 144, "name": "Bufandas y chales", "count": 0, "path": "Moda y accesorios>Accesorios>Bufandas y chales", "subcategories": [] },
        { "id": 145, "name": "Cinturones", "count": 0, "path": "Moda y accesorios>Accesorios>Cinturones", "subcategories": [] },
        { "id": 146, "name": "Corbatas y pañuelos", "count": 0, "path": "Moda y accesorios>Accesorios>Corbatas y pañuelos", "subcategories": [] },
        { "id": 147, "name": "Gafas de sol", "count": 0, "path": "Moda y accesorios>Accesorios>Gafas de sol", "subcategories": [] },
        { "id": 148, "name": "Guantes", "count": 0, "path": "Moda y accesorios>Accesorios>Guantes", "subcategories": [] },
        { "id": 149, "name": "Paraguas", "count": 0, "path": "Moda y accesorios>Accesorios>Paraguas", "subcategories": [] },
        { "id": 150, "name": "Relojes", "count": 0, "path": "Moda y accesorios>Accesorios>Relojes", "subcategories": [] },
        { "id": 151, "name": "Sombreros y gorras", "count": 0, "path": "Moda y accesorios>Accesorios>Sombreros y gorras", "subcategories": [] },
        { "id": 152, "name": "Otros accesorios", "count": 0, "path": "Moda y accesorios>Accesorios>Otros accesorios", "subcategories": [] }
      ]
    },
    {
      "id": 41,
      "name": "Joyería",
      "count": 0,
      "path": "Moda y accesorios>Joyería",
      "subcategories": [
        { "id": 153, "name": "Anillos", "count": 0, "path": "Moda y accesorios>Joyería>Anillos", "subcategories": [] },
        { "id": 154, "name": "Broches", "count": 0, "path": "Moda y accesorios>Joyería>Broches", "subcategories": [] },
        { "id": 155, "name": "Cadenas", "count": 0, "path": "Moda y accesorios>Joyería>Cadenas", "subcategories": [] },
        { "id": 156, "name": "Colgantes", "count": 0, "path": "Moda y accesorios>Joyería>Colgantes", "subcategories": [] },
        { "id": 157, "name": "Collares", "count": 0, "path": "Moda y accesorios>Joyería>Collares", "subcategories": [] },
        { "id": 158, "name": "Conjuntos de joyas", "count": 0, "path": "Moda y accesorios>Joyería>Conjuntos de joyas", "subcategories": [] },
        { "id": 159, "name": "Cuentas", "count": 0, "path": "Moda y accesorios>Joyería>Cuentas", "subcategories": [] },
        { "id": 160, "name": "Gemelos", "count": 0, "path": "Moda y accesorios>Joyería>Gemelos", "subcategories": [] },
        { "id": 161, "name": "Joyeros", "count": 0, "path": "Moda y accesorios>Joyería>Joyeros", "subcategories": [] },
        { "id": 162, "name": "Pendientes", "count": 0, "path": "Moda y accesorios>Joyería>Pendientes", "subcategories": [] },
        { "id": 163, "name": "Piercings", "count": 0, "path": "Moda y accesorios>Joyería>Piercings", "subcategories": [] },
        { "id": 164, "name": "Pulseras", "count": 0, "path": "Moda y accesorios>Joyería>Pulseras", "subcategories": [] },
        { "id": 165, "name": "Tobilleras", "count": 0, "path": "Moda y accesorios>Joyería>Tobilleras", "subcategories": [] },
        { "id": 166, "name": "Otras joyas", "count": 0, "path": "Moda y accesorios>Joyería>Otras joyas", "subcategories": [] }
      ]
    },
    {
      "id": 42,
      "name": "Belleza",
      "count": 0,
      "path": "Moda y accesorios>Belleza",
      "subcategories": [
        { "id": 167, "name": "Colonia", "count": 0, "path": "Moda y accesorios>Belleza>Colonia", "subcategories": [] },
        { "id": 168, "name": "Cuidado personal", "count": 0, "path": "Moda y accesorios>Belleza>Cuidado personal", "subcategories": [] },
        { "id": 169, "name": "Maquillaje", "count": 0, "path": "Moda y accesorios>Belleza>Maquillaje", "subcategories": [] },
        { "id": 170, "name": "Perfume", "count": 0, "path": "Moda y accesorios>Belleza>Perfume", "subcategories": [] },
        { "id": 171, "name": "Utensilios y accesorios", "count": 0, "path": "Moda y accesorios>Belleza>Utensilios y accesorios", "subcategories": [] },
        { "id": 172, "name": "Otros productos de belleza", "count": 0, "path": "Moda y accesorios>Belleza>Otros productos de belleza", "subcategories": [] }
      ]
    }
  ]
}

```

---

## 2. LISTINGS (ANUNCIOS)

### **Obtener anuncios por usuario**

* **Ruta:** `GET /listings/user/:userId`
* **Descripción:** Retorna todos los del usuario pasado por parametro.
* **URL:** `https://localhost:8443/api/catalog/listings/user/f47ac10b-58cc-4372-a567-0e02b2c3d479`
* **Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": "30a3c587-845e-43fe-a496-13d582b89cd4",
      "title": "Teclado Mecánico RGB",
      "description": "Teclado gaming con switches azules. Casi nuevo.",
      "state": "pending",
      "price": 55,
      "createdAt": "2026-03-23T08:17:33.799Z",
      "latitude": 2.0612893317182777,
      "longitude": 41.369199541973735,
      "categoryId": 200,
      "categoryName": "Periféricos",
      "wishlist": "false",
      "reviewAvg": 0,
      "photos": [
        { "photoId": 7, "path": "a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6.webp", "position": 1 },
        { "photoId": 8, "path": "2d3e4f5a-6b7c-48d9-ae0f-1a2b3c4d5e6f.webp", "position": 2 },
        { "photoId": 9, "path": "9f8e7d6c-5b4a-4321-9087-654321fedcba.webp", "position": 3 }
      ]
    },
    {
      "id": "fd896ac9-2ace-4666-985a-999ba2eddd7b",
      "title": "Altavoz Bluetooth Impermeable",
      "description": "Altavoz portátil, perfecto para exteriores.",
      "state": "pending",
      "price": 30,
      "createdAt": "2026-03-23T08:17:33.799Z",
      "latitude": 1.1829036453925956,
      "longitude": 41.121036346971884,
      "categoryId": 178,
      "categoryName": "Altavoces",
      "wishlist": "false",
      "reviewAvg": 0,
      "photos": [
        { "photoId": 22, "path": "67d8f9e0-a1b2-3c4d-5e6f-7a8b9c0d1e2f.webp", "position": 1 },
        { "photoId": 23, "path": "1a2b3c4d-5e6f-7081-92a3-b4c5d6e7f8a9.webp", "position": 2 },
        { "photoId": 24, "path": "f1e2d3c4-b5a6-7890-c1d2-e3f4a5b6c7d8.webp", "position": 3 }
      ]
    },
    {
      "id": "8aa3a133-e6a7-4640-89d8-b6cda8242d96",
      "title": "Raqueta de Tenis Wilson",
      "description": "Modelo Pro Staff. Muy poco uso, incluye funda.",
      "state": "pending",
      "price": 80,
      "createdAt": "2026-03-23T08:17:33.799Z",
      "latitude": -3.6332254766819783,
      "longitude": 40.43604370567636,
      "categoryId": 62,
      "categoryName": "Tenis y pádel",
      "wishlist": "false",
      "reviewAvg": 0,
      "photos": [
        { "photoId": 37, "path": "ef8855ba-7a8b-9c9d-4k1l-2a3b4c5d6e7f.webp", "position": 1 },
        { "photoId": 38, "path": "fa9966cb-8b9c-0d0e-5l2m-3b4c5d6e7f8a.webp", "position": 2 },
        { "photoId": 39, "path": "0b0077dc-9c0d-1e1f-6m3n-4c5d6e7f8a9b.webp", "position": 3 }
      ]
    },
    {
      "id": "6477c1e1-e9a9-4937-aa4d-00973a503f06",
      "title": "Estantería de Madera Maciza",
      "description": "Madera de pino tratada. 5 baldas amplias.",
      "state": "pending",
      "price": 65,
      "createdAt": "2026-03-23T08:17:33.799Z",
      "latitude": -3.7490873151645467,
      "longitude": 40.32912516544735,
      "categoryId": 235,
      "categoryName": "Muebles de almacenaje",
      "wishlist": "false",
      "reviewAvg": 0,
      "photos": [
        { "photoId": 52, "path": "c1a7d8e9-5b6c-402d-5d3e-4f6a7b8c9d0e.webp", "position": 1 },
        { "photoId": 53, "path": "d2b8e9f0-6c7d-413e-6e4f-5a7b8c9d0e1f.webp", "position": 2 },
        { "photoId": 54, "path": "e3c9f0a1-7d8e-424f-7f5a-6b8c9d0e1f2a.webp", "position": 3 }
      ]
    }
  ]
}
```



### **Obtener mis anuncios**

* **Ruta:** `GET /listings/mine`
* **Descripción:** Retorna todos los productos (anuncios) de un usuario. Verifica el usuario mediante el JWT.
* **Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": "9659c3be-e1f9-4b63-bc62-888a970add19",
      "title": "Mancuernas Ajustables 20kg",
      "description": "Par de mancuernas con discos intercambiables.",
      "state": "pending",
      "price": 45,
      "createdAt": "2026-03-17T15:07:49.715Z",
      "latitude": -3.7548599702073053,
      "longitude": 40.385211057774654,
      "categoryId": 59,
      "categoryName": "Otros deportes",
      "wishlist": "false",
      "photos": [
        { "photoId": 43, "path": "4f4411ba-3a4b-5c5d-0q7r-8a9b0c1d2e3f.webp", "position": 1 },
        { "photoId": 44, "path": "5a5522cb-4b5c-6d6e-1r8s-9b0c1d2e3f4a.webp", "position": 2 },
        { "photoId": 45, "path": "6b6633dc-5c6d-7e7f-2s9t-0c1d2e3f4a5b.webp", "position": 3 }
      ]
    },
    {
      "id": "6aede4d9-ba5e-43ab-97ce-0256826a75c8",
      "title": "Cortacésped Eléctrico",
      "description": "Potencia 1200W, ideal para jardines pequeños.",
      "state": "pending",
      "price": 75,
      "createdAt": "2026-03-17T15:07:49.715Z",
      "latitude": -3.159263442773359,
      "longitude": 40.64032984815505,
      "categoryId": 273,
      "categoryName": "Maquinaria de jardín",
      "wishlist": "true",
      "photos": [
        { "photoId": 58, "path": "c7a3d4e5-1b2c-468d-1d9e-0f2a3b4c5d6e.webp", "position": 1 },
        { "photoId": 59, "path": "d8b4e5f6-2c3d-479e-2e0f-1a3b4c5d6e7f.webp", "position": 2 },
        { "photoId": 60, "path": "e9c5f6a7-3d4e-480f-3f1a-2b4c5d6e7f8a.webp", "position": 3 }
      ]
    }
  ]
}
```

### **Obtener mis compras**

* **Ruta:** `GET /listings/mine/bought`
* **Descripción:** Retorna todos los productos (anuncios) comprados de un usuario. Verifica el usuario mediante el JWT.
* **Response:**

```json
{
  "status": "success",
  "data": [
    {
      "listingId": "1bb90b48-e80b-4205-a6f6-25088bec0fe8",
      "buyerId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "title": "Chaqueta Vaquera Vintage",
      "listinPrice": 45,
      "transactionPrice": 100,
      "listingDate": "2026-03-14T17:26:53.015Z",
      "transactionDate": "2026-03-15T11:02:40.922Z",
      "photos": [
        { "photoId": 1, "path": "a2d4e1b2-3c4d-4e5f-8a9b-0c1d2e3f4g5h.webp", "position": 1},
        { "photoId": 2, "path": "f8e7d6c5-b4a3-4210-9182-73645a5b4c3d.webp", "position": 2},
        { "photoId": 3, "path": "bc9a8b7c-6d5e-4f3a-bc2d-1e0f9a8b7c6d.webp", "position": 3}
      ]
    },
    {
      "listingId": "5a529f8f-6138-4825-ade0-07b69d7e9f8d",
      "buyerId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "title": "Bicicleta de Montaña Rockrider",
      "listinPrice": 150,
      "transactionPrice": 100,
      "listingDate": "2026-03-14T17:26:53.015Z",
      "transactionDate": "2026-03-15T11:02:58.894Z",
      "photos": [
        { "photoId": 31, "path": "e22d99bc-1a2b-4c3d-8e5f-6a7b8c9d0e1f.webp", "position": 1 },
        { "photoId": 32, "path": "f33e00cd-2b3c-4d4e-9f6g-7b8c9d0e1f2a.webp", "position": 2},
        { "photoId": 33, "path": "a44f11de-3c4d-5e5f-0g7h-8c9d0e1f2a3b.webp", "position": 3}
      ]
    }
  ]
}
```

### **Obtener mis Ventas**

* **Ruta:** `GET /listings/mine/sold`
* **Descripción:** Retorna todos los productos (anuncios) vendidos de un usuario. Verifica el usuario mediante el JWT.
* **Response:**

```json
{
  "status": "success",
  "data": [
    {
      "listingId": "7c3489e9-7d7c-4845-b777-65ac52202969",
      "sellerId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "title": "Auriculares Sony Cancelación Ruido",
      "listinPrice": 180,
      "transactionPrice": 100,
      "listingDate": "2026-03-14T17:26:53.015Z",
      "transactionDate": "2026-03-15T10:49:02.390Z",
      "photos": [
        {"photoId": 13, "path": "e42f9b8a-1122-4a33-8b44-c55d66e77f88.webp", "position": 1},
        {"photoId": 14, "path": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d.webp", "position": 2},
        {"photoId": 15, "path": "f9e8d7c6-b5a4-4321-9087-654321fedcba.webp", "position": 3 }
      ]
    },
    {
      "listingId": "6aede4d9-ba5e-43ab-97ce-0256826a75c8",
      "sellerId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "title": "Cortacésped Eléctrico",
      "listinPrice": 75,
      "transactionPrice": 100,
      "listingDate": "2026-03-14T17:26:53.015Z",
      "transactionDate": "2026-03-15T10:56:11.965Z",
      "photos": [
        {"photoId": 58, "path": "c7a3d4e5-1b2c-468d-1d9e-0f2a3b4c5d6e.webp", "position": 1},
        {"photoId": 59, "path": "d8b4e5f6-2c3d-479e-2e0f-1a3b4c5d6e7f.webp", "position": 2},
        {"photoId": 60, "path": "e9c5f6a7-3d4e-480f-3f1a-2b4c5d6e7f8a.webp", "position": 3 }
      ]
    }
  ]
}
```

### **Obtener anuncio por ID**

* **Ruta:** `GET /listings/:id`
* **Descripción:** Retorna el producto (anuncio) solicitado.
* **Request de ejemplo:** `GEThttps://localhost:8443/api/catalog/listings/1bd1e4bd-9e5f-4340-8143-2e1fa1126e11`
* **Response:**

```json
{
  "status": "success",
  "data": {
    "id": "1bd1e4bd-9e5f-4340-8143-2e1fa1126e11",
    "userId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "title": "Updating new article =2=",
    "description": "this is a test for update article",
    "state": "sold",
    "price": 100,
    "createdAt": "2026-03-23T08:21:08.732Z",
    "latitude": -3.68834,
    "longitude": 41.43355,
    "categoryId": 140,
    "categoryName": "Calzado",
    "wishlist": "false",
    "review": {
      "buyerId": "5e89669e-5e04-4860-8451-b3b0d2d2a45d",
      "stars": 1,
      "review": "UN FRACASO TOTAL , NO REPITO",
      "createdAt": "2026-03-23T09:50:02.570Z"
    },
    "photos": [
      { "photoId": 2429, "path": "47e1f2b3-a5c6-4b7d-8e9f-0a1b2c3d4e5f.webp", "position": 1 },
      { "photoId": 2430, "path": "47e1f2b3-a5c6-4b7d-8e9f-0a1b2c3d4e5.webp", "position": 2 },
      { "photoId": 2431, "path": "f5e4d3c2-b1a0-4987-8675-43210fedcba9.webp", "position": 3 }
    ]
  }
}
```

### **Crear un anuncio**

* **Ruta:** `POST /listings`
* **Descripción:** Crea un anuncio. Chequea el usuario por JWT. Retorna los datos del artículo creado.
* **Request:**
* **URL:** `https://localhost:8443/api/catalog/listings`
* **Headers:** `Content-Type: application/json`, `Cookie: token=...`
* **Body:**



```json
{   
    "title": "Testing new article",
    "description": "this is a test for new article creation",
    "price": 73,
    "longitude": 41.43355,
    "latitude": -3.68834,
    "idCategory": 140,
    "photos":[
      {"path": "47e1f2b3-a5c6-4b7d-8e9f-0a1b2c3d4e5f.webp", "position": 1},
      {"path": "bc8a7d6e-5f4b-4a3d-9c2b-1a0e9d8c7b6a.webp", "position": 2},
      {"path": "f5e4d3c2-b1a0-4987-8675-43210fedcba9.webp", "position": 3}
      ]
}
```

* **Response:**

```json
{
  "status": "success",
  "message": "Listing created successfully",
  "data": {
    "id": "fe302a7e-79b6-433f-872a-f51f605537a4",
    "user_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "title": "Testing new article",
    "price": 73,
    "state": "pending",
    "created_at": "2026-03-12T08:00:27.169Z",
    "latitude": -3.68834,
    "longitude": 41.43355,
    "idCategory": 140,
    "photos": [
      {"path": "47e1f2b3-a5c6-4b7d-8e9f-0a1b2c3d4e5f.webp", "position": 1},
      {"path": "bc8a7d6e-5f4b-4a3d-9c2b-1a0e9d8c7b6a.webp","position": 2},
      {"path": "f5e4d3c2-b1a0-4987-8675-43210fedcba9.webp","position": 3}
    ]
  }
}
```

### **Actualizar un anuncio**

* **Ruta:** `PUT /listings/:id`
* **Descripción:** Actualiza el anuncio. Verifica el usuario por JWT.
* **Request:**
* **URL:** `https://localhost:8443/api/catalog/listings/fe302a7e-79b6-433f-872a-f51f605537a4`
* **Body:**



```json
{   
    "title": "Updating new article",
    "description": "this is a test for update article",
    "price": 100,
    "longitude": 41.43355,
    "latitude": -3.68834,
    "idCategory": 140,
    "photos":[{"path": "47e1f2b3-a5c6-4b7d-8e9f-0a1b2c3d4e5f.webp", "position": 1},
            {"path": "bc8a7d6e-5f4b-4a3d-9c2b-1a0e9d8c7b6a.webp", "position": 2},
                {"path": "f5e4d3c2-b1a0-4987-8675-43210fedcba9.webp", "position": 3}]
}
```

* **Response:**

```json
{
  "status": "success",
  "message": "Listing updated successfully",
  "data": {
    "id": "fe302a7e-79b6-433f-872a-f51f605537a4",
    "user_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "title": "Updating new article",
    "price": 100,
    "state": "pending",
    "created_at": "2026-03-12T08:00:27.169Z",
    "latitude": -3.68834,
    "longitude": 41.43355,
    "idCategory": 140,
    "photos": [
      {"path": "47e1f2b3-a5c6-4b7d-8e9f-0a1b2c3d4e5f.webp","position": 1},
      { "path": "bc8a7d6e-5f4b-4a3d-9c2b-1a0e9d8c7b6a.webp","position": 2},
      {"path": "f5e4d3c2-b1a0-4987-8675-43210fedcba9.webp","position": 3}
    ]
  }
}
```

### **borra un anuncio**

* **Ruta:** `DELETE /listings/:id`
* **Descripción:** Borra el anuncio. Verifica el usuario por JWT. Verifica que el anuncio no tiene transacciones pendientes
* **Request:**
* **URL:** `https://localhost:8443/api/catalog/listings/fe302a7e-79b6-433f-872a-f51f605537a4`

* **Response:**

```json
{
  "status": "success",
  "message": "Listing deleted successfully",
  "data": {
    "id": "fe302a7e-79b6-433f-872a-f51f605537a4",
    "user_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "title": "Updating new article",
    "price": 100,
    "state": "cancelled",
    "created_at": "2026-03-12T08:00:27.169Z"
  }
}
```

### **Rerserva un anuncio**

* **Ruta:** `PATCH /listings/:id/reserve`
* **Descripción:** Cambia el estado del anunciono de pendiente -> reserved y de reserved -> pending 
* **Request:**
* **URL:** `https://localhost:8443/api/catalog/listings/9659c3be-e1f9-4b63-bc62-888a970add19/reserve`

* **Response:**

```json
{
  "status": "success",
  "message": "Listing update state successfully",
  "data": {
    "id": "9659c3be-e1f9-4b63-bc62-888a970add19",
    "user_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "state": "pending"
  }
}
```


### **Obtener anuncio aleatorio**

* **Ruta:** `GET /listings/random`
* **Descripción:** Retorna un anuncio al azar.
* **Response:**

```json
{
  "status": "success",
  "data": {
    "id": "f231c3a2-2292-49ab-aa10-ecec36e93df4",
    "userId": "7b11d33c-1d0c-4c6e-8e8e-c90a2334f55a",
    "title": "iPhone 13 Pro 128GB",
    "description": "Poco uso, salud de batería al 90%. Sin arañazos.",
    "state": "pending",
    "price": 650,
    "createdAt": "2026-03-23T08:17:33.799Z",
    "latitude": 41.379597693630785,
    "longitude": 2.1303063187446023,
    "categoryId": 189,
    "categoryName": "Smartphones",
    "reviewAvg": 0,
    "photos": [
      { "photoId": 4, "path": "e4d1f2b3-a5c6-4b7d-8e9f-0a1b2c3d4e5f.webp", "position": 1 },
      { "photoId": 5, "path": "bc8a7d6e-5f4b-4a3d-9c2b-1a0e9d8c7b6a.webp", "position": 2 },
      { "photoId": 6, "path": "f5e4d3c2-b1a0-4987-8675-43210fedcba9.webp", "position": 3 }
    ]
  }
}
```

### **Buscar anuncios**

* **Ruta:** `GET /listings/search`
* **Descripción:** Buscar anuncios en la base de datos. Las variables se pasan por query string. Si se pasa JWT revisa la lista de favortios del usuario y el campo whislist = 'true' aquello anuncion que esten en su lista.
* **Variables (Filtros):**
* `categoryId`: ID de categoría.
* `minPrice`: Precio mínimo.
* `maxPrice`: Precio máximo.
* `timeFilter`: `today` (hoy), `lastWeek` (última semana), `lastMonth` (último mes).
* `lng`: longitud de la ubicacion.
* `lat`: latitud de la ubicacion.
* `radius`: radio en Km desde el pulto de origen lat & lng.
* `keywords`: palabras clave para busqueda
* `orderBy`: `price_low_to_high`, `price_high_to_low`, `newest`, `closest`(el valor por default es closest. Si el usuario no brinda lat & lng se toma Madrid como ubicacion)
* **Paginación:** `page` (número de página) – trae 9 anuncios por página.


* **Request de ejemplo :** `GET https://localhost:8443/api/catalog/listings/search?categoryId=4&minPrice=10&maxPrice=200&orderBy=price_low_to_high&page=0`
* **Response:**

```json
{
  "status": "success",
  "data": {
    "listings": [
      {
        "id": "8693190f-2aaf-41a4-a6ff-1b05aa92ab7a",
        "userId": "7b11d33c-1d0c-4c6e-8e8e-c90a2334f55a",
        "title": "Vestido de Verano Floral",
        "description": "Vestido ligero, talla S. Ideal para vacaciones.",
        "state": "pending",
        "price": 25,
        "createdAt": "2026-03-23T08:17:33.799Z",
        "latitude": 1.1873925445942384,
        "longitude": 41.10865808229092,
        "categoryId": 139,
        "categoryName": "Ropa",
        "wishlist": "false",
        "reviewAvg": 0,
        "photos": [
          { "photoId": 19, "path": "c0ffee11-bb22-3344-5566-778899aabbcc.webp", "position": 1 },
          { "photoId": 20, "path": "f0f0f0f0-e1e1-d2d2-c3c3-b4b4a5a59696.webp", "position": 2 },
          { "photoId": 21, "path": "8a7b6c5d-4e3f-2g1h-0i9j-8k7l6m5n4o3p.webp", "position": 3 }
        ]
      },
      {
        "id": "f6bf69a5-ecb6-40ae-9318-6728ae52dc9a",
        "userId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "title": "Testing new article",
        "description": "this is a test for new article creation",
        "state": "pending",
        "price": 73,
        "createdAt": "2026-03-23T08:20:06.970Z",
        "latitude": -3.68834,
        "longitude": 41.43355,
        "categoryId": 140,
        "categoryName": "Calzado",
        "wishlist": "false",
        "reviewAvg": 3.3,
        "photos": [
          { "photoId": 61, "path": "47e1f2b3-a5c.webp", "position": 1 },
          { "photoId": 62, "path": "47e1f2b3-a5c65.webp", "position": 2 },
          { "photoId": 63, "path": "47e1f2b3-0a1b2c3d4e5.webp", "position": 3 }
        ]
      },
      {
        "id": "aa870fef-c8fa-4bf3-8d10-5c76bb6405ce",
        "userId": "2d931510-3970-47ff-8c3b-2c1f62e666a2",
        "title": "Botas de Cuero Talla 42",
        "description": "Botas de cuero marrón hechas a mano. Muy resistentes.",
        "state": "pending",
        "price": 85,
        "createdAt": "2026-03-23T08:17:33.799Z",
        "latitude": 2.0066872057074163,
        "longitude": 41.30781978276308,
        "categoryId": 138,
        "categoryName": "Calzado",
        "wishlist": "false",
        "reviewAvg": 0,
        "photos": [
          { "photoId": 10, "path": "12345678-abcd-4321-bcde-0987654321fe.webp", "position": 1 },
          { "photoId": 11, "path": "deadbeef-face-4caf-babe-0123456789ab.webp", "position": 2 },
          { "photoId": 12, "path": "c0ffee11-2233-4455-6677-8899aabbccdd.webp", "position": 3 }
        ]
      },
      {
        "id": "d59d62eb-c3fe-4f62-88e7-ed3a38d87f2c",
        "userId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "title": "Zapatillas Nike Air Max",
        "description": "Edición limitada, talla 44. Puestas dos veces.",
        "state": "pending",
        "price": 95,
        "createdAt": "2026-03-23T08:17:33.799Z",
        "latitude": 2.1599023925879486,
        "longitude": 41.43518010325037,
        "categoryId": 140,
        "categoryName": "Calzado",
        "wishlist": "false",
        "reviewAvg": 3.3,
        "photos": [
          { "photoId": 28, "path": "7d8c9b0a-1e2f-3a4b-5c6d-7e8f9a0b1c2d.webp", "position": 1 },
          { "photoId": 29, "path": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e.webp", "position": 2 },
          { "photoId": 30, "path": "a1f2e3d4-c5b6-7890-1a2b-3c4d5e6f7a8b.webp", "position": 3 }
        ]
      }
    ],
    "total_items": [
      { "count": "4" }
    ]
  }
}
```


## 3. TRANSACTIONS

### **Crear una transaccion**

* **Ruta:** `POST /transactions`
* **Descripción:** Crea la transaccion para un anuncio. Chequea el usuario por JWT.Retorna los datos del artículo creado.
* **Request:**
* **URL:** `https://localhost:8443/api/catalog/transactions`
* **Headers:** `Content-Type: application/json`, `Cookie: token=...`
* **Body:**

```json
{
    "listingId": "5a529f8f-6138-4825-ade0-07b69d7e9f8d",
    "sellerId": "5e89669e-5e04-4860-8451-b3b0d2d2a45d",
    "buyerId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "price": 100   
}
```

* **Response:**

```json
{
  "status": "success",
  "message": "Transaction created successfully",
  "data": {
    "listing": "5a529f8f-6138-4825-ade0-07b69d7e9f8d",
    "user": "5e89669e-5e04-4860-8451-b3b0d2d2a45d"
  }
}
```



## 4. WISHLIST

### **obtener mis wishlist**
* **Ruta:** `GET /wishlist`
* **Descripción:** Retorna todos los productos que esta agragados a mi lista favoritos. Chequea el usuario a traves de JWT
* **Request:**
* **URL:** `https://localhost:8443/api/catalog/wishlist/`


* **Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": "d59d62eb-c3fe-4f62-88e7-ed3a38d87f2c",
      "title": "Zapatillas Nike Air Max",
      "description": "Edición limitada, talla 44. Puestas dos veces.",
      "state": "pending",
      "price": 95,
      "createdAt": "2026-03-17T15:07:49.715Z",
      "latitude": 2.1599023925879486,
      "longitude": 41.43518010325037,
      "categoryId": 140,
      "categoryName": "Calzado",
      "photos": [
        {"photoId": 28, "path": "7d8c9b0a-1e2f-3a4b-5c6d-7e8f9a0b1c2d.webp","position": 1},
        {"photoId": 29, "path": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e.webp","position": 2},
        {"photoId": 30, "path": "a1f2e3d4-c5b6-7890-1a2b-3c4d5e6f7a8b.webp","position": 3 }
      ]
    },
    {
      "id": "6aede4d9-ba5e-43ab-97ce-0256826a75c8",
      "title": "Cortacésped Eléctrico",
      "description": "Potencia 1200W, ideal para jardines pequeños.",
      "state": "pending",
      "price": 75,
      "createdAt": "2026-03-17T15:07:49.715Z",
      "latitude": -3.159263442773359,
      "longitude": 40.64032984815505,
      "categoryId": 273,
      "categoryName": "Maquinaria de jardín",
      "photos": [
        {"photoId": 58, "path": "c7a3d4e5-1b2c-468d-1d9e-0f2a3b4c5d6e.webp","position": 1},
        {"photoId": 59, "path": "d8b4e5f6-2c3d-479e-2e0f-1a3b4c5d6e7f.webp","position": 2},
        {"photoId": 60, "path": "e9c5f6a7-3d4e-480f-3f1a-2b4c5d6e7f8a.webp","position": 3}
      ]
    }
  ]
}
```

### **obtener total wishlist**
* **Ruta:** `GET /wishlist/count/:idListing`
* **Descripción:** Retorna el total de veces que el anuncion fue guardado como favorito
* **Request:**
* **URL:** `GET https://localhost:8443/api/catalog//wishlist/count/1bb90b48-e80b-4205-a6f6-25088bec0fe8`

* **Response:**

```json
{
  "status": "success",
  "data": {
    "listingId": "1bb90b48-e80b-4205-a6f6-25088bec0fe8",
    "TotalWishlistCount": 2
  }
}
```

### **agregar anuncio al la lista de favoritos**
* **Ruta:** `POST /wishlist`
* **Descripción:** Agrega un anuncio a la lista de favoritos
* **Request:**
* **URL:** `https://localhost:8443/api/catalog/wishlist`
* **Headers:** `Content-Type: application/json`, `Cookie: token=...`
* **Body:**

```json
{
  "listingId": "d59d62eb-c3fe-4f62-88e7-ed3a38d87f2c"
}
```

* **Response:**

```json
{
  "status": "success",
  "message": "listing added to wishlist",
  "data": {
    "listingId": "d59d62eb-c3fe-4f62-88e7-ed3a38d87f2c",
    "userId": "5e89669e-5e04-4860-8451-b3b0d2d2a45d",
    "createdAt": "2026-03-18T07:42:05.299Z"
  }
}
```

### **elimina un anuncio de la lista de favoritos**
* **Ruta:** `DELETE /wishlist/:id`
* **Descripción:** Elimina una anuncio de la lista de favoritos. Cheque el usuario a traves de JWT
* **Request:**
* **URL:** `https://localhost:8443/api/catalog/wishlist/d59d62eb-c3fe-4f62-88e7-ed3a38d87f2c`


* **Response:**

```json
{
  "status": "success",
  "message": "Listing removed from wishlist",
  "data": {
    "listingId": "d59d62eb-c3fe-4f62-88e7-ed3a38d87f2c",
    "userId": "5e89669e-5e04-4860-8451-b3b0d2d2a45d",
    "createdAt": "2026-03-18T07:42:05.299Z"
  }
}
```

## 5. REVIEWS

### **crea una review**
* **Ruta:** `POST /reviews`
* **Descripción:** Crea una review de una compra. Verifica jwt y solo el comprador puede hacer review y tiene que estar confirmada la transaccion por el vendedor
* **Request:**
* **URL:** `https://localhost:8443/api/catalog/reviews`
* **Headers:** `Content-Type: application/json`, `Cookie: token=...`
* **Body:**

```json
{
     "listingId": "7c3489e9-7d7c-4845-b777-65ac52202969",
     "stars": 4,
     "review" : "todo estupendo , el producto en perfecto estado"
}
```

* **Response:**

```json
{
  "status": "success",
  "message": "Review created successfully",
  "data": {
    "listingId": "7c3489e9-7d7c-4845-b777-65ac52202969",
    "buyerId": "5e89669e-5e04-4860-8451-b3b0d2d2a45d",
    "stars": 4,
    "review": "todo estupendo , el producto en perfecto estado",
    "createdAt": "2026-03-23T10:07:41.361Z"
  }
}
```


### **obtener reviews por usuario**
* **Ruta:** `GET /reviews/:userId`
* **Descripción:** Retorna todas las reviews realizadas a un usuario.
* **Request:**
* **URL:** `https://localhost:8443/api/catalog/reviews/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`


* **Response:**

```json
{
  "status": "success",
  "data": [
    {
      "listingId": "7c3489e9-7d7c-4845-b777-65ac52202969",
      "buyerid": "5e89669e-5e04-4860-8451-b3b0d2d2a45d",
      "stars": 4,
      "review": "todo estupendo , el producto en perfecto estado",
      "createdAt": "2026-03-23T10:07:41.361Z",
      "path": "e42f9b8a-1122-4a33-8b44-c55d66e77f88.webp"
    },
    {
      "listingId": "68b60ac4-4435-4c68-87b2-709b4094bb8e",
      "buyerid": "5e89669e-5e04-4860-8451-b3b0d2d2a45d",
      "stars": 5,
      "review": "perfercto todo",
      "createdAt": "2026-03-23T09:49:32.746Z",
      "path": "47e1f2b3-a5c.webp"
    },
    {
      "listingId": "1bd1e4bd-9e5f-4340-8143-2e1fa1126e11",
      "buyerid": "5e89669e-5e04-4860-8451-b3b0d2d2a45d",
      "stars": 1,
      "review": "UN FRACASO TOTAL , NO REPITO",
      "createdAt": "2026-03-23T09:50:02.570Z",
      "path": "47e1f2b3-a5c6-4b7d-8e9f-0a1b2c3d4e5f.webp"
    }
  ]
}
```


### **obtener estadisticas de reviews por usuario**
* **Ruta:** `GET /reviews/user/:userId/stats`
* **Descripción:** Retorna estadisticas de reviews por usario.
* **Request:**
* **URL:** `https://localhost:8443/api/catalog/reviews/user/95c3dd7d-9387-4f11-bf6d-14b5057dcda8/stats`


* **Response:**

```json
{
  "status": "success",
  "data": {
    "user_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "totalReviews": 3,
    "reviewAvg": 3.3
  }
}
```