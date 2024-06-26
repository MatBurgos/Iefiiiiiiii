const { MongoClient, ObjectId } = require('mongodb');
const config = require('../config');

const client = new MongoClient(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const Order = {
    getAll: async () => {
        await client.connect();
        const db = client.db('ecommerce');
        const orders = db.collection('orders');
        const allOrders = await orders.find().toArray();
        await client.close();
        return allOrders;
    },
    getById: async (id) => {
        await client.connect();
        const db = client.db('ecommerce');
        const orders = db.collection('orders');
        const order = await orders.findOne({ _id: new ObjectId(id) });
        await client.close();
        return order;
    },
    add: async (order) => {
        await client.connect();
        const db = client.db('ecommerce');
        const orders = db.collection('orders');
        const result = await orders.insertOne(order);
        await client.close();
        return result;
    },
    update: async (id, status) => {
        await client.connect();
        const db = client.db('ecommerce');
        const orders = db.collection('orders');
        const result = await orders.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );
        await client.close();
        return result;
    },
    delete: async (id) => {
        await client.connect();
        const db = client.db('ecommerce');
        const orders = db.collection('orders');
        const result = await orders.deleteOne({ _id: new ObjectId(id) });
        await client.close();
        return result;
    }
};

module.exports = Order;
