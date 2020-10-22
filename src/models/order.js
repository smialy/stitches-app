export default class Projects {
    static entities() {
        return {
            order: "++id,status,createdAt",
            order_floss: "++id,orderId,flossId,quantity",
        };
    }
    constructor(db) {
        this.db = db;
    }
    all() {
        return this.db.order.orderBy('createdAt').reverse().toArray();
    }
    get(id) {
        return this.db.order.get(id);
    }
    async create() {
        const status = 'INIT';
        const createdAt = new Date().getTime();
        const id = await this.db.order.add({ status, createdAt });
        return await this.get(id);
    }
    async remove(id) {
        await this.db.order.delete(id);
        await this.db.order_floss.where({ orderId: id }).delete();
    }
    getFlosses(id) {
        return this.db.order_floss.where({ orderId: id }).toArray();
    }
    findFloss(orderId, flossId) {
        return this.db.order_floss.where({ orderId, flossId }).first();
    }
    addFloss(floss) {
        return this.db.order_floss.add(toFloss(floss));
    }
    updateFloss(id, quantity) {
        return this.db.order_floss.update(id, { quantity });
    }
    removeFloss(id) {
        return this.db.order_floss.delete(id);
    }
}
const toFloss = ({ flossId, orderId, quantity}) => ({ flossId, orderId, quantity });