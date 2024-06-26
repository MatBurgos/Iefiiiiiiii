// server/models/User.js
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const client = new MongoClient(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const User = {
    register: async (username, password, role) => {
        await client.connect();
        const db = client.db('ecommerce');
        const users = db.collection('users');
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await users.insertOne({ username, password: hashedPassword, role });
        await client.close();
        return result;
    },
    login: async (username, password) => {
        await client.connect();
        const db = client.db('ecommerce');
        const users = db.collection('users');
        const user = await users.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
            await client.close();
            return { token, role: user.role };
        } else {
            await client.close();
            throw new Error('Invalid credentials');
        }
    }
};

module.exports = User;





/*
//EJEMPLOS de uso
const Product = require('../models/Product');

// Ejemplo de creación de un producto
async function createProduct(req, res) {
    try {
        const { imagen, titulo, descripcion, categoria, precio } = req.body;
        const productData = { imagen, titulo, descripcion, categoria, precio };
        const result = await Product.create(productData);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
}

// Ejemplo de obtención de todos los productos
async function getAllProducts(req, res) {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
}

// Otros métodos como actualizar y eliminar productos pueden ser implementados de manera similar

module.exports = {
    createProduct,
    getAllProducts
    // Exporta otros métodos según sea necesario
};
*/