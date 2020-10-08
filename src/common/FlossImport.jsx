import { h } from "preact";
import { useState } from "preact/hooks";

import { Table } from "../ui/Table";

export default function FlossImport({ flosses, onChange }) {
    const [text, setText] = useState("");
    const handleInput = (value) => {
        setText(value);
    };
    const onRemove = (floss) => () => {
        // flosses.filter(item => {
        //     item !== floss
        // });
    };
    const onAdd = () => {
        const data = parse(text);
        onChange(uniqueFlosses(flosses.concat(data)));
        setText("");
    };
    const onReset = () => {
        setFlosses([]);
        setText("");
    };
    return (
        <div class="floss-import">
            <div class="preview">
                <FlossPreview flosses={flosses} onRemove={onRemove} />
            </div>
            <div class="editor">
                <div class="actiions">
                    <button onClick={onAdd}>Add</button>
                    <button onClick={onReset}>Reset</button>
                </div>
                <textarea
                    cols="20"
                    rows="10"
                    value={text}
                    onInput={(e) => handleInput(e.target.value)}
                ></textarea>
            </div>
        </div>
    );
}

function FlossPreview({ flosses, onRemove }) {
    const options = {
        columns: [
            {
                name: "type",
                label: "Type",
            },
            {
                name: "identifier",
                label: "Identifier",
            },
            {
                name: "size",
                label: "Size",
            },
            {
                format: (row) => {
                    <button onClick={() => onRemove(row)}>Remove</button>;
                },
            },
        ],
    };
    return (
        <div>
            <Table options={options} data={flosses} />
        </div>
    );
}
const HEAD_SIZE = 12;

function parse(text) {
    let rows = text.split("\n").map((line) => line.split(" "));
    const isHead = rows.every((row) => row.length === HEAD_SIZE);
    if (isHead) {
        return rows.map((row) => ({
            sid: `DMC:${row[0]}`,
            type: row[0],
            identifier: row[1],
            size: row[11],
        }));
    }

    rows = text
        .split("\n")
        .map((line) => line.match(/((?:\d+\.)?\d+)/g))
        .filter((m) => m);
    return rows.map((row) => ({
        sid: `DMC:${row[0]}`,
        type: "DMC",
        identifier: row[0],
        size: row[row.length - 1],
    }));
}

function uniqueFlosses(flosses) {
    const buff = [];
    return flosses.filter(({ sid }) => {
        if (!buff.includes(sid)) {
            buff.push(sid);
            return true;
        }
        return false;
    });
}
function flossHash(floss) {
    return `${floss.type}:${floss.identifier}`;
}
