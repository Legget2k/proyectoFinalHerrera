# Proyecto Final Herrera

# git clone https://github.com/Legget2k/proyectoFinalHerrera.git

# API de Gestión de Productos

Este proyecto implementa una API RESTful para la gestión de productos, permitiendo operaciones CRUD (crear, leer, actualizar y eliminar) sobre una base de datos MongoDB. Incluye autenticación basada en JWT y validaciones de datos para garantizar la integridad de la información.

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT (Json Web Token)
- dotenv

## Estructura del proyecto

- `/controllers`: Lógica de negocio y controladores de rutas.
- `/models`: Definición de esquemas y modelos de datos.
- `/routes`: Definición de rutas de la API.
- `/middlewares`: Middlewares personalizados (autenticación, validaciones, etc).
- `/interfaces`: Interfaces TypeScript para tipado estricto.
- `/utils`: Funciones utilitarias y helpers.

## Errores al desarrollar la API

---

## 1. Error: Ninguna sobrecarga coincide con esta llamada

### Descripción del Error

Al implementar el middleware `AuthMiddleware`, TypeScript arrojaba el siguiente error:

```
Ninguna sobrecarga coincide con esta llamada.
La última sobrecarga dio el error siguiente.
No se puede asignar un argumento de tipo "(req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined" al parámetro de tipo "RequestHandlerParams<ParamsDictionary, any, any, ParsedQs, Record<string, any>>".

El tipo '(req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined' no se puede asignar al tipo 'RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.

El tipo 'Response<any, Record<string, any>> | undefined' no se puede asignar al tipo 'void | Promise<void>'.
```

Este error ocurre porque los middlewares en Express no están diseñados para devolver valores como `Response`. En su lugar, deben:
- Finalizar la ejecución con `res.status(...).json(...)` y un `return`.
- O llamar a `next()` para pasar al siguiente middleware.

### Código que causaba el error

```typescript
export const AuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        }); // ❌ Esto causa el error
    }

    jwt.verify(token, "SECRET", (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Token is not valid',
            }); // ❌ Esto también causa el error
        }
        req.user = user;
        next();
    });
};
```

### Solución

El middleware fue corregido para que no devuelva explícitamente un valor, sino que termine la ejecución correctamente. Aquí está el código corregido:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const JWT_SECRET = process.env.JWT_SECRET || "TEST";
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
        return; // ✅ Termina la ejecución aquí sin retornar la res.json
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({
                success: false,
                message: 'Token is not valid',
            });
            return; // ✅ Termina la ejecución aquí sin retornar la res.json
        }
        req.user = user; // Asigna el usuario al objeto req
        next(); // ✅ Llama a next() para continuar con el flujo
    });
};
```

---

## 2. Error: `Property 'user' does not exist on type 'Request'`

### Descripción del Error

Al intentar asignar un valor a `req.user` en el middleware, TypeScript arrojaba el siguiente error:

```
error TS2339: Property 'user' does not exist on type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
```

Esto ocurre porque TypeScript no reconoce la propiedad `user` en el objeto `Request` de Express. Para solucionar esto, es necesario extender la interfaz `Request` de Express.

### Solución

Se creó un archivo de declaración de tipos en index.d.ts para extender la interfaz `Request` y agregar la propiedad `user`. El archivo tiene el siguiente contenido:

```typescript
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}
```

Además, se actualizó el archivo tsconfig.json para asegurarse de que TypeScript detecte este archivo de tipos:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "commonjs",
    "strict": true
  },
  "include": ["src/**/*"],
  "files": ["src/types/index.d.ts"]
}
```

Finalmente, se reinició el servidor de TypeScript para aplicar los cambios:

```bash
npm run dev
```

---

## Instrucciones para Levantar el Proyecto

### 1. Instalación de Dependencias
Ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install
```

### 2. Ejecución del Servidor
Para iniciar el servidor en modo desarrollo, utiliza:

```bash
npm run dev
```

---

## Ejemplos de Endpoints y Requerimientos de Autenticación

### Registro de Usuario
- **URL:** `/api/auth/register`
- **Método:** `POST`
- **Cuerpo de la solicitud (JSON):**
  ```json
  {
    "username": "suNombre",
    "password": "suContraseña"
  }
  ```

### Login de Usuario
- **URL:** `/api/auth/login`
- **Método:** `POST`
- **Cuerpo de la solicitud (JSON):**
  ```json
  {
    "username": "suNombre",
    "password": "suContraseña"
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### Obtener Zapatos
- **URL:** `/api/Shoes`
- **Método:** `GET`
- **Requerimientos:**
  - Token JWT válido en el encabezado `Authorization`:
    ```
    Authorization: Bearer <token>
    ```

### Crear Zapato
- **URL:** `/api/Shoes`
- **Método:** `POST`
- **Cuerpo de la solicitud (JSON):**
  ```json
  {
    "model": "Air Max",
    "brand": "Nike",
    "price": 120,
    "size": 42,
    "color": "Red"
  }
  ```

---

## Notas Finales

- Los colores disponibles son: `["Red", "Brown", "Gray", "Black", "White"]`.
- Los tamaños disponibles son: `[36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]`.

¡Gracias por leer y probar esta aplicación! 😊

--- 