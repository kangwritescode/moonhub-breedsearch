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
    const selectNodeOrTree = useDoggyStore(({ selectNodeOrTree }) => selectNodeOrTree);

    const onClickDogNode = () => {
        if (id) {
            selectNodeOrTree(id);
        }
    }

    const spanBGColor = styles[colorMap[propName]];
    const spanStyles = [styles.dogProp, spanBGColor].join(' ');
    const extraEyesDescription = propName === 'Color of Eyes' ? ' (eyes)' : '';
    return (
        <span key={uuid()} className={classNames(className, spanStyles, {
            [styles.selected]: selected
        })} onClick={onClickDogNode}>
            {value.toLowerCase() + extraEyesDescription}
        </span>
    )
}

export default DogTag