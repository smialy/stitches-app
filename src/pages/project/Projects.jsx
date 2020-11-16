import { h, createRef } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";
import { route } from "preact-router";
// import Portal from 'preact-portal';

import { formatDate } from "../../utils/date";
import { useDatabase } from "../../hooks/db";
import Icons from "../../ui/Icons";
import Page from "../../ui/Page";
import { TextField } from "../../ui/Form";
import Drawer from "../../ui/Drawer";
import Button from "../../ui/Button";
import Dialog from "../../ui/Dialog";

const initState = {
    projects: [],
    current: null,
    showAddForm: false,
    showRemoveConfirm: false,
};

const reducer = (state, action) => {
    const { name, payload } = action;
    switch (name) {
        case "init": {
            const { projects } = payload;
            return { ...state, projects };
        }
        case "add": {
            const { id, name, status, createdAt } = payload;
            const projects = state.projects.concat([{ id, name, status, createdAt }]);
            return { ...state, showAddForm: false, projects };
        }
        case "remove": {
            const { current } = payload;
            return {
                ...state,
                current,
                showRemoveConfirm: true,
            };
        }
        case "remove-confirmed": {
            const { id } = payload;
            return {
                ...state,
                current: null,
                showRemoveConfirm: false,
                projects: state.projects.filter(p => p.id !== id),
            };
        }
        case "cancel-remove":
            return { ...state, current: null, showRemoveConfirm: false };
            break;
        case "show-add-form":
            return { ...state, showAddForm: true };
        case "hide-add-form":
            return { ...state, showAddForm: false };
        default:
            throw new Error(`Unexpected action: ${action.name}`);
    }
};

export default function ProjectsPage() {
    const [{ showAddForm, showRemoveConfirm, current, projects }, dispatch] = useReducer(
        reducer,
        initState
    );
    const db = useDatabase();
    useEffect(() => {
        const projects = db.getAllProjects().then(projects => {
            dispatch({ name: "init", payload: { projects } });
        });
    }, []);
    const addProject = name => {
        db.addProject({ name })
            .then(project => {
                dispatch({ name: "add", payload: project });
            })
            .catch(err => console.error(err));
    };
    const onRemove = current => {
        dispatch({ name: "remove", payload: { current } });
    };
    const removeConfirmHandler = () => {
        const { id } = current;
        db.removeProject(id)
            .then(() => {
                dispatch({ name: "remove-confirmed", payload: { id } });
            })
            .catch(err => console.error(err));
    };
    const onAction = ({ name, payload }) => {
        switch (name) {
            case "add-project": {
                const { name } = payload;
                addProject(name);
                break;
            }
            case "confirm-remove":
                removeConfirmHandler();
                break;
            default:
                dispatch({ name, payload });
        }
    };

    const showProjectForm = () => dispatch({ name: "show-add-form" });
    const hideProjectForm = () => dispatch({ name: "hide-add-form" });
    const { Header, Body } = Page;
    return (
        <Page>
            <Header>
                Projects
                <Header.Action
                    label="New Project"
                    icon={<Icons.AddCicle />}
                    onClick={showProjectForm}
                    primary
                />
            </Header>
            <Body>
                <div class="projects-list">
                    {projects.map(project => (
                        <Project project={project} onRemove={onRemove} />
                    ))}
                </div>
                {showAddForm && <AddProjectForm onAction={onAction} />}
                {showRemoveConfirm && <RemoveConfirm project={current} onAction={onAction} />}
            </Body>
        </Page>
    );
}

function Project({ project, onRemove }) {
    const { id, name } = project;
    const url = `/project/${id}`;
    return (
        <div class="project" data-id={id}>
            <div class="body" onClick={() => route(url)}>
                <div class="name">{name}</div>
                <div class="status">Status: {project.status}</div>
                <div class="status">Created: {formatDate(project.createdAt)}</div>
            </div>
            <div class="actions">
                <Button onClick={() => onRemove(project)} outline>
                    <Icons.Delete />
                    Remove
                </Button>
            </div>
        </div>
    );
}

function AddProjectForm({ onAction }) {
    const [name, setName] = useState("");
    const [invalid, setInvalid] = useState(false);
    const addHandler = () => {
        if (name.trim()) {
            setInvalid(false);
            setName("");
            onAction({ name: "add-project", payload: { name } });
        } else {
            setInvalid(true);
        }
    };
    const closeHandler = () => {
        onAction({ name: "hide-add-form" });
    };
    const disabled = !invalid && !name.trim();
    return (
        <Drawer onClose={closeHandler} header="Add Project" fixed>
            <TextField
                label="Project name"
                value={name}
                invalid={invalid}
                onChange={setName}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                        addHandler();
                    }
                }}
                focus
                float
                fullWidth
            />
            <Button onClick={addHandler} color="primary" variant="contained" disabled={disabled}>
                Add
            </Button>
        </Drawer>
    );
}

function RemoveConfirm({ project, onAction }) {
    return (
        <Dialog onClose={() => onAction({ name: "cancel-remove" })}>
            <Dialog.Content>Do you want remove: {project.name}</Dialog.Content>
            <Dialog.Footer>
                <Button onClick={() => onAction({ name: "confirm-remove" })}>Confirm</Button>
                <Button onClick={() => onAction({ name: "cancel-remove" })}>Cancel</Button>
            </Dialog.Footer>
        </Dialog>
    );
}
