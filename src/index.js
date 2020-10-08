import { h, render } from "preact";
import Router, { Link } from "preact-router";

import "./reset.css";
import "./ui.scss";
import "./main.scss";

import NavBar from "./ui/NavBar";
import Nav from "./ui/Nav";
// import SideBar from "./components/ui/SideBar";
import ProjectsPage from "./pages/project/Projects";
import ProjectPage from "./pages/project/Project";
import ToolsPage from "./pages/tools/Tools";
import FlossesPage from "./pages/Flosses";

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
                    <Nav.Link url="/flosses">Flosses</Nav.Link>
                    <Nav.Link url="/tools">Tools</Nav.Link>
                </Nav>
            </div>
            <div id="main">
                <Router>
                    <ProjectsPage path="/projects" projects={[]} />
                    <ProjectPage path="/project/:sid" projects={[]} />
                    <FlossesPage path="/flosses" />
                    <ToolsPage path="/tools" />
                </Router>
            </div>
        </ContextDB.Provider>
    );
}

render(<App />, document.querySelector("#app"));
