import { h } from "preact";

export default function Breadcrumbs({ children }) {
    return (
        <div class="s-breadcrumbs">
            <ol>
                {children.map(child => (
                    <li>{child}</li>
                ))}
            </ol>
        </div>
    );
}
