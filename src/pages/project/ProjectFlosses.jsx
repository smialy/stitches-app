import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

import { useDatabase } from "../../hooks/db";
import { Flosses } from "../../common/Flosses";
import { FlossImport } from "../../common/FlossImport";
import { DialogForm } from "../../ui/Dialog";
import Drawer from "../../ui/Drawer";

export function ProjectFlosses({ project }) {
    const { id: projectId } = project;
    const db = useDatabase();
    const [flosses, setFlosses] = useState([]);
    useEffect(() => {
        db.getProjectFlosses(projectId).then(setFlosses);
    }, []);

    const [showImportForm, setShowImportForm] = useState(false);
    const importHandler = () => {
        setShowImportForm(true);
    };
    const importChangeHandler = async imported => {
        const buff = [];
        for (const { type, identifier, quantity } of imported) {
            // console.log({ type, identifier, quantity });
            const floss = await db.findFloss(type, identifier);
            if (floss) {
                const { color, name, id: flossId } = floss;
                buff.push({
                    projectId,
                    flossId,
                    name,
                    type,
                    identifier,
                    quantity,
                    color,
                    shortage: floss.quantity - quantity < 0,
                });
            } else {
                console.warn(`Not found: ${type}: ${identifier}`);
            }
        }
        db.addProjectFlosses(buff);
        setFlosses(flosses.concat(buff));
    };
    return (
        <div>
            <h2>Flosses</h2>
            <button onClick={importHandler}>Import</button>x{" "}
            {showImportForm && (
                <Drawer onClose={() => setShowImportForm(false)} fixed>
                    <FlossImport flosses={flosses} onChange={importChangeHandler} />
                </Drawer>
            )}
        </div>
    );
}

function uniqueBy(records, field) {
    const buff = [];
    return records.filter(record => {
        const value = record[field];
        if (!buff.includes(value)) {
            buff.push(value);
            return true;
        }
        return false;
    });
    return buff;
}
