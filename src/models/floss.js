export default class Floss {
    static entities() {
        return {
            floss: "++id,&sid,type,identifier,createdAt", //name,color,quantity
        };
    }
    constructor(db) {
        this.db = db;
    }
    async all() {
        const data = await this.db.floss.toArray();
        return sortFlosses(data);
    }
    find(type, identifier) {
        return this.db.floss.where({ type, identifier }).first();
    }
    bulkGet(ids) {
        return this.db.floss.bulkGet(ids);
    }
    update(id, quantity) {
        return this.db.floss.update(id, { quantity });
    }
}

function sortFlosses(data) {
    const sortable = data.filter(isValidSort);
    const other = data.filter(row => !sortable.includes(row));
    sortable.sort((a, b) => {
        return parseInt(a.identifier, 10) - parseInt(b.identifier, 10);
    });
    return sortable.concat(other);
}
function isValidSort(floss) {
    return isNumber(floss.identifier);
}

function isNumber(o) {
    const type = typeof o;
    if (type === "number") {
        return true;
    }
    if (type === "string") {
        return /^\d+$/.test(o);
    }
    return false;
}
