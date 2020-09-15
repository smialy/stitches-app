import Dexie from 'dexie';
import Projects from './projects';
import Floss from './floss';

const NAME = "StichesDB";

const VERSION = 1;

const ENTITIES = {
    ...Projects.entities(),
    ...Floss.entities(),
};

export function createDatabase() {
    const db = new Dexie(NAME);
    db.version(VERSION).stores(ENTITIES);
    return db;
}
