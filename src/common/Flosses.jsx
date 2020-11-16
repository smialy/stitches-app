import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

import { DialogForm } from "../ui/Dialog";
import Icons from "../ui/Icons";

export function Flosses({ flosses, onChange, readonly, removeable }) {
    const [showEditForm, setShowEditForm] = useState(false);
    const [current, setCurrent] = useState(null);

    const onAction = async ({ name, payload }) => {
        console.log("onAction", name, payload);
        switch (name) {
            case "edit": {
                const { floss } = payload;
                setShowEditForm(true);
                setCurrent(floss);
                break;
            }
            case "hide-edit-form": {
                setShowEditForm(false);
                break;
            }
            case "update-quantity": {
                setShowEditForm(false);
                const {
                    floss: { id },
                    quantity,
                } = payload;
                onChange({ id, quantity });
            }
        }
    };
    const cflosses = flosses.map(floss => (
        <Floss
            key={floss.key}
            floss={floss}
            onAction={onAction}
            readonly={readonly}
            removeable={removeable}
        />
    ));
    return (
        <div class="flosses">
            {cflosses}
            {showEditForm && <EditForm floss={current} onAction={onAction} />}
        </div>
    );
}

function Floss({ floss, removeable, readonly, onAction }) {
    const { id, type, name, sid, quantity, identifier, color, shortage } = floss;
    const onEdit = () => onAction && onAction({ name: "edit", payload: { floss } });

    const className = ["floss"];
    if (readonly) {
        className.push("floss--readonly");
    }
    if (shortage) {
        className.push("floss--shortage");
    }
    return (
        <div class={className.join(" ")} data-sid={sid} onClick={onEdit}>
            <span class="floss-color" style={{ background: color }} />
            <span class="floss-type">{type}</span>
            <span class="floss-identifier">{identifier}</span>
            <span class="floss-name">{name}</span>
            <span class="floss-quantity">{quantity}</span>

            {removeable && (
                <span class="floss-actions">
                    {removeable && <Icons.Delete onClick={() => console.log("remove")} />}
                </span>
            )}
        </div>
    );
}

function EditForm({ floss, onAction }) {
    const [inputquantity, setquantity] = useState("");

    const saveHandler = () => {
        onAction({ name: "update-quantity", payload: { floss, quantity: inputquantity } });
        setquantity("");
    };
    const closeHandler = () => onAction({ name: "hide-edit-form" });

    useEffect(() => {
        setquantity(floss.quantity);
    }, [floss.quantity]);
    return (
        <DialogForm onClose={closeHandler}>
            <div class="floss-edit-form">
                <Floss floss={floss} />
                <div class="form">
                    <input
                        name="text"
                        value={inputquantity}
                        onInput={e => setquantity(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                saveHandler();
                            }
                        }}
                        onFocus={e => {
                            e.target.setSelectionRange(0, e.target.value.length);
                        }}
                    />
                    <button onClick={saveHandler}>Save</button>
                </div>
            </div>
        </DialogForm>
    );
}

function clean(txt) {
    return text.replace(/^"|"$/, "");
}
