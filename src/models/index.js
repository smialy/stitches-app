import Dexie from "dexie";
import Project from "./project";
import Floss from "./floss";

const NAME = "StichesDBv1";

const VERSION = 1;

class StorageDao {
    constructor(db) {
        this.db = db;
        this.project = new Project(db);
        this.floss = new Floss(db);
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
    getAllFlosses() {
        return this.floss.all();
    }
    async getProjectFlosses(id) {
        const ids = await this.project.getFlosses(id);
        return await this.floss.bulkGet(ids);
    }
    updateFloss(id, data) {
        return this.floss.update(id, data);
    }
}

export function createDatabase() {
    const db = new Dexie(NAME);
    const ENTITIES = {
        ...Project.entities(),
        ...Floss.entities(),
    };
    db.version(VERSION).stores(ENTITIES);
    return new StorageDao(db);
}
