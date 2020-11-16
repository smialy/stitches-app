import { h } from "preact";
import { useEffect } from "preact/hooks";

import Button from "../ui/Button";
import Icons from "../ui/Icons";

export default function PlaybookPage() {
    return (
        <div>
            <h1>Buttons</h1>
            <div>
                <h3>Defaults</h3>
                <Button>Default</Button>
                <Button color="primary">Primary</Button>
                <Button color="secondary">Secondary</Button>
                <Button disabled>Disabled</Button>
                <Button color="primary" href="/test">
                    Link
                </Button>
            </div>

            <div>
                <h3>Defaults</h3>
                <Button prefix={<Icons.Edit />}>Default</Button>
                <Button color="primary" prefix={<Icons.Edit />}>
                    Primary
                </Button>
                <Button color="secondary" prefix={<Icons.Edit />}>
                    Secondary
                </Button>
                <Button disabled prefix={<Icons.Edit />}>
                    Disabled
                </Button>
                <Button color="primary" href="/test" prefix={<Icons.Edit />}>
                    Link
                </Button>
            </div>

            <div>
                <h3>variant="outlined"</h3>
                <Button variant="outlined">Default</Button>
                <Button variant="outlined" color="primary">
                    Primary
                </Button>
                <Button variant="outlined" color="secondary">
                    Secondary
                </Button>
                <Button variant="outlined" disabled>
                    Disabled
                </Button>
                <Button variant="outlined" color="primary" href="/test">
                    Link
                </Button>
            </div>
            <div>
                <h3>variant="outlined"</h3>
                <Button variant="outlined" prefix={<Icons.Edit />}>
                    Default
                </Button>
                <Button variant="outlined" color="primary">
                    Primary
                </Button>
                <Button variant="outlined" color="secondary">
                    Secondary
                </Button>
                <Button variant="outlined" disabled>
                    Disabled
                </Button>
                <Button variant="outlined" color="primary" href="/test">
                    Link
                </Button>
            </div>

            <div>
                <h3>variant="contained"</h3>
                <Button variant="contained">Default</Button>
                <Button variant="contained" color="primary" prefix={<Icons.Edit />}>
                    Primary
                </Button>
                <Button variant="contained" color="secondary">
                    Secondary
                </Button>
                <Button variant="contained" disabled>
                    Disabled
                </Button>
                <Button variant="contained" color="primary" href="/test">
                    Link
                </Button>
            </div>
        </div>
    );
}
