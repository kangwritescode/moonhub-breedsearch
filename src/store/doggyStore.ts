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
    selectNode: (id: string) => void,
    addDogProp: (property: string, value: string) => void
    addNode: (operator: Operator) => void
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

export const useDoggyStore = create<DoggyStore>((set, get) => ({
    // State ----------------------------------------------
    dogData: [], // Used to store the data from the API
    dogPropTags: [], // Tags generated from the dog data
    queryTree: initialQueryTree,
    // Actions --------------------------------------------
    setDogData: (dogData: Array<DogBreed>) => set({ dogData }),
    setDogPropTags: (dogPropTags: DogPropTags) => set({ dogPropTags }),
    // ----------------- tree actions--------------------
    selectNode: async (id: string) => {
        const newState = await selectNode(id, get().queryTree);
        set(newState);
    },
    addDogProp: async (property: string, value: string) => {
        const newState = await addDogProp(property, value, get().queryTree);
        set(newState);
    },
    addNode: async (operator: Operator) => {
        const newState = await addNode(operator, get().queryTree);
        set(newState);
    },
    unselectAll: () => {
        const newState = unselectAll(get().queryTree);
        set(newState);
    },
    removeDogProp: async (id: string) => {
        const newState = await removeDogProp(id, get().queryTree);
        set(newState);
    },
    removeQueryNode: async (id: string) => {
        const newState = await removeQueryNode(id, get().queryTree);
        set(newState);
    },
}));

// Functions -------------------------------------------
const findNode = (node: QueryTreeState, searchId: string): QueryTreeState | undefined => {
    if (node.id === searchId) {
        return node;
    }
    const foundChild = node.queryNodes.find(child => findNode(child, searchId) !== undefined);
    return foundChild ? findNode(foundChild, searchId) : undefined;
};

const unselectAll = (root: QueryTreeState) => {
    const newQueryTree = clone(root);
    traverseAndUnselect(newQueryTree);
    return { queryTree: newQueryTree };
};

const traverseAndUnselect = (node: QueryTreeState) => {
    const { dogProps, queryNodes } = node;
    node.selected = false;
    dogProps.forEach((dogProp) => {
        dogProp.selected = false;
    });
    queryNodes.forEach((child) => {
        traverseAndUnselect(child);
    });
};

const selectNode = async (id: string, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const node = findNode(newQueryTree, id);
    if (node) {
        node.selected = true;
    }
    return { queryTree: newQueryTree };
}

const findSelectedNode = async (node: QueryTreeState): Promise<QueryTreeState | undefined> => {
    const { selected, queryNodes } = node;
    if (selected) {
        return node;
    }
    for (const child of queryNodes) {
        const selectedChild = await findSelectedNode(child);
        if (selectedChild) {
            return selectedChild;
        }
    }
    return undefined;
};

const addDogProp = async (property: string, value: string, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const selectedNode = await findSelectedNode(newQueryTree);
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

const addNode = async (operator: Operator, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const selectedNode = await findSelectedNode(newQueryTree);
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

const removeDogProp = async (removeID: string, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const traverseAndRemove = (node: QueryTreeState) => {
        node.dogProps = node.dogProps.filter(({ id }) => id !== removeID);
        node.queryNodes.forEach(traverseAndRemove);
    };
    traverseAndRemove(newQueryTree);
    return { queryTree: newQueryTree };
};


const removeQueryNode = async (removeID: string, root: QueryTreeState) => {
    const newQueryTree = clone(root);
    const traverseAndRemove = (node: QueryTreeState) => {
        node.queryNodes = node.queryNodes.filter(({ id }) => id !== removeID);
        node.queryNodes.forEach(traverseAndRemove);
    };
    traverseAndRemove(newQueryTree);
    return { queryTree: newQueryTree };
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