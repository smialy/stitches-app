import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

import { useDatabase } from "../hooks/db";
import { Flosses } from "../common/Flosses";
import Page from '../ui/Page';
// return db.updateFloss(id, values);


export default function FlossesPage() {
    const [flosses, setFlosses] = useState([]);
    const [loading, setLoading] = useState(false);
    const db = useDatabase();
    useEffect(() => {
        setLoading(true);
        db.getAllFlosses().then(flosses => {
            setFlosses(flosses);
            setLoading(false);
        })}, []);
    const { Header, Body } = Page;
    return (
        <Page name="flosses-page">
            <Header>
                Current flosses
            </Header>
            <Body>
                {loading && "Loading..."}
                {!loading && <Flosses
                    flosses={flosses}
                    onChange={({ id, quantity }) => {
                        db.updateFloss(id, quantity).then(() => {
                            db.getAllFlosses().then(setFlosses);
                        });
                    }}
                />}
            </Body>
        </Page>
    );
}
