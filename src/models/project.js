export default class Projects {
    static entities() {
        return {
            project: "++id,name,status,createdAt",
            project_floss: "++id,projectId,flossId,quantity",
        };
    }
    constructor(db) {
        this.db = db;
    }
    all() {
        return this.db.project.orderBy('createdAt').reverse().toArray();
    }
    get(id) {
        return this.db.project.get(id);
    }
    updateName(id, name) {
        return this.db.project.update(id, { name });
    }
    async add(values) {
        const createdAt = new Date().getTime();
        const status = 'INIT';
        const id = await this.db.project.add({ ...values, status, createdAt });
        return await this.db.project.get(id);
    }
    async remove(id) {
        await this.db.project.delete(id);
        await this.db.project_floss.where({ projectId: id }).delete();
    }
    async getFlosses(id) {
        return this.db.project_floss.where({ projectId: id }).toArray();

    }
    async addFloss(floss) {
        return this.db.project_floss.add(toFloss(floss));
    }
}
const toFloss = ({ flossId, projectId, quantity}) => ({ flossId, projectId, quantity });