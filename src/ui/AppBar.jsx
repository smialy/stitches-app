import { h } from "preact";

import NavBar from "./NavBar";

export default function AppBar({ position = "fixed", className, children }) {
    return <NavBar className={className}>{children}</NavBar>;
}
