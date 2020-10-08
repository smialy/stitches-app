import { h } from "preact";
import Portal from "./Portal";

export function Dialog({ children }) {
    return (
        <Portal into="#dialog">
            <div class="dialog-overlay"></div>
            <div class="dialog">
                <div class="dialog-body">{children}</div>
            </div>
        </Portal>
    );
}

export function DialogForm({ children }) {
    return (
        <Dialog>
            <div class="dialog-form">
                <div class="dialog-form-wrapper">{children}</div>
            </div>
        </Dialog>
    );
}
