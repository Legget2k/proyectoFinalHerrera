import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export const AuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const JWT_SECRET = process.env.JWT_SECRET || "TEST";
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        /*return*/res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            /*return*/ res.status(403).json({
                success: false,
                message: 'token is not valid'
            });
            return;
        }
        req.user = user;
        next();
    })
    
}