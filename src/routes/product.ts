import express from "express";
const router = express.Router();

import ProductController from './../controllers/ProductController';

router.get('', ProductController.getAllProducts);
router.get('/:id', ProductController.getProduct);
router.post('', ProductController.createProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export default router;