export default class Projects {
    static entities() {
        return {
            projects: "++id,name,createdAt",
            projects_flosses: "++id,typeId,projectId,size",
        };
    }
    constructor(db) {
        this.db = db;
    }
    all() {
        return this.db.projects.toArray();
    }
    get(id) {
        return this.db.projects.get(id);
    }
    async add(values) {
        const createdAt = new Date().getTime();
        const id = await this.db.projects.add({ ...values, createdAt });
        return await this.db.projects.get(id);
    }
    remove(id) {
        return this.db.projects.delete(id);
    }
    async getFlosses(id) {
        const rows = await this.db.projects_flosses.where({ projectId: id }).toArray();
        return rows.map((row) => row.flossId);
    }
}
