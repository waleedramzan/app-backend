import path from "path";
import { Request, Response, NextFunction } from "express";

import { Product } from "../models/product";
import { readFile, writeFile, getUniqueID } from "../common/utils";

const PRODUCTS_FILE_PATH = path.resolve(__dirname, './../../db/products.json');

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, price } = req.body;
        const products: Product[] = readFile(PRODUCTS_FILE_PATH);

        let isUniqueID: Boolean = true;
        let id: number = 0;

        while (isUniqueID) {
            id = getUniqueID();
            const isExistingProduct = products.find(product => product.id === id);
            if (!isExistingProduct) { isUniqueID = false; }
        }

        const product: Product = {
            id,
            name,
            price,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString()
        }
        products.push(product);
        writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products));
        return res.status(200).send({ product });
    } catch (error: any) {
        return res.status(400).send({
            message: (error && error.message) || 'Something went wrong!'
        });
    }
}

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const products: Product[] = readFile(PRODUCTS_FILE_PATH);
    const id = +req.params.id;

    const product = products.find(_product => _product.id == id);
    if (!product) { return res.status(404).send({ message: 'Product not found' }); }

    return res.status(200).send({product});
}

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products: Product[] = readFile(PRODUCTS_FILE_PATH);
    return res.status(200).send({products: products.length ? products : []});
}

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { name, price } = req.body;
    const id = +req.params.id;
    const products: Product[] = readFile(PRODUCTS_FILE_PATH);

    const product: Product = products.find(product => product.id === id) as Product;
    if (product) {
        if (name) { product.name = name; }
        if (price) { product.price = price; }
        product.updatedAt = new Date().toString();
    }

    writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products));
    return res.status(200).send({ product })
}

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id = +req.params.id;
    const products: Product[] = readFile(PRODUCTS_FILE_PATH);
    
    const productIndex = products.findIndex(product => product.id === id);

    if (productIndex === -1) { return res.status(400).send({ message: 'Could not find the product' }) }
    
    products.splice(productIndex, 1);
    writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products));
    return res.status(200).send({ message: 'Product Deleted successfully' });
}

export default { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct }