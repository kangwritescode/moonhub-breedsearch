export interface QueryTree {
    id: number;
    operator: Operator;
    operands: {
        DogProp?: Array<DogProp>;
        expressions?: QueryTree[];
    };
}

export type Operator = "and" | "or";

export type DogProp = {
    id: number;
    property: string;
    value: string;
};



