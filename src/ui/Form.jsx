import { h, createRef } from "preact";
import { classNames } from "@stool/dom";
import { useEffect } from "preact/hooks";

export const TextField = ({
    label,
    type = "text",
    value,
    invalid,
    onChange,
    float,
    focus,
    multiline,
    fullWidth,
    ...props
}) => {
    const className = classNames("s-textfield", {
        "s-textfield--float": float,
        "s-textfield--not-empty": !!value,
        "s-textfield--invalid": invalid,
        "s-textfield--full-width": fullWidth,
    });
    const inputRef = createRef();
    if (focus) {
        useEffect(() => {
            if (inputRef) {
                inputRef.current.focus();
            }
        }, []);
    }
    const component = multiline ? (
        <textarea ref={inputRef} value={value} onInput={e => onChange(e.target.value)} {...props} />
    ) : (
        <input
            type="text"
            ref={inputRef}
            value={value}
            onInput={e => onChange(e.target.value)}
            {...props}
        />
    );
    return (
        <div className={className}>
            {component}
            {label && <label htmlFor={props.id}>{label}</label>}
        </div>
    );
};
