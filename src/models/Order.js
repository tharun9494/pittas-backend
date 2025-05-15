const { db } = require('../config/firebase');

class Order {
    constructor(data) {
        this.orderId = data.orderId;
        this.customerName = data.customerName;
        this.phone = data.phone;
        this.amount = data.amount;
        this.items = data.items;
        this.address = data.address;
        this.createdAt = data.createdAt || new Date();
    }

    static async create(orderData) {
        const order = new Order(orderData);
        const orderRef = db.collection('orders').doc(order.orderId);
        await orderRef.set({
            ...order,
            createdAt: new Date()
        });
        return order;
    }
}

module.exports = Order; 