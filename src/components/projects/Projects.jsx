import { h } from 'preact';
import { useEffect, useReducer, useState } from 'preact/hooks';
import { Link } from 'preact-router';

import { useDatabase } from '../../db';

const initState = {
    projects: [],
}

const reducer = (state, action) => {
    const { type, payload } = action;
    switch(type) {
        case 'init': {
            const { projects } = payload;
            return { ...state, projects };
        }
        case 'add': {
            const { id, name, createdAt } = payload;
            const projects = state.projects.concat([{id, name, createdAt}]);
            console.log(projects);
            return { ...state, projects }
        }
        case 'remove': {
            const { id } = payload;
            return { ...state, projects: state.projects.filter(p => p.id !== id)}
        }
        default: throw new Error(`Unexpected action: ${action.type}`);
    }
};

export default function ProjectsPage() {

    const [{ projects }, dispatch] = useReducer(reducer, initState);
    const db = useDatabase();
    useEffect(() => {
        const projects = db.projects.toArray().then(projects => {
            dispatch({ type: 'init', payload: { projects }});
        });
    }, []);
    const onAdd = name => {
        const createdAt = new Date().getTime();
        db.projects.add({ name, createdAt }).then(id => {
            dispatch({type: 'add', payload: { id, name, createdAt }});
        }).catch(err => console.error(err));

    }
    const onRemove = id => {
        db.projects.delete(id).then(() => {
            dispatch({type: 'remove', payload: { id }})
        }).catch(err => console.error(err));
    }

    return (
        <div class="projects">
            <h1>Projects</h1>
            {projects.map(project => <Project project={project} onRemove={onRemove} />)}
            <AddProject onAdd={onAdd} />
        </div>
    );
}

function Project({ project, onRemove }) {
    const { id, name } = project;
     return (
        <div class="project" data-id={id}>
            <Link href={`/project/${id}`} class="project-name">{name}</Link>
            <button onClick={() => onRemove(id)}>Remove</button>
        </div>
    );
}
function AddProject({ onAdd }) {
    const [name, setName] = useState('');
    const addHandler = () => {
        onAdd(name);
        setName('');
    };
    return (
        <div>
            <input type="text" value={name} onInput={e => setName(e.target.value)} />
            <button class="project-add" onClick={addHandler}>
                Add project
            </button>
        </div>
    );
}