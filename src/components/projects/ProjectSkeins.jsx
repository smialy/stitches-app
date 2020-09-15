import { h } from 'preact';
import { useEffect, useReducer, useState } from 'preact/hooks';
import { Link, route } from 'preact-router';

import { useDatabase } from '../../db';

const initState = {
    skeins: [],
    loading: true,
    error: '',
    adding: false,
}

const reducer = (state, action) => {
    const { type, payload } = action;
    switch(type) {
        case 'init': {
            const { skeins } = payload;
            return { ...state,  skeins, loading: false };
        }
        case 'add-new':
            return { ...state, adding: true };
        case 'cancel':
            return { ...state, adding: false };
        case 'save': {
            const { skeins } = payload;
            return { ...state, skeins, adding: false };
        }
        case 'reset': {
            return { ...state, skeins: [], adding: false };
        }
        case 'remove': {
            const { skein } = payload;
            const skeins = state.skeins.filter(s => s.id !== skein.id);
            return { ...state, skeins, adding: false };
        }
        default: throw new Error(`Unexpected action: ${action.type}`);
    }
};

export function Skeins({ id }) {
    const [text, setText] = useState('');
    const [{ skeins, loading, adding }, dispatch] = useReducer(reducer, initState);
    const db = useDatabase();

    useEffect(() => {
        db.skeins.where({ projectId: id }).toArray().then(skeins => {
            dispatch({ type: 'init', payload: { skeins }});
        }).catch(e => {
            console.log(e);
            // dispatch({ type: 'init', payload: { skeins }});
        });
    }, []);
    const addNew = () => dispatch({ type: 'add-new'});
    const save = () => {
        let skeins = [];
        if (text) {
            skeins = parseRows(text);
        }
        dispatch({ type: 'save', payload: { skeins } });
    };
    const reset = () => dispatch({ type: 'reset' });
    const cancel = () => dispatch({ type: 'cancel' });
    const remove = skein => () => dispatch(({ type: 'remove', payload: { skein }}))
    console.log(skeins);
    return (
        <div>
            <h5>Skeins</h5>
            {!adding && (
                <div>
                    <button onClick={addNew}>Add</button>
                    <button onClick={reset}>Reset</button>

                </div>
            )}
            {adding && (
                <div>
                    <button onClick={cancel}>Cancel</button>
                    <button onClick={save}>Save</button>
                    <textarea cols="10" rows="10" value={text} onInput={e => setText(e.target.value)}></textarea>
                </div>
            )}
            {skeins.map(skein => <Skein skein={skein} onRemove={remove} />)}
        </div>
    )
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
        .split('\n')
        .map(line => line.split(' '))
        .map(item => ({
            id: sid+=1,
            typeId: `${item[0]} ${item[1]}`,
            projectId: '',
            size: item[11],
        }));
}