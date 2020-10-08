import { h } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";
import { Link, route } from "preact-router";

import { useDatabase } from "../../hooks/db";
import { ProjectFlosses } from "./ProjectFlosses";

const initState = {
    project: {},
    loading: true,
    error: "",
};

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case "init": {
            const { project } = payload;
            return { ...state, project, loading: false };
        }
        case "loaded": {
            const { project } = payload;
            return { ...state, ...project };
        }
        case "add": {
        }
        case "error":
            return { ...state, loading: false, error: payload };
        default:
            throw new Error(`Unexpected action: ${action.type}`);
    }
};

export default function ProjectPage({ matches: { sid } }) {
    const [{ project, loading, error }, dispatch] = useReducer(reducer, initState);
    const db = useDatabase();
    useEffect(() => {
        db.getProject(parseInt(sid, 10))
            .then((project) => {
                if (project) {
                    dispatch({ type: "init", payload: { project } });
                } else {
                    dispatch({ type: "error", payload: `Not found project: ${sid}` });
                }
            })
            .catch((e) => {
                route("/projects");
            });
    }, []);
    if (loading) {
        return "Loading...";
    }
    if (error) {
        return error;
    }
    return (
        <div class="project-page">
            <h1>Project: {project.name}</h1>
            <ProjectFlosses project={project} />
        </div>
    );

    return (
        <div class="projects">
            {projects.map((project) => (
                <Project project={project} onRemove={onRemove} />
            ))}
        </div>
    );
}
