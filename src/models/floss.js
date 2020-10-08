export default class Floss {
    static entities() {
        return {
            flosses: "++id,&sid,type,identifier,name,color,size,createdAt",
        };
    }
    constructor(db) {
        this.db = db;
    }
    all() {
        return this.db.flosses.toArray();
    }
    bulkGet(ids) {
        return this.db.flosses.bulkGet(ids);
    }
    update(id, size) {
        return this.db.flosses.update(id, { size });
    }
}
