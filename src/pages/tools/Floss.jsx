import { h } from "preact";
import FlossImport from "../../common/FlossImport";

export default function Floss() {
    return (
        <div class="tools-floss-tab">
            <h1>Floss</h1>
            <FlossImport flosses={[]} onChange={() => {}} />
        </div>
    );
}
