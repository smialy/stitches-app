import { h } from "preact";
import { useState } from "preact/hooks";

export function Tabs({ children, ...props }) {
    const [current, setCurrent] = useState(0);
    const isActiveClass = "s-tabs--active";
    const onClick = (index, tab) => e => {
        console.log({ index, tab });
        setCurrent(index);
    };
    const tabs = [];
    let panel = null;
    for (let i = 0; i < children.length; i += 1) {
        const tab = children[i];
        const isActive = current === i;
        tabs.push(
            <li key={i} className={isActive ? isActiveClass : ""}>
                <a onClick={onClick(i, tab)}>{tab.props.label}</a>
            </li>
        );
        if (isActive) {
            panel = tab.props.children;
        }
    }
    return (
        <div {...props} class="s-tabs">
            <ul class="s-tabs-bar">{tabs}</ul>
            {panel}
        </div>
    );
}
export function Tab() {}
