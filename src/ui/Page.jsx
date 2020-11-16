import { h, toChildArray } from "preact";
import Button from "../ui/Button";

export default function Page({ name = "default", children }) {
    return (
        <div class="s-page" data-name={name}>
            {children}
        </div>
    );
}

const isTitle = node => node.type === Page.Header.Title;
const isAction = node => node.type === Page.Header.Action;
const isActions = node => node.type === Page.Header.Actions;

Page.Header = ({ children }) => {
    children = toChildArray(children);
    const labels = [];
    const actions = [];
    let title = null;
    while (children.length) {
        let child = children.shift();
        if (isAction(child)) {
            actions.push(child);
            continue;
        }

        if (isTitle(child) || actions.length === 0) {
            labels.push(child);
            continue;
        }
        break;
    }
    if (labels.length === 1) {
        if (typeof labels[0] === "string") {
            title = <Page.Header.Title>{labels[0]}</Page.Header.Title>;
        }
    } else if (labels.length > 1) {
        title = <Page.Header.Title>{labels}</Page.Header.Title>;
    }
    if (actions.length) {
        children = <Page.Header.Actions>{actions}</Page.Header.Actions>;
    }
    return (
        <div class="s-page-header">
            {title}
            {children}
        </div>
    );
};

Page.Header.Title = ({ children }) => <h1 class="title">{children}</h1>;

Page.Header.Actions = ({ children }) => {
    return <div class="actions">{children}</div>;
};

Page.Header.Action = ({ label, icon, primary, onClick, children }) => (
    <Button className="action" onClick={onClick} prefix={icon} variant="contained">
        {label ? label : children}
    </Button>
);

Page.Body = ({ children }) => <div className="s-page-body">{children}</div>;
