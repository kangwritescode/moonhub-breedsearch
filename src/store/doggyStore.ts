import { create } from 'zustand';
import { v4 as uuid } from "uuid";
import { DogBreed, DogPropTags, Operator, QueryTreeState } from '../types';
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
export type Set = (partial: DoggyStore | Partial<DoggyStore> | ((state: DoggyStore) => DoggyStore | Partial<DoggyStore>), replace?: boolean | undefined) => void
export type Get = () => DoggyStore;

// Store -----------------------------------------------
const initialDoggyState: QueryTreeState = {
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

export const useDoggyStore = create<DoggyStore>((set, get) => ({
    // State ----------------------------------------------
    dogData: [], // Used to store the data from the API
    dogPropTags: [], // Tags generated from the dog data
    queryTree: initialDoggyState,
    // Actions --------------------------------------------
    setDogData: (dogData: Array<DogBreed>) => set({ dogData }),
    setDogPropTags: (dogPropTags: DogPropTags) => set({ dogPropTags }),
    // ----------------- tree actions--------------------
    selectDogPropOrNode: (id: string) => set(state => selectDogPropOrNode(id, state.queryTree)),
    addDogPropToNode: (property: string, value: string) => set(state => addDogPropToNode(property, value, state.queryTree)),
    addQueryNode: (operator: Operator) => set(state => addQueryNode(operator, state.queryTree)),
    unselectAll: () => unselectAll(get().queryTree, set),
    removeDogProp: (id: string) => set(state => removeDogProp(id, state.queryTree)),
    removeQueryNode: (id: string) => set(state => removeQueryNode(id, state.queryTree))
}));

// Functions -------------------------------------------
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

const unselectAll = (root: QueryTreeState, set: Set) => {
    const newQueryTree = clone(root);
    const traverseAndUnselect = (node: QueryTreeState) => {
        const { dogProps, queryNodes } = node;
        node.selected = false;
        if (dogProps && dogProps.length > 0) {
            dogProps.forEach((dogProp) => {
                dogProp.selected = false;
            });
        }
        if (queryNodes && queryNodes.length > 0) {
            queryNodes.forEach((child) => {
                traverseAndUnselect(child);
            });
        }
    }
    traverseAndUnselect(newQueryTree);
    set({ queryTree: newQueryTree });
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


const addDogPropToNode = (property: string, value: string, root: QueryTreeState) => {
    const newQueryTree = clone(root);
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
    return { queryTree: newQueryTree };

}

const addQueryNode = (operator: Operator, root: QueryTreeState) => {
    const newQueryTree = clone(root);
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
    return { queryTree: newQueryTree }
}

const removeDogProp = (removeID: string, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const traverseAndRemove = (node: QueryTreeState) => {
        const { dogProps, queryNodes } = node;
        if (dogProps && dogProps.length > 0) {
            const removedDogProp = dogProps.find(({ id }) => id === removeID);
            if (removedDogProp) {
                dogProps.splice(dogProps.indexOf(removedDogProp), 1);
            }
        }
        if (queryNodes && queryNodes.length > 0) {
            queryNodes.forEach((child) => {
                traverseAndRemove(child);
            });
        }
    }
    traverseAndRemove(newQueryTree);
    return { queryTree: newQueryTree }
}
const removeQueryNode = (removeID: string, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const traverseAndRemove = (node: QueryTreeState) => {
        const { queryNodes } = node;
        if (queryNodes && queryNodes.length > 0) {
            const removedNode = queryNodes.find(({ id }) => id === removeID);
            if (removedNode) {
                queryNodes.splice(queryNodes.indexOf(removedNode), 1);
                return
            }
            queryNodes.forEach((child) => {
                traverseAndRemove(child);
            });
        }
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
// https://stackoverflow.com/questions/29973357/how-to-change-the-indentation-of-code-from-4-spaces-to-2-spaces-in-visual-studio