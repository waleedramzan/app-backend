import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";
import { Request, Response, NextFunction } from "express";

import { User } from "../models/user";
import { readFile, writeFile } from "../common/utils";

const USERS_FILE_PATH = path.resolve(__dirname, './../../db/users.json');

const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const users: User[] = readFile(USERS_FILE_PATH);

        const isExistingUser = users.find(user => user.email === email);
        if (isExistingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user: User = {
            name, email, password: hashedPassword
        }
        users.push(user);
        writeFile(USERS_FILE_PATH, JSON.stringify(users));

        return res.status(200).json({ message: "User created Successfully" });
    } catch (error: any) {
        return res.status(400).send({
            message: (error && error.message) || 'Something went wrong!'
        });
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const users: User[] = readFile(USERS_FILE_PATH);
        
        const user: User = users.find(_user => _user.email === email) as User;
        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).send({
                message: 'Invalid credentials'
            })
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET as string);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        return res.send({ message: 'User login successful' })
    } catch (error: any) {
        return res.status(400).send({
            message: (error && error.message) || 'Something went wrong!'
        });
    }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('jwt', '', {maxAge: 0})
    return res.send({ message: 'Logout successful' })
}

export default { signup, login, logout }