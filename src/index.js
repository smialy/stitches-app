import { h, render } from "preact";
import Router, { Link } from "preact-router";

import "./resources/styles/reset.css";
import "./resources/styles/vars.scss";
import "./resources/styles/ui.scss";
import "./resources/styles/main.scss";
import "./resources/styles/orders.scss";

import NavBar from "./ui/NavBar";
import Nav from "./ui/Nav";
import ProjectsPage from "./pages/project/Projects";
import ProjectPage from "./pages/project/Project";
import ToolsPage from "./pages/tools/Tools";
import FlossesPage from "./pages/Flosses";
import OrdersPage from "./pages/order/Orders";
import OrderPage from "./pages/order/Order";

import PlaybookPage from './pages/Playbook';

import { createDatabase } from "./models";
import { ContextDB } from "./hooks/db";


// import Breadcrumbs from "./components/ui/Breadcrumbs";

function App() {
    return (
        <ContextDB.Provider value={createDatabase()}>
            <div id="appbar">
                <NavBar>
                    <NavBar.Brand>Stiches</NavBar.Brand>
                </NavBar>
            </div>
            <div id="sidebar">
                <Nav>
                    <Nav.Link url="/projects">Projects</Nav.Link>
                    <Nav.Link url="/orders">Orders</Nav.Link>
                    <Nav.Link url="/flosses">Flosses</Nav.Link>
                    <Nav.Link url="/tools">Tools</Nav.Link>
                </Nav>
            </div>
            <div id="main">
                <Router>
                    <ProjectsPage path="/projects" projects={[]} />
                    <ProjectPage path="/project/:sid" projects={[]} />
                    <OrdersPage path="/orders" />
                    <OrderPage path="/order/:sid" />
                    <FlossesPage path="/flosses" />

                    <ToolsPage path="/tools" />
                    <PlaybookPage path="/playbook" />
                </Router>
            </div>
        </ContextDB.Provider>
    );
}

render(<App />, document.querySelector("#app"));
