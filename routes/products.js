const express = require("express");
const Product = require("../models/product"); 
const router = express.Router();

module.exports = (io) => {
    router.get("/", async (req, res) => {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filters = query ? { $or: [{ category: query }, { status: query === "available" }] } : {};
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
        };

        try {
            const products = await Product.paginate(filters, options);
            res.json({
                status: "success",
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
                nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null,
            });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los productos " });
        }
    });

    router.post("/", async (req, res) => {
        console.log("ingresando datos..")
        try {
            const newProduct = new Product(req.body);
            await newProduct.save();
    
            const updatedProducts = await Product.find(); 
            console.log("emitiendo:", updatedProducts)
            io.emit("updateProducts", updatedProducts); 
    
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: "Error al crear el producto" });
        }
    });
    

    return router; 
};
