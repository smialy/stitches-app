import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useDatabase } from '../../db';



function Floss({ type, name, sid, number, color }) {
    const size = Math.ceil(Math.random() * 3) - 1
    return (
        <div class="floss">
            <span class="floss-type">{ type }</span>
            <span class="floss-number">{ number }</span>
            <span class="floss-name">{name}</span>
            <span class="floss-size">{size.toFixed(2)}</span>
            <span class="floss-color" style={{background: color }}></span>
        </div>
    );
}

export default function FlossesPage() {
    const [flosses, setFlosses] = useState([]);
    const [loading, setLoading] = useState(true);
    const db = useDatabase();
    useEffect(() => {

        db.flosses.toArray().then(data => {
            setFlosses(sortFlosses(data));
            setLoading(false);
        });
    }, []);

    return (
        <div class="flosses">
            {loading && "Loading..."}
            {!loading && flosses.map(floss => <Floss key={floss.key} {...floss} />)}
        </div>
    );
}



function sortFlosses(data) {
    data.sort((a, b) => {
        if (typeof a.number === 'number' && typeof b.number === 'number') {
            return a.number - b.number;
        }
        return typeof a.number === 'string' ? -1 : 1;
    });
    return data;
}

function clean(txt) {
    return text.replace(/^"|"$/, '');
}