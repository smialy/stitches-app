
export default class Projects {
    static entities() {
        return {
            projects: '++id,name,createdAt',
            projects_skeins: '++id,typeId,projectId,size',
        }
    }
}