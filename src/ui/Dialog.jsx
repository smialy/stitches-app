import { h } from "preact";
import { useEffect } from "preact/hooks";
import Portal from "./Portal";
import Button from "./Button";
import Overlay from "./Overlay";

export default function Dialog({ onClose, children }) {
    const onEscape = e => {
        if (e.key === "Escape") {
            onClose && onClose();
        }
    };
    useEffect(() => {
        window.addEventListener("keydown", onEscape, false);
        return () => window.removeEventListener("keydown", onEscape, false);
    }, []);
    return (
        <Portal into="#x-dialog">
            <Overlay onClose={onClose} />
            <div class="s-dialog">
                <div class="back">
                    <div class="wrapper">{children}</div>
                </div>
            </div>
        </Portal>
    );
}
Dialog.Header = ({ children }) => <div class="header">{children}</div>;
Dialog.Content = ({ children }) => <div class="content">{children}</div>;
Dialog.Footer = ({ children }) => <div class="footer">{children}</div>;

export function SimpleDialog({ header, content, footer, onClose }) {
    return (
        <Dialog onClose={onClose}>
            {header && <Dialog.Header>{header}</Dialog.Header>}
            <Dialog.Content>{content}</Dialog.Content>
            {footer && <Dialog.Footer>{footer}</Dialog.Footer>}
        </Dialog>
    );
}
export function DialogForm({ onClose, children }) {
    return (
        <Dialog onClose={onClose}>
            <div class="s-dialog-form">
                <div class="wrapper">{children}</div>
            </div>
        </Dialog>
    );
}

export const DialogConfirm = ({ header, message, onConfirm, onCancel, onClose }) => (
    <Dialog onClose={onClose}>
        <div class="s-dialog-confirm">
            {header && <header>{header}</header>}
            <div class="body">{message}</div>
            <div class="actions">
                <Button onClick={onCancel}>No</Button>
                <Button onClick={onConfirm}>Yes</Button>
            </div>
        </div>
    </Dialog>
);
