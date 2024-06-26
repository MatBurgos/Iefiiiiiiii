const express = require('express');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();

const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Failed to authenticate token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

router.get('/', async (req, res) => {
    try {
        const products = await Product.getAll();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.getByCategory(category);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getById(id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', authenticate, async (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const product = req.body;
        const result = await Product.add(product);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', authenticate, async (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const { id } = req.params;
        const product = req.body;
        const result = await Product.update(id, product);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const { id } = req.params;
        const result = await Product.delete(id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
