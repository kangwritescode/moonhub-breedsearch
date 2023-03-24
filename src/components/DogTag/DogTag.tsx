import React from 'react'
import { colorMap } from '../PropSelector/utils';
import styles from './DogTag.module.css';
import { v4 as uuid } from 'uuid';
import classNames from 'classnames';
import { useDoggyStore } from '../../store/doggyStore';

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
    const selectDogPropOrNode = useDoggyStore(({ selectDogPropOrNode }) => selectDogPropOrNode);
    const addDogPropToNode = useDoggyStore(({ addDogPropToNode }) => addDogPropToNode);

    const onClickHandler = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation();
        return id ? selectDogPropOrNode(id) : addDogPropToNode(propName, value);
    }

    const spanBGColor = styles[colorMap[propName]];
    const spanStyles = [styles.dogProp, tagStyles, spanBGColor].join(' ');
    const extraEyesDescription = propName === 'Color of Eyes' ? ' (eyes)' : '';
    return (
        <span key={uuid()} className={classNames(className, spanStyles, {
            [styles.selected]: selected
        })} onClick={onClickHandler}>
            {value.toLowerCase() + extraEyesDescription}
        </span>
    )
}

export default DogTag