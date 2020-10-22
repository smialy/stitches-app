import { h } from "preact";
import { useState } from "preact/hooks";
import { useDatabase } from "../../hooks/db";
import dmc from "../../resources/dmc.csv";

export default function Database() {
    const { db } = useDatabase();
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState();

    const resetDatabase = () => {
        if (!confirm("All data will be removed. Are you sure?")) {
            return;
        }
        setLoading(true);
        (async function () {
            const clean = txt => txt.replace(/^"|"$/g, "");
            const data = await fetch(dmc).then(res => res.text());
            const flosses = data
                .split("\n")
                .map(line => line.split(","))
                .map(row => ({
                    sid: `DMC:${row[0]}`,
                    type: "DMC",
                    identifier: row[0],
                    name: clean(row[1]),
                    color: clean(row[2]),
                    quantity: 1,
                }));
            await db.floss.clear();
            await db.project.clear();
            await db.floss.bulkAdd(flosses);
            setLoading(false);
        })();
    };
    const exportDatabase = () => {
        (async function () {
            const flosses = await db.floss.toArray();
            const projects = await db.project.toArray();
            const payload = JSON.stringify({ flosses, projects }, null, 2);
            const data = new Blob([payload], { type: "application/json" });
            const url = URL.createObjectURL(data);
            setDownloadUrl(url);
        })();
    };
    const uploadDump = e => {
        const input = e.target;
        const reader = new FileReader();
        reader.addEventListener("load", e => {
            try {
                insertData(JSON.parse(reader.result));
            } catch (e) {
                alert(e);
            }
        });
        reader.readAsText(input.files[0]);
    };
    const insertData = async ({ flosses, projects }) => {
        await db.floss.clear();
        await db.project.clear();
        await db.floss.bulkAdd(flosses);
        await db.project.bulkAdd(projects);
    };

    return (
        <div>
            {!loading && (
                <span>
                    Reset database
                    <button onClick={resetDatabase}>Run</button>
                </span>
            )}
            {loading && <span>Loading...</span>}
            <div>
                Export database:
                <button onClick={exportDatabase}>Export</button>
                {downloadUrl && (
                    <a target="_blank" href={downloadUrl}>
                        Download
                    </a>
                )}
            </div>
            <div>
                Import database:
                <input type="file" onChange={uploadDump} />
            </div>
        </div>
    );
}
