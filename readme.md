Error de Tipos en el Middleware de Express: Response<any, Record<string, any>> no se puede asignar a void
Descripción del Problema
Cuando se implementa un middleware en Express con TypeScript, es común que se produzca el siguiente error:

    El tipo 'Response<any, Record<string, any>>' no se puede asignar al tipo 'void'.

Esto significa que el middleware no debe devolver explícitamente un valor, sino que debe:

Llamar a next() para pasar al siguiente middleware o controlador.
Terminar la ejecución después de enviar una respuesta con res.status(...).json(...).
Causa del Error

En el siguiente ejemplo de middleware, el error ocurre porque se devuelve explícitamente un Response:

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

n este caso, return res.status(...).json(...) devuelve un objeto Response, lo cual no es compatible con el tipo de retorno void que espera TypeScript.

Solución
Para solucionar este problema, debes asegurarte de que el middleware no devuelva explícitamente un valor. En su lugar, simplemente llama a res.status(...).json(...) y termina la ejecución con return o llama a next().

Middleware Corregido

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
        return; // ✅ Termina la ejecución aquí
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({
                success: false,
                message: 'Token is not valid',
            });
            return; // ✅ Termina la ejecución aquí
        }
        req.user = user; // Asigna el usuario al objeto req
        next(); // ✅ Llama a next() para continuar con el flujo
    });
};