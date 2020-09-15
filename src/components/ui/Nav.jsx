import { h } from 'preact';

export default function Nav({ children, className, ...props }) {
    return (
        <div { ...props } class={`s-nav ${className}`}>
            {children}
        </div>
    );
}
Nav.Link = function NavLink({ url, children }) {
    return (
        <li class="s-nav-link">
            <a href={url}>
                {children}
            </a>
        </li>
    );
}