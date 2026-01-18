import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../modules/users/service";
import { User } from "../modules/users/model";

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET || "default_secret", async (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            const dbUser = await User.findByPk(user.userId);
            req.user = dbUser;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
