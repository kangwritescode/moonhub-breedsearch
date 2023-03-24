import { create } from 'zustand';
import { v4 as uuid } from "uuid";
import { DogBreed, DogPropTags, QueryTreeState } from '../types';
import clone from 'clone';

// Types 
export interface DoggyStore {
    queryTree: QueryTreeState,
    dogData: Array<DogBreed>,
    dogPropTags: DogPropTags,
    setQueryTree: (queryTree: QueryTreeState) => void, //(queryTree: QueryTreeState) => set({ queryTree })
    setDogData: (dogData: Array<DogBreed>) => void,
    setDogPropTags: (dogPropTags: DogPropTags) => void,
    selectNodeOrTree: (id: string) => void,
}

export type Set = (partial: DoggyStore | Partial<DoggyStore> | ((state: DoggyStore) => DoggyStore | Partial<DoggyStore>), replace?: boolean | undefined) => void
export type Get = () => DoggyStore;

const initialDoggyState: QueryTreeState = {
    id: uuid(),
    selected: false,
    operator: 'AND',
    dogProps: [{
        id: uuid(),
        selected: false,
        property: 'Country of Origin',
        value: 'China'
    }, {
        id: uuid(),
        selected: false,
        property: 'Country of Origin',
        value: 'United States'
    }],
    queryNodes: [{
        id: uuid(),
        selected: false,
        operator: 'AND',
        dogProps: [{
            id: uuid(),
            selected: false,
            property: 'Country of Origin',
            value: 'England'
        }],
        queryNodes: []
    }]
}

// Store
export const useDoggyStore = create<DoggyStore>((set, get) => ({
    queryTree: initialDoggyState,
    dogData: [],
    dogPropTags: [],
    setQueryTree: (queryTree: QueryTreeState) => set({ queryTree }),
    setDogData: (dogData: Array<DogBreed>) => set({ dogData }),
    setDogPropTags: (dogPropTags: DogPropTags) => set({ dogPropTags }),
    selectNodeOrTree: (id: string) => selectNodeOrTree(id, set, get)
}));

// Actions and Helper Functions
const findNode = (node: QueryTreeState, searchId: string): QueryTreeState | undefined => {
    const { id, dogProps, queryNodes } = node;
    if (id === searchId) {
        return node;
    }
    if (dogProps && dogProps.length > 0) {
        let foundDogProp;
        dogProps.forEach((dogProp) => {
            if (dogProp.id === searchId) {
                foundDogProp = dogProp;
            }
        });
        if (foundDogProp) {
            return foundDogProp;
        }
    }
    if (queryNodes && queryNodes.length > 0) {
        let node;
        queryNodes.forEach((child) => {
            node = findNode(child, searchId);
        });
        if (node) {
            return node;
        }
    }
}

const unselectAllNodes = (node: QueryTreeState) => {
    const { dogProps, queryNodes } = node;
    node.selected = false;
    if (dogProps && dogProps.length > 0) {
        dogProps.forEach((dogProp) => {
            dogProp.selected = false;
        });
    }
    if (queryNodes && queryNodes.length > 0) {
        queryNodes.forEach((child) => {
            unselectAllNodes(child);
        });
    }
}

const selectNodeOrTree = (id: string, set: Set, get: Get) => {
    const { queryTree } = get();
    const newQueryTree = clone(queryTree);
    unselectAllNodes(newQueryTree);

    const node = findNode(newQueryTree, id);
    if (node) {
        node.selected = true;
    }
    set({ queryTree: newQueryTree });
}

