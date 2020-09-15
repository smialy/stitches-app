import { h } from 'preact';

export default function List({ subheader, children }) {
    const className = `s-list`;
    return (
      <ul class={className}>
            {subheader}
            {children}
      </ul>
    );
}

List.Item = function ListItem({ children }) {
    return (
        <li>

        </li>
    )
}