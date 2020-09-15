import { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';

export const DB = createContext('db');

export function useDatabase() {
    return useContext(DB);
}