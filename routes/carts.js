const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './data/carts.json';

let carts = JSON.parse(fs.readFileSync(path, 'utf8'));

router.get('/:cid', (req, res) => {
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).send('Datos no Encontrados');
    }
});

router.post('/', (req, res) => {
    const newCart = {
        id: (Math.random().toString(36).substr(2, 9)),
        products: []
    };
    carts.push(newCart);
    fs.writeFileSync(path, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
});

router.post('/:cid/product/:pid', (req, res) => {
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        const productIndex = cart.products.findIndex(p => p.id === req.params.pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ id: req.params.pid, quantity: 1 });
        }
        fs.writeFileSync(path, JSON.stringify(carts, null, 2));
        res.json(cart);
    } else {
        res.status(404).send('Datos no Encontrados');
    }
});

module.exports = router;
