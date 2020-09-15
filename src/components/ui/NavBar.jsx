import { h } from 'preact';

export default function NavBar({ children, className, ...props }) {
    return (
        <div { ...props } class={`s-navbar ${className}`}>
            {children}
        </div>
    );
}
function Brand({ url, children}) {
    if (url) {
        return (
            <a  class="s-navbar-brand" href={url}>
                {children}
            </a>
        );
    }
    return (
        <span class="s-navbar-brand">
            {children}
        </span>
    );
}
function Nav() {
    return (
        <ul class="s-navbar-nav">
            {children}
        </ul>
    )
}
function NavItem() {
    return (
        <ul class="s-navbar-nav-item">
            {children}
        </ul>
    )
}

NavBar.Brand = Brand;
NavBar.Nav = Nav;
NavBar.NavItem = NavItem;