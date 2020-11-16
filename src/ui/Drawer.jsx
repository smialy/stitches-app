import { h } from "preact";
import { classNames } from "@stool/dom";

import Overlay from "./Overlay";
import Portal from "./Portal";

export default function Drawer({ header, fixed, dir = "right", onClose, children }) {
    const className = classNames("s-drawer", {
        "s-drawer--right": dir === "right",
        "s-drawer--fixed": fixed,
    });
    return (
        <Portal into="#x-drawer">
            <Overlay onClose={onClose} />
            <div class={className}>
                {header && <header>{header}</header>}
                <div class="body">{children}</div>
            </div>
        </Portal>
    );
}
