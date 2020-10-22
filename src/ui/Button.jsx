import { h } from "preact";
import { classNames } from '@stool/dom';

export default function Button({
    variant,
    color,
    children,
    href,
    disabled,
    prefix,
    suffix,
    onClick
}) {
    const className = classNames('s-btn', {
        's-btn--disabled': disabled,
        [`s-btn--variant-${variant}`]: variant,
        [`s-btn--color-${color}`]: color,
    });
    const Component = href ? 'a' : 'button';
    return (
        <Component className={className} onClick={onClick} disabled={disabled} href={href}>
            {prefix && <span className="s-btn__prefix">{prefix}</span>}
            <span className="s-btn__body">
                {children}
            </span>
            {suffix && <span className="s-btn__suffix">{suffix}</span>}
        </Component>
    );
}

Button.Line = ({ children }) => (
    <div className="s-btn-line">
        {children}
    </div>
);