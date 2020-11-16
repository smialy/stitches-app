import { h, Fragment } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";
import { route } from "preact-router";

import { useDatabase } from "../../hooks/db";
import Page from "../../ui/Page";
import Icons from "../../ui/Icons";
import ImportForm from "./ImportForm";
import Drawer from "../../ui/Drawer";
import { TextField } from "../../ui/Form";
import Button from "../../ui/Button";
import { Flosses } from "../../common/Flosses";

const initState = {
    project: {},
    flosses: [],
    loading: true,
    error: "",
    showAddForm: false,
    showImportForm: false,
};

const reducer = makeReducer({
    projectLoaded: ({ project }) => ({ project, loading: false }),
    loadError: ({ error }) => ({ loading: false, error }),
    flossesLoaded: ({ flosses }) => ({ flosses }),
    showAddForm: () => ({ showAddForm: true }),
    showImportForm: () => ({ showImportForm: true }),
    hideForm: () => ({ showAddForm: false, showImportForm: false }),
    flossesUpdated: ({ flosses }) => ({ flosses }),
    addFloss: ({ floss }, { flosses }) => ({ flosses: flosses.concat([floss]) }),
});

function makeReducer(config) {
    return (state, action) => {
        const { type, payload } = action;
        if (config[type]) {
            return { ...state, ...config[type](payload, state) };
        }
        console.warn(`Unexpected action: ${type}`);
    };
}

export default function ProjectPage({ matches: { sid } }) {
    const [
        { project, flosses, loading, showImportForm, showAddForm, error },
        dispatch,
    ] = useReducer(reducer, initState);
    const db = useDatabase();

    useEffect(() => {
        db.getProject(parseInt(sid, 10))
            .then(project => {
                if (project) {
                    dispatch({ type: "projectLoaded", payload: { project } });
                    db.getProjectFlosses(project.id).then(flosses => {
                        dispatch({ type: "flossesLoaded", payload: { flosses } });
                    });
                } else {
                    dispatch({ type: "loadError", payload: `Not found project: ${sid}` });
                }
            })
            .catch(e => {
                console.error(e);
                route("/projects");
            });
    }, []);
    if (loading) {
        return "Loading...";
    }
    if (error) {
        return error;
    }
    const addHandler = () => dispatch({ type: "showAddForm" });
    const importHandler = () => dispatch({ type: "showImportForm" });
    const hideForm = () => dispatch({ type: "hideForm" });
    const importChangeHandler = async imported => {
        for (const record of imported) {
            await addFloss(record);
        }
    };
    const addFloss = async ({ type, identifier, quantity }) => {
        const floss = await db.findFloss(type, identifier);
        if (floss) {
            const { color, name, id: flossId } = floss;
            const record = {
                projectId: project.id,
                flossId,
                name,
                type,
                identifier,
                quantity,
                color,
                shortage: floss.quantity - quantity < 0,
            };
            db.addProjectFloss(record);
            dispatch({ type: "addFloss", payload: { floss: record } });
        } else {
            console.warn(`Not found: ${type}: ${identifier}`);
        }
    };
    const updateName = name => {
        db.updateProjectName(project.id, name).then(project => {
            dispatch({ type: "projectLoaded", payload: { project } });
        });
    };
    const orderHandler = async () => {
        const records = flosses
            .filter(floss => floss.shortage)
            .map(({ flossId, quantity }) => {
                return {
                    flossId,
                    quantity,
                };
            });
        const order = await db.createOrder(records);
        route(`/order/${order.id}`);
    };
    return (
        <Page>
            <Page.Header>
                Project: <EditName name={project.name} onUpdate={updateName} />
                <Page.Header.Action
                    label="Order"
                    icon={<Icons.AddCicle />}
                    onClick={orderHandler}
                />
                <Page.Header.Action label="Add" icon={<Icons.AddCicle />} onClick={addHandler} />
                <Page.Header.Action
                    label="Import"
                    icon={<Icons.AddCicle />}
                    onClick={importHandler}
                />
            </Page.Header>
            <Page.Body>
                <Flosses flosses={flosses} />
            </Page.Body>
            {showImportForm && (
                <Drawer onClose={hideForm} header="Import flosses" fixed>
                    <ImportForm onImport={importChangeHandler} onClose={hideForm} />
                </Drawer>
            )}
            {showAddForm && (
                <Drawer onClose={hideForm} header="Add floss" fixed>
                    <AddForm onAdd={addFloss} onClose={hideForm} />
                </Drawer>
            )}
        </Page>
    );
}

function EditName({ name, onUpdate }) {
    const [mode, setMode] = useState("view");
    const [value, setValue] = useState("");
    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isValid = !!value.trim();
    const editHandler = () => {
        setMode("edit");
    };
    const saveHandler = () => {
        if (isValid) {
            onUpdate(value);
            setMode("view");
        }
    };
    useEffect(() => {
        setValue(name);
    }, [name]);
    return (
        <Fragment>
            {isView && (
                <span className="editable" onClick={editHandler}>
                    {name}
                </span>
            )}
            {isEdit && (
                <Fragment>
                    <TextField
                        value={value}
                        onChange={setValue}
                        valid={isValid}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                saveHandler();
                            }
                        }}
                        focus
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={!isValid}
                        onClick={saveHandler}
                    >
                        Save
                    </Button>
                </Fragment>
            )}
        </Fragment>
    );
}
const ADD_INIT_STATE = {
    type: "DMC",
    identifier: "",
    quantity: 1,
};

function AddForm({ onAdd, onClose }) {
    const type = "DMC";
    const [values, setValues] = useState(ADD_INIT_STATE);
    const [errors, setErrors] = useState({});
    const addHandler = () => {
        onClose();
        onAdd(values);
        setValues(ADD_INIT_STATE);
    };
    const addOtherHandler = () => {
        onAdd(values);
        setValues(ADD_INIT_STATE);
        setErrors({});
    };
    const onChange = name => value => {
        setErrors({ ...errors, [name]: value ? false : "empty" });
        setValues({ ...values, [name]: value });
    };
    const invalid = Object.values(errors).every(value => !!value);
    return (
        <div class="floss-add-form">
            <TextField label="Type" value={type} disabled fullWidth />
            <TextField
                label="Identifier"
                value={values.identifier}
                invalid={errors.identifier}
                onChange={onChange("identifier")}
                focus
                fullWidth
            />
            <TextField
                label="Quantity"
                value={values.quantity}
                invalid={errors.quantity}
                onChange={onChange("quantity")}
                fullWidth
            />
            <Button.Line>
                <Button onClick={addHandler} color="primary" variant="contained" disabled={invalid}>
                    Save
                </Button>
                <Button
                    onClick={addOtherHandler}
                    color="primary"
                    variant="contained"
                    disabled={invalid}
                >
                    Save and add another
                </Button>
            </Button.Line>
        </div>
    );
}
