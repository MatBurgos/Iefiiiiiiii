const express = require('express');
const Order = require('../models/Order');
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

router.get('/', authenticate, async (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const orders = await Order.getAll();
        res.status(200).json(orders);
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
        const { status } = req.body;
        const result = await Order.update(id, status);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
