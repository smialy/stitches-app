import { h } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";

import { useDatabase } from "../../hooks/db";
import FlossImport from "../../common/FlossImport";

const initState = {
    flosses: [],
    loading: true,
    error: "",
    adding: false,
};

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case "init": {
            const { flosses } = payload;
            return { ...state, flosses, loading: false };
        }
        case "add-new":
            return { ...state, adding: true };
        case "cancel":
            return { ...state, adding: false };
        case "save": {
            const { flosses } = payload;
            return { ...state, flosses, adding: false };
        }
        case "reset": {
            return { ...state, flosses: [], adding: false };
        }
        case "remove": {
            const { skein } = payload;
            const flosses = state.flosses.filter((s) => s.id !== skein.id);
            return { ...state, flosses, adding: false };
        }
        default:
            throw new Error(`Unexpected action: ${action.type}`);
    }
};

export function ProjectFlosses({ id }) {
    const [text, setText] = useState("");
    const [{ flosses, loading, adding }, dispatch] = useReducer(reducer, initState);
    const db = useDatabase();

    useEffect(() => {
        db.getProjectFlosses(id)
            .then((flosses) => {
                // dispatch({ type: 'init', payload: { flosses }});
            })
            .catch((e) => {
                console.log(e);
                // dispatch({ type: 'init', payload: { skeins }});
            });
    }, []);
    // const addNew = () => dispatch({ type: 'add-new'});
    // const save = () => {
    //     let skeins = [];
    //     if (text) {
    //     }
    //     dispatch({ type: 'save', payload: { skeins } });
    // };
    // const reset = () => dispatch({ type: 'reset' });
    // const cancel = () => dispatch({ type: 'cancel' });
    // const remove = skein => () => dispatch(({ type: 'remove', payload: { skein }}))
    const setFlosses = (flosses) => dispatch({ type: "save", payload: { flosses } });
    const changeHandler = ({ type, payload }) => dispatch({ type, payload });
    return (
        <div>
            <h5>Flosses</h5>
            <FlossImport flosses={flosses} onChange={changeHandler} />
        </div>
    );
}

function Skein({ skein, onRemove }) {
    return (
        <div>
            <span>{skein.id}</span>
            <span>{skein.typeId}</span>
            <span>{skein.projectId}</span>
            <span> - {skein.size}</span>
            <button onClick={onRemove(skein)}>x</button>
        </div>
    );
}
let sid = 0;
function parseRows(text) {
    return text
        .trim()
        .split("\n")
        .map((line) => line.split(" "))
        .map((item) => ({
            id: (sid += 1),
            typeId: `${item[0]} ${item[1]}`,
            projectId: "",
            size: item[11],
        }));
}
