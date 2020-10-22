import { h } from "preact";
import { useEffect } from "preact/hooks";

export default function Overlay({ onClose }) {
    useEffect(() => {
        document.body.classList.add('overlay');
        () => document.body.classList.remove('overlay');
    }, []);
    const closeHandler = () => {
        document.body.classList.remove('overlay');
        onClose();
    }
    return (
        <div class="s-overlay" onClick={closeHandler}></div>
    );
}
