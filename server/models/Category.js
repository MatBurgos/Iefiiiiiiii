// /server/models/Category.js
const { MongoClient, ObjectId } = require('mongodb');
const config = require('../config');

const client = new MongoClient(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const Category = {
    getAll: async () => {
        await client.connect();
        const db = client.db('ecommerce');
        const categories = db.collection('categories');
        const allCategories = await categories.find().toArray();
        await client.close();
        return allCategories;
    },
    add: async (category) => {
        await client.connect();
        const db = client.db('ecommerce');
        const categories = db.collection('categories');
        const result = await categories.insertOne(category);
        await client.close();
        return result;
    },
    delete: async (id) => {
        await client.connect();
        const db = client.db('ecommerce');
        const categories = db.collection('categories');
        const result = await categories.deleteOne({ _id: new ObjectId(id) });
        await client.close();
        return result;
    }
};

module.exports = Category;
