const { MongoClient, ObjectId } = require('mongodb');
const config = require('../config');

const client = new MongoClient(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const Product = {
    getAll: async () => {
        await client.connect();
        const db = client.db('ecommerce');
        const products = db.collection('products');
        const allProducts = await products.find().toArray();
        await client.close();
        return allProducts;
    },
    getByCategory: async (category) => {
        await client.connect();
        const db = client.db('ecommerce');
        const products = db.collection('products');
        const categoryProducts = await products.find({ category }).toArray();
        await client.close();
        return categoryProducts;
    },
    getById: async (id) => {
        await client.connect();
        const db = client.db('ecommerce');
        const products = db.collection('products');
        const product = await products.findOne({ _id: new ObjectId(id) });
        await client.close();
        return product;
    },
    add: async (product) => {
        await client.connect();
        const db = client.db('ecommerce');
        const products = db.collection('products');
        const result = await products.insertOne(product);
        await client.close();
        return result;
    },
    update: async (id, product) => {
        await client.connect();
        const db = client.db('ecommerce');
        const products = db.collection('products');
        const result = await products.updateOne({ _id: new ObjectId(id) }, { $set: product });
        await client.close();
        return result;
    },
    delete: async (id) => {
        await client.connect();
        const db = client.db('ecommerce');
        const products = db.collection('products');
        const result = await products.deleteOne({ _id: new ObjectId(id) });
        await client.close();
        return result;
    }
};

module.exports = Product;
