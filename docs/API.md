# API — Endpoints

Rutas disponibles para gestionar productos:

1) Listar productos

- Método: `GET`
- URL: `/api/productos`
- Parámetros opcionales (query):
  - `query` o `q` — búsqueda por texto
  - `categoria` — filtrar por categoría
  - `proveedor` — filtrar por proveedor
- Respuesta: arreglo de productos, status `200`.

Ejemplo:

```bash
curl "http://localhost:3000/api/productos?query=camisa&categoria=hombre"
```

2) Crear producto

- Método: `POST`
- URL: `/api/productos`
- Body: JSON validado (ver DTOs en `src/server/dtos/product.dto.ts`)
- Respuesta: objeto creado, status `201`.

3) Obtener un producto por id

- Método: `GET`
- URL: `/api/productos/:id`
- Respuesta: objeto producto, status `200` o `404` si no existe.

4) Actualizar parcialmente

- Método: `PATCH`
- URL: `/api/productos/:id`
- Body: campos a actualizar en JSON
- Respuesta: objeto actualizado, status `200`.

5) Eliminar

- Método: `DELETE`
- URL: `/api/productos/:id`
- Respuesta: message de confirmación, status `200`.

---

Los controladores se encuentran en `src/app/api/productos/route.ts` y `src/app/api/productos/[id]/route.ts`.
Revisa `src/server/services/product.service.ts` para la lógica de negocio.
