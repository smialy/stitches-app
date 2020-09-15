import { h, render } from 'preact';
import Router from 'preact-router';

import './reset.css';
import './ui.scss';
import './main.scss';

import NavBar from './components/ui/NavBar';
import Nav from './components/ui/Nav';
import SideBar from './components/ui/SideBar';
import ProjectsPage from './components/projects/Projects'
import ProjectPage from './components/projects/Project';
import ToolsPage from './components/tools/Tools';
import FlossesPage from './components/flosses/Flosses';

import { createDatabase } from './models';
import { DB } from './db';

const db = createDatabase();

function App () {
    return (
        <DB.Provider value={db}>
        <div class="app">
            <NavBar>
                <NavBar.Brand>
                    Stiches
                </NavBar.Brand>
            </NavBar>
            <div class="container">
                <SideBar>
                    <Nav>
                        <Nav.Link url="/projects">Projects</Nav.Link>
                        <Nav.Link url="/flosses">Flosses</Nav.Link>
                        <Nav.Link url="/tools">Tools</Nav.Link>

                    </Nav>
                </SideBar>
                <main>
                <Router>
                    <ProjectsPage path="/projects" projects={[]} />
                    <ProjectPage path="/project/:sid" projects={[]} />
                    <FlossesPage path="/flosses" />
                    <ToolsPage path="/tools" />
                </Router>
                </main>
            </div>
        </div>
        </DB.Provider>
    );
};

render(<App />, document.body);
