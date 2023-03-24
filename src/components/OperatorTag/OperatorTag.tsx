import React from 'react'
import { useDoggyStore } from '../../store/doggyStore';
import { Operator } from '../../types';
import styles from './OperatorTag.module.css';

interface OperatorTagProps {
    value: Operator;
}

function OperatorTag({ value }: OperatorTagProps) {
    const addQueryNode = useDoggyStore(({addQueryNode}) => addQueryNode)
    return (
        <span className={styles.operatorTag} onClick={() => addQueryNode(value)}>{value}</span>
    )
}

export default OperatorTag