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
    selected?: boolean;
    propName: string;
    value: string;
}

function DogTag(props: DogTagProps) {
    const { className, propName, value, id, selected } = props;
    const isTag = !id;
    const tagStyles = isTag ? styles.tagStyles : "";
    const [addDogPropToNode, unselectAll, removeDogProp] =
        useDoggyStore(
            ({
                addDogPropToNode,
                unselectAll,
                removeDogProp,
            }) => [addDogPropToNode, unselectAll, removeDogProp]
        );

    const onClickHandler = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation();
        if (isTag) {
            return addDogPropToNode(propName, value);
        };
        unselectAll();
        removeDogProp(id);
    }

    const spanBGColor = styles[colorMap[propName]];
    const spanStyles = [styles.dogProp, tagStyles, spanBGColor].join(" ");
    const extraEyesDescription = propName === "Color of Eyes" ? " (eyes)" : "";
    return (
        <Button
            radius="xl"
            key={uuid()}
            className={classNames(className, spanStyles, {
                [styles.selected]: selected,
            })}
            onClick={onClickHandler}
        >
            {value.toLowerCase() + extraEyesDescription}
        </Button>
    );
}

export default DogTag;
