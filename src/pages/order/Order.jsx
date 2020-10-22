import { h } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";

import { useDatabase } from "../../hooks/db";
import Page from '../../ui/Page';
import Icons from '../../ui/Icons';
import ImportForm from "./ImportForm";
import Drawer from "../../ui/Drawer";
import { TextField } from '../../ui/Form';
import Button from "../../ui/Button";
import { Flosses } from "../../common/Flosses";

const initState = {
    order: {},
    flosses: [],
    loading: true,
    error: "",
    showAddForm: false,
    showImportForm: false,
};

const reducer = makeReducer({
    orderLoaded: ({ order }) => ({ order, loading: false }),
    loadError: ({ error }) => ({ loading: false, error }),
    flossesLoaded: ({ flosses }) => ({ flosses }),
    showAddForm: () => ({ showAddForm: true }),
    showImportForm: () => ({ showImportForm: true }),
    hideForm: () => ({ showAddForm: false, showImportForm: false }),
    flossesUpdated: ({ flosses }) => ({ flosses }),
    addFloss: ({ floss }, { flosses }) => ({ flosses: flosses.concat([floss])}),
    updateFloss: ({ floss }, { flosses }) => ({ flosses: flosses.map(f => f.id === floss.id ? floss : f)})
});

function makeReducer(config) {
    return (state, action) => {
        const { type, payload } = action;
        if (config[type]) {
            return {...state, ...config[type](payload, state)};
        }
        console.warn(`Unexpected action: ${type}`);
    };
}

export default function OrderPage({ matches: { sid } }) {
    const [{
        order,
        flosses,
        loading,
        showImportForm,
        showAddForm,
        error
    }, dispatch] = useReducer(reducer, initState);

    const db = useDatabase();
    useEffect(() => {
        db.order.get(parseInt(sid, 10))
            .then(order => {
                if (order) {
                    dispatch({ type: "orderLoaded", payload: { order } });
                    db.getOrderFlosses(order.id).then(flosses => {
                        dispatch({ type: "flossesLoaded", payload: { flosses } });
                    });
                } else {
                    dispatch({ type: "loadError", payload: `Not found project: ${sid}` });
                }
            })
            .catch(e => {
                console.error(e);
                route("/orders");
            });
    }, []);
    const addHandler = () => dispatch({ type: "showAddForm" });
    const importHandler = () => dispatch({ type: "showImportForm" });
    const hideForm = () => dispatch({ type: 'hideForm'});
    const importChangeHandler = async imported => {
        for (const record of imported) {
            await addFloss(record);
        }
    };
    const addFloss = async ({ type, identifier, quantity }) => {
        const floss = await db.findFloss(type, identifier);
        if (floss) {
            const orderFloss = await db.order.findFloss(order.id, floss.id);
            if (orderFloss) {
                const q = parseInt(orderFloss.quantity, 10) + quantity
                await db.order.updateFloss(orderFloss.id, q);
                dispatch({ type: 'updateFloss', payload: { floss: {...floss, ...orderFloss, quantity: q} }});
            } else {
                const { color, name, id: flossId } = floss;
                const record = {
                    orderId: order.id,
                    flossId,
                    name,
                    type,
                    identifier,
                    quantity,
                    color,
                    shortage: floss.quantity - quantity < 0,
                };
                db.order.addFloss(record);
                dispatch({ type: "addFloss", payload: { floss: record } });
            }
        } else {
            console.warn(`Not found: ${type}: ${identifier}`);
        }
    }
    const { Header, Body } = Page;
    return (
        <Page name="orders-page">
            <Header>
                Order
                <Page.Header.Action
                    label="Add"
                    icon={<Icons.AddCicle />}
                    onClick={addHandler}
                />
                <Page.Header.Action
                    label="Import"
                    icon={<Icons.AddCicle />}
                    onClick={importHandler}
                />
            </Header>
            <Body>
                {loading && "Loading..."}
                {!loading && <Flosses flosses={flosses} />}
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
            </Body>
        </Page>
    );
}

const ADD_INIT_STATE = {
    type: 'DMC',
    identifier: '',
    quantity: 1,
};
function AddForm({ onAdd, onClose }) {
    const type = 'DMC';
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
        setErrors({ ...errors, [name]: value ? false : 'empty' });
        setValues({ ...values, [name]: value });
    };
    const invalid = Object.values(errors).every(value => !!value);
    return (
        <div class="floss-add-form">
            <TextField
                label="Type"
                value={type}
                disabled
                fullWidth
            />
            <TextField
                label="Identifier"
                value={values.identifier}
                invalid={errors.identifier}
                onChange={onChange('identifier')}
                focus
                fullWidth
            />
            <TextField
                label="Quantity"
                value={values.quantity}
                invalid={errors.quantity}
                onChange={onChange('quantity')}
                fullWidth
            />
            <Button.Line>
                <Button
                    onClick={addHandler}
                    color="primary"
                    variant="contained"
                    disabled={invalid}
                >
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