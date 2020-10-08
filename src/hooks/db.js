import { h, createContext } from "preact";
import { useContext } from "preact/hooks";

export const ContextDB = createContext("db");

export function useDatabase() {
    return useContext(ContextDB);
}
