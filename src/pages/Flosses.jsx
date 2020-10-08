import { h, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";

import { useDatabase } from "../hooks/db";

function Floss({ id, type, name, sid, size, identifier, color, onAction }) {
    const [editing, setEditing] = useState(false);
    const [sizeInput, setSizeInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSizeInput(size);
    }, [size]);

    const inputHandler = (e) => {
        const { value } = e.target;
        setSizeInput(value);
    };
    const editHandler = () => {
        setEditing(true);
    };
    const saveHandler = async () => {
        setEditing(false);
        setLoading(true);
        await onAction({ name: "update-size", payload: { id, size: sizeInput } });
        setLoading(false);
    };
    const cancelHandler = () => {
        setEditing(false);
    };
    return (
        <div class="floss" data-sid={sid}>
            <span class="floss-color" style={{ background: color }} />
            <span class="floss-type">{type}</span>
            <span class="floss-identifier">{identifier}</span>
            <span class="floss-name">{name}</span>
            <span class="floss-size">
                {editing ? (
                    <input type="text" size="3" value={sizeInput} onInput={inputHandler} />
                ) : (
                    size
                )}
            </span>
            {loading ? (
                "..."
            ) : (
                <span class="floss-actions">
                    {editing ? (
                        <Fragment>
                            <button onClick={cancelHandler}>cancel</button>
                            <button onClick={saveHandler}>save</button>
                        </Fragment>
                    ) : (
                        <button onClick={editHandler}>edit</button>
                    )}
                </span>
            )}
        </div>
    );
}

export default function FlossesPage() {
    const [flosses, setFlosses] = useState([]);
    const [loading, setLoading] = useState(true);
    const db = useDatabase();
    useEffect(() => {
        db.getAllFlosses().then((data) => {
            setFlosses(sortFlosses(data));
            setLoading(false);
        });
    }, []);
    const onAction = async ({ name, payload }) => {
        console.log("onAction", name, payload);
        if (name === "update-size") {
            const { id, size } = payload;
            try {
                await db.updateFloss(id, size);
                setFlosses(
                    flosses.map((floss) => {
                        if (floss.id === id) {
                            floss.size = size;
                        }
                        return floss;
                    })
                );
            } catch (e) {
                console.error(e);
            }
        }
    };
    const cflosses = flosses.map((floss) => (
        <Floss key={floss.key} {...floss} onAction={onAction} />
    ));
    return (
        <div class="flosses">
            {loading && "Loading..."}
            {!loading && cflosses}
        </div>
    );
}

function sortFlosses(data) {
    data.sort((a, b) => {
        if (isNumber(a.identifier) && isNumber(b.identifier)) {
            return parseInt(a.identifier, 10) - parseInt(b.identifier, 10);
        }
        return typeof a.number === "string" ? 1 : -1;
    });
    return data;
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

function clean(txt) {
    return text.replace(/^"|"$/, "");
}
