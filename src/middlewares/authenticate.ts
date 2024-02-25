import jwt from "jsonwebtoken";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { User } from './../models/user'
import { readFile } from './../common/utils'

const USERS_FILE_PATH = path.resolve(__dirname, './../../db/users.json');

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req && req.cookies && req.cookies['jwt'];

    if (!cookie) {
        return res.status(401).send({
            message: 'Unauthenticated! Please login to access this route'
        })
    }
    const isValidToken = jwt.verify(cookie, process.env.JWT_SECRET as string) as { email: string }

    if (!isValidToken) {
        return res.status(401).send({
            message: 'Unauthenticated! Please login to access this route'
        })
    }
    const users: User[] = readFile(USERS_FILE_PATH);
    const user = users.find(user => user.email === isValidToken.email);

    if (!user) {
        return res.status(401).send({ message: 'Invalid request' })
    }

    next();
}

export default authenticate;