const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './data/products.json';

let products = JSON.parse(fs.readFileSync(path, 'utf8'));

router.get('/', (req, res) => {
    const limit = req.query.limit;
    if (limit) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});

router.get('/:pid', (req, res) => {
    const product = products.find(p => p.id === req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no Encontrado');
    }
});

router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
    const newProduct = {
        id: (Math.random().toString(36).substr(2, 9)),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails
    };
    products.push(newProduct);
    fs.writeFileSync(path, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body, id: products[index].id };
        fs.writeFileSync(path, JSON.stringify(products, null, 2));
        res.json(products[index]);
    } else {
        res.status(404).send('Producto no Encontrado');
    }
});

router.delete('/:pid', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index !== -1) {
        const deletedProduct = products.splice(index, 1);
        fs.writeFileSync(path, JSON.stringify(products, null, 2));
        res.json(deletedProduct);
    } else {
        res.status(404).send('Producto No Encontrado');
    }
});

module.exports = router;
