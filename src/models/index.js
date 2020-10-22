import Dexie from "dexie";
import Project from "./project";
import Floss from "./floss";
import Order from "./order";


const NAME = "StichesDBv1";

const VERSION = 3;

class StorageDao {
    constructor(db) {
        this.db = db;
        this.project = new Project(db);
        this.floss = new Floss(db);
        this.order = new Order(db);
    }
    getAllProjects() {
        return this.project.all();
    }
    getProject(id) {
        return this.project.get(id);
    }
    addProject(values) {
        return this.project.add(values);
    }
    removeProject(id) {
        return this.project.remove(id);
    }
    async updateProjectName(id, name) {
        await this.project.updateName(id, name);
        return this.project.get(id);
    }
    async getProjectFlosses(projectId) {
        const projectFlosses = await this.project.getFlosses(projectId);
        const fids = projectFlosses.map(row => row.flossId);
        const flosses = await this.floss.bulkGet(fids);
        const flossesMap = flosses.reduce((acc, floss) => {
            acc[floss.id] = floss;
            return acc;
        }, {});
        return projectFlosses.map(floss => {
            const main = flossesMap[floss.flossId];
            const shortage = main.quantity - floss.quantity < 0;
            return { ...main, ...floss, shortage };
        });
    }
    getAllFlosses() {
        return this.floss.all();
    }
    findFloss(type, identifier) {
        return this.floss.find(type, identifier);
    }
    addProjectFloss(floss) {
        return this.project.addFloss(floss);
    }
    updateFloss(id, data) {
        return this.floss.update(id, data);
    }
    async getOrderFlosses(id) {
        const orderFlosses = await this.order.getFlosses(id);
        const fids = orderFlosses.map(row => row.flossId);
        const flosses = await this.floss.bulkGet(fids);
        const flossesMap = flosses.reduce((acc, floss) => {
            acc[floss.id] = floss;
            return acc;
        }, {});
        return orderFlosses.map(floss => {
            const main = flossesMap[floss.flossId];
            const shortage = 0;//main.quantity - floss.quantity < 0;
            return { ...main, ...floss, shortage };
        });
    }

}

export function createDatabase() {
    const db = new Dexie(NAME);
    const ENTITIES = {
        ...Project.entities(),
        ...Floss.entities(),
        ...Order.entities(),
    };
    db.version(VERSION).stores(ENTITIES);
    return new StorageDao(db);
}
