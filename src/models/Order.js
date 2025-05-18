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
}

module.exports = Order; 