import { h, createRef } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";
import { Link } from "preact-router";
// import Portal from 'preact-portal';

import { DialogForm } from "../../ui/Dialog";
import { useDatabase } from "../../hooks/db";

const initState = {
    projects: [],
    showAddForm: false,
};

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case "init": {
            const { projects } = payload;
            return { ...state, projects };
        }
        case "add": {
            const { id, name, createdAt } = payload;
            const projects = state.projects.concat([{ id, name, createdAt }]);
            console.log(projects);
            return { ...state, showAddForm: false, projects };
        }
        case "remove": {
            const { id } = payload;
            return { ...state, projects: state.projects.filter((p) => p.id !== id) };
        }
        case "show-add-form":
            return { ...state, showAddForm: true };
        case "hide-add-form":
            return { ...state, showAddForm: false };
        default:
            throw new Error(`Unexpected action: ${action.type}`);
    }
};

export default function ProjectsPage() {
    const [{ showAddForm, projects }, dispatch] = useReducer(reducer, initState);
    const store = useDatabase();
    useEffect(() => {
        const projects = store.getAllProjects().then((projects) => {
            dispatch({ type: "init", payload: { projects } });
        });
    }, []);
    const addProject = (name) => {
        store
            .addProject({ name })
            .then((project) => {
                dispatch({ type: "add", payload: project });
            })
            .catch((err) => console.error(err));
    };
    const onRemove = (id) => {
        store
            .removeProject(id)
            .then(() => {
                dispatch({ type: "remove", payload: { id } });
            })
            .catch((err) => console.error(err));
    };
    const onAction = ({ name, payload }) => {
        switch (name) {
            case "add-project":
                const { name } = payload;
                addProject(name);
                break;
        }
    };

    const showProjectForm = () => dispatch({ type: "show-add-form" });
    const hideProjectForm = () => dispatch({ type: "hide-add-form" });
    return (
        <div class="projects">
            <h1>
                Projects <button onClick={showProjectForm}>Add new</button>
            </h1>
            {projects.map((project) => (
                <Project project={project} onRemove={onRemove} />
            ))}
            {showAddForm && <AddProjectForm onAction={onAction} />}
        </div>
    );
}

function Project({ project, onRemove }) {
    const { id, name } = project;
    return (
        <div class="project" data-id={id}>
            <Link href={`/project/${id}`} class="project-name">
                {name}
            </Link>
            <button onClick={() => onRemove(id)}>Remove</button>
        </div>
    );
}

function AddProjectForm({ onAction }) {
    const [name, setName] = useState("");
    const addHandler = () => {
        onAction({ name: "add-project", payload: { name } });
        setName("");
    };
    const inputRef = createRef();
    useEffect(() => {
        if (inputRef) {
            inputRef.current.focus();
        }
    }, []);
    return (
        <DialogForm>
            <h1>Add Project</h1>
            <input
                ref={inputRef}
                type="text"
                value={name}
                onInput={(e) => setName(e.target.value)}
            />
            <button class="project-add" onClick={addHandler}>
                Add
            </button>
        </DialogForm>
    );
}
