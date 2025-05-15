Estimado lector como está?

Durante la creacion de esta app, hubieron dos errores complicados al momento de culminar la app. Procederé a explicar como los solucioné y cuáles son:

1: ERROR: [Ninguna sobrecarga coincide con esta llamada.

    La última sobrecarga dio el error siguiente.
    No se puede asignar un argumento de tipo "(req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined" al parámetro de tipo "RequestHandlerParams<ParamsDictionary, any, any, ParsedQs, Record<string, any>>".

    El tipo '(req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined' no se puede asignar al tipo 'RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.

    El tipo 'Response<any, Record<string, any>> | undefined' no se puede asignar al tipo 'void | Promise<void>'.

    El tipo 'Response<any, Record<string, any>>' no se puede asignar al tipo 'void | Promise<void>'.

si la la funcion AuthMiddleware le quito el explicitamente :any me lanza el error anterior]
    SOLUCION: buscando informacion respecto a express me di cuenta de que con respecto a los tipados, los middleware no estan tipados para esperar datos como retorno, solo pueden retornar void o nextFunction para continuar con el siguiente Middleware.

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

    El middleware causa error porque esta retornando un valor de tipo res.json
    la forma de corregirlo para que se pueda usar es no retornar esos valores pero si finalizar la ejecucion del codigo para dar paso a la nextFunction de la siguiente manera:

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

2: ERROR: [ error TS2339: Property 'user' does not exist on type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'. ]
    SOLUCION: A pesar de que de hecho esta declarado en la carpeta types el archivo que extiende la interfaz de Request para agregar la propiedad user mediante el siguiente codigo: 

    import { JwtPayload } from "jsonwebtoken";

    declare global {
        namespace Express {
            interface Request {
                user?: string | JwtPayload;
            }
        }
    }
    Typescript no detecta automáticamente en su compilacion de archivos este codigo, es decir, el archivo en cuestion que extiende esa interfaz, la solución fue agregar en el archivo de configuracion de typescript "tsconfig.json" las siguientes lineas de codigo para que sea mas explicito el uso de los types creados en la app:

{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    ...
    ...
  },
  "include": ["src/**/*"],
  "files": ["src/types/index.d.ts"]
}
    --include le da a typescript el explicito de que debe usar todos los archivos dentro de src para compilar
    --files Especifica archivos de tipado de forma explicita que debe utilizar el compilador, estos archivos no se compilan a menos que se especifique de esta forma, si hubiera otro archivo de tipado seria recomendable agregarlo de esta forma