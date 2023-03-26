export interface QueryTreeState {
    id: string;
    selected: boolean;
    operator: Operator;
    dogProps: Array<DogProp>;
    queryNodes: QueryTreeState[];
    isRoot?: boolean;
}

export type Operator = "AND" | "OR";

export type DogProp = {
    id: string;
    selected: boolean;
    property: string;
    value: string;
};

export type Dog = {
    [key: string]: string;
}

export type Store = {
    queryTree: QueryTreeState,
    dogData: Array<Dog>
    filteredDogs: Array<Dog>
}

export type DogPropTags = Array<DogPropTag>

export type DogPropTag = Array<string>;

export type DogBreed = {
    Breed: string;
    CharacterTraits: string;
    ColorOfEyes: string;
    CommonHealthProblems: string;
    CountryOfOrigin: string;
    FurColor: string;
};

export type Tag = Array<string>
export type Tags = Array<Tag>

export type ColorMap = {
    [key: string]: string;
}

