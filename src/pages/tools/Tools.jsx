import { h } from "preact";

import { Tabs, Tab } from "../../ui/Tabs";
import Page from '../../ui/Page';
import DatabaseTab from "./Database";
import FlossTab from "./Floss";

export default function ToolsPage() {
    const onChange = event => console.log({ event });
    return (
        <Page>
            <Page.Header>Tools</Page.Header>
            <Page.Body>

                <Tabs onChange={onChange}>
                    <Tab name="flosses" label="Flosses">
                        <FlossTab />
                    </Tab>
                    <Tab name="db" label="DB">
                        <DatabaseTab />
                    </Tab>
                </Tabs>
            </Page.Body>
        </Page>
    );
}
