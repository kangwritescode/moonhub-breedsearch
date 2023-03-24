import { create } from 'zustand';
import { v4 as uuid } from "uuid";
import { DogBreed, DogPropTags, Operator, QueryTreeState } from '../types';
import clone from 'clone';

// Types 
export interface DoggyStore {
    queryTree: QueryTreeState,
    dogData: Array<DogBreed>,
    dogPropTags: DogPropTags,
    setQueryTree: (queryTree: QueryTreeState) => void, //(queryTree: QueryTreeState) => set({ queryTree })
    setDogData: (dogData: Array<DogBreed>) => void,
    setDogPropTags: (dogPropTags: DogPropTags) => void,
    selectDogPropOrNode: (id: string) => void,
    addDogPropToNode: (property: string, value: string) => void
    addQueryNode: (operator: Operator) => void
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
    selectDogPropOrNode: (id: string) => selectDogPropOrNode(id, set, get),
    addDogPropToNode: (property: string, value: string) => addDogPropToNode(property, value, set, get),
    addQueryNode: (operator: Operator) => addQueryNode(operator, set, get)
}));

// Actions and Helper Functions
const findDogPropOrNode = (node: QueryTreeState, searchId: string): QueryTreeState | undefined => {
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
        let node: QueryTreeState | undefined;
        queryNodes.forEach((child) => {
            node = node || findDogPropOrNode(child, searchId);
        });
        if (node) {
            return node;
        }
    }
}

const unselectAll = (node: QueryTreeState) => {
    const { dogProps, queryNodes } = node;
    node.selected = false;
    if (dogProps && dogProps.length > 0) {
        dogProps.forEach((dogProp) => {
            dogProp.selected = false;
        });
    }
    if (queryNodes && queryNodes.length > 0) {
        queryNodes.forEach((child) => {
            unselectAll(child);
        });
    }
}

const selectDogPropOrNode = (id: string, set: Set, get: Get) => {
    const { queryTree } = get();
    const newQueryTree = clone(queryTree);
    unselectAll(newQueryTree);
    
    const node = findDogPropOrNode(newQueryTree, id);
    if (node) {
        node.selected = true;
    }
    set({ queryTree: newQueryTree });
}

const findSelectedNode = (node: QueryTreeState): QueryTreeState | undefined => {
    const { selected, queryNodes } = node;
    if (selected) {
        return node;
    }
    if (queryNodes && queryNodes.length > 0) {
        let node;
        queryNodes.forEach((child) => {
            node = findSelectedNode(child);
        });
        if (node) {
            return node;
        }
    }
}


const addDogPropToNode = (property: string, value: string, set: Set, get: Get) => {
    const { queryTree } = get();
    const newQueryTree = clone(queryTree);
    const selectedNode = findSelectedNode(newQueryTree);
    if (selectedNode) {
        if (selectedNode.dogProps) {
            selectedNode.dogProps.push({
                id: uuid(),
                selected: false,
                property,
                value
            });
            selectedNode.selected = false;
        }
    }
    set({ queryTree: newQueryTree });

}

const addQueryNode = (operator: Operator, set: Set, get: Get) => {
    const { queryTree } = get();
    const newQueryTree = clone(queryTree);
    const selectedNode = findSelectedNode(newQueryTree);
    if (selectedNode) {
        if (selectedNode.queryNodes) {
            selectedNode.queryNodes.push({
                id: uuid(),
                selected: false,
                operator: operator,
                dogProps: [],
                queryNodes: []
            });
            selectedNode.selected = false;
        }
    }
    set({ queryTree: newQueryTree });
}

// Debugging **********
const prettyPrintTree = (node: QueryTreeState, indent: number) => {
    const { id, operator, dogProps, queryNodes } = node;
    console.log(`${'    '.repeat(indent)}${id} ${operator}`);
    if (dogProps && dogProps.length > 0) {
        dogProps.forEach((dogProp) => {
            console.log(`${'    '.repeat(indent + 2)}${dogProp.id} ${dogProp.property} ${dogProp.value}`);
        });
    }
    if (queryNodes && queryNodes.length > 0) {
        queryNodes.forEach((child) => {
            prettyPrintTree(child, indent + 2);
        });
    }
}
