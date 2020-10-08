import { h } from "preact";

import { Tabs, Tab } from "../../ui/Tabs";
import DatabaseTab from "./Database";
import FlossTab from "./Floss";

export default function ToolsPage() {
    const onChange = (event) => console.log({ event });
    return (
        <div class="tools">
            <h1>Tools</h1>
            <Tabs onChange={onChange}>
                <Tab name="flosses" label="Flosses">
                    <FlossTab />
                </Tab>
                <Tab name="db" label="DB">
                    <DatabaseTab />
                </Tab>
            </Tabs>
        </div>
    );
}
