import React from 'react'
import { colorMap } from '../PropSelector/utils';
import styles from './DogTag.module.css';
import { v4 as uuid } from 'uuid';
import classNames from 'classnames';
import { useDoggyStore } from '../../store/doggyStore';
import { Button } from '@mantine/core';

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
    const tagStyles = isTag ? styles.tagStyles : '';
    const [selectDogPropOrNode, addDogPropToNode] = useDoggyStore(({ selectDogPropOrNode, addDogPropToNode }) => [selectDogPropOrNode, addDogPropToNode]);

    const onClickHandler = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation();
        return id ? selectDogPropOrNode(id) : addDogPropToNode(propName, value);
    }

    const spanBGColor = styles[colorMap[propName]];
    const spanStyles = [styles.dogProp, tagStyles, spanBGColor].join(' ');
    const extraEyesDescription = propName === 'Color of Eyes' ? ' (eyes)' : '';
    return (
        <Button radius='xl' key={uuid()} className={classNames(className, spanStyles, {
            [styles.selected]: selected
        })} onClick={onClickHandler}>
            {value.toLowerCase() + extraEyesDescription}
        </Button>
    )
}

export default DogTag