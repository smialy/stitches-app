import { h } from "preact";
import { useState } from "preact/hooks";

import { Flosses } from "./Flosses";

const HEAD_SIZE = 12;

export function FlossImport({ onImport }) {
    const [flosses, setFlosses] = useState([]);
    const [text, setText] = useState("");
    const handleInput = value => setText(value);
    const onAdd = () => {
        onImport(flosses);
        onReset();
    };
    const onReset = () => {
        setFlosses([]);
        setText("");
    };
    const importHandler = () => setFlosses(uniqueFlosses(parse(text)));

    return <div class="floss-import"></div>;
}

function parse(text) {
    let rows = text.split("\n").map(line => line.split(" "));
    const isHead = rows.every(row => row.length === HEAD_SIZE);
    if (isHead) {
        return rows.map(row => ({
            sid: `${row[0]}:${row[1]}`,
            type: row[0],
            identifier: row[1],
            quantity: row[11],
            color: "#fff",
        }));
    }

    rows = text
        .split("\n")
        .map(line => line.match(/((?:\d+\.)?\d+)/g))
        .filter(m => m);
    return rows.map(row => ({
        sid: `DMC:${row[0]}`,
        type: "DMC",
        identifier: row[0],
        quantity: row[row.length - 1],
    }));
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

function uniqueFlosses(flosses) {
    return uniqueBy(flosses, "sid");
}

function flossHash(floss) {
    return `${floss.type}:${floss.identifier}`;
}
