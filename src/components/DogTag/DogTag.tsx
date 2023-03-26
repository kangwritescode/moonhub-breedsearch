import React from "react";
import { colorMap } from "../PropSelector/utils";
import styles from "./DogTag.module.css";
import { v4 as uuid } from "uuid";
import classNames from "classnames";
import { useDoggyStore } from "../../store/doggyStore";
import { Button } from "@mantine/core";

interface DogTagProps {
    className?: string;
    id?: string;
    propName: string;
    value: string;
}

function DogTag(props: DogTagProps) {
    const {
        className,
        propName,
        value,
        id, // Determines whether the component is a "tag" or a "button"
    } = props;

    // State
    const [addDogPropToNode, unselectAll, removeDogProp] = useDoggyStore(
        (state) => [state.addDogPropToNode, state.unselectAll, state.removeDogProp]
    );

    // Handlers
    const onClickHandler = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation();
        if (!id) {
            return addDogPropToNode(propName, value);
        };
        unselectAll();
        removeDogProp(id);
    }

    // Styling 
    const tagStyles = !id ? styles.tagStyles : "";
    const BGColor = styles[colorMap[propName]];
    const buttonStyles = [styles.dogProp, tagStyles, BGColor].join(" ");
    const extraEyesDescription = propName === "Color of Eyes" ? " (eyes)" : "";

    return (
        <Button
            radius="xl"
            key={uuid()}
            className={classNames(className, buttonStyles)}
            onClick={onClickHandler}
        >
            {value.toLowerCase() + extraEyesDescription}
        </Button>
    );
}

export default DogTag;
