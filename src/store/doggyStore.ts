import { create } from 'zustand';
import { v4 as uuid } from "uuid";
import { DogBreed, DogPropTags, Operator, QueryTreeState } from '../shared/types';
import clone from 'clone';

// Types ------------------------------------------------
export interface DoggyStore {
    // State
    queryTree: QueryTreeState,
    dogData: Array<DogBreed>,
    dogPropTags: DogPropTags,
    // Actions
    setDogData: (dogData: Array<DogBreed>) => void,
    setDogPropTags: (dogPropTags: DogPropTags) => void,
    selectDogPropOrNode: (id: string) => void,
    addDogPropToNode: (property: string, value: string) => void
    addQueryNode: (operator: Operator) => void
    unselectAll: () => void
    removeDogProp: (id: string) => void
    removeQueryNode: (id: string) => void
}
// Store -----------------------------------------------
const initialQueryTree: QueryTreeState = {
    id: uuid(),
    selected: false,
    operator: 'AND',
    isRoot: true,
    dogProps: [{
        id: uuid(),
        selected: false,
        property: 'Character Traits',
        value: 'Friendly'
    },
    {
        id: uuid(),
        selected: false,
        property: 'Character Traits',
        value: 'Loyal'
    }],
    queryNodes: [{
        id: uuid(),
        selected: false,
        operator: 'OR',
        dogProps: [{
            id: uuid(),
            selected: false,
            property: 'Color of Eyes',
            value: 'Brown'
        }, {
            id: uuid(),
            selected: false,
            property: 'Country of Origin',
            value: 'China'
        }],
        queryNodes: []
    }]
}

export const useDoggyStore = create<DoggyStore>((set) => ({
    // State ----------------------------------------------
    dogData: [], // Used to store the data from the API
    dogPropTags: [], // Tags generated from the dog data
    queryTree: initialQueryTree,
    // Actions --------------------------------------------
    setDogData: (dogData: Array<DogBreed>) => set({ dogData }),
    setDogPropTags: (dogPropTags: DogPropTags) => set({ dogPropTags }),
    // ----------------- tree actions--------------------
    selectDogPropOrNode: (id: string) => set(state => selectDogPropOrNode(id, state.queryTree)),
    addDogPropToNode: (property: string, value: string) => set(state => addDogPropToNode(property, value, state.queryTree)),
    addQueryNode: (operator: Operator) => set(state => addQueryNode(operator, state.queryTree)),
    unselectAll: () => set(state => unselectAll(state.queryTree)),
    removeDogProp: (id: string) => set(state => removeDogProp(id, state.queryTree)),
    removeQueryNode: (id: string) => set(state => removeQueryNode(id, state.queryTree)),
}));

// Functions -------------------------------------------
const findDogPropOrNode = (node: QueryTreeState, searchId: string): QueryTreeState | undefined => {
    const { id, dogProps, queryNodes } = node;
    if (id === searchId) {
        return node;
    }
    dogProps.forEach((dogProp) => {
        if (dogProp.id === searchId) {
            return dogProp
        }
    });
    let foundNode: QueryTreeState | undefined;
    queryNodes.forEach((child) => {
        foundNode = foundNode || findDogPropOrNode(child, searchId);
    });
    return foundNode;
}

const unselectAll = (root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const traverseAndUnselect = (node: QueryTreeState) => {
        const { dogProps, queryNodes } = node;
        node.selected = false;
        dogProps.forEach((dogProp) => {
            dogProp.selected = false;
        });
        queryNodes.forEach((child) => {
            traverseAndUnselect(child);
        });
    }
    traverseAndUnselect(newQueryTree);
    return { queryTree: newQueryTree }
}

const selectDogPropOrNode = (id: string, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const node = findDogPropOrNode(newQueryTree, id);
    if (node) {
        node.selected = true;
    }
    return { queryTree: newQueryTree };
}

const findSelectedNode = (node: QueryTreeState): QueryTreeState | undefined => {
    const { selected, queryNodes } = node;
    if (selected) {
        return node;
    }
    let selectedNode: QueryTreeState | undefined;
    queryNodes.forEach((child) => {
        selectedNode = selectedNode || findSelectedNode(child);
    });
    return selectedNode;
}

const addDogPropToNode = (property: string, value: string, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const selectedNode = findSelectedNode(newQueryTree);
    if (selectedNode) {
        selectedNode.dogProps.push({
            id: uuid(),
            selected: false,
            property,
            value
        });
        selectedNode.selected = false;
    }
    return { queryTree: newQueryTree };

}

const addQueryNode = (operator: Operator, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const selectedNode = findSelectedNode(newQueryTree);
    if (selectedNode) {
        selectedNode.queryNodes.push({
            id: uuid(),
            selected: false,
            operator: operator,
            dogProps: [],
            queryNodes: []
        });
        selectedNode.selected = false;
    }
    return { queryTree: newQueryTree }
}

const removeDogProp = (removeID: string, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const traverseAndRemove = (node: QueryTreeState) => {
        const { dogProps, queryNodes } = node;
        const removedDogProp = dogProps.find(({ id }) => id === removeID);
        if (removedDogProp) {
            dogProps.splice(dogProps.indexOf(removedDogProp), 1);
        }
        queryNodes.forEach((child) => {
            traverseAndRemove(child);
        });
    }
    traverseAndRemove(newQueryTree);
    return { queryTree: newQueryTree }
}
const removeQueryNode = (removeID: string, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const traverseAndRemove = (node: QueryTreeState) => {
        const { queryNodes } = node;
        const removedNode = queryNodes.find(({ id }) => id === removeID);
        if (removedNode) {
            queryNodes.splice(queryNodes.indexOf(removedNode), 1);
            return
        }
        queryNodes.forEach((child) => {
            traverseAndRemove(child);
        });
    }
    traverseAndRemove(newQueryTree);
    return { queryTree: newQueryTree }
}

// Debugging -------------------------------------------
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