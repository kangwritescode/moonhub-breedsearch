import { Button } from '@mantine/core';
import React from 'react'
import { useDoggyStore } from '../../store/doggyStore';
import { Operator } from '../../types';
import styles from './OperatorTag.module.css';

interface OperatorTagProps {
    value: Operator;
}

function OperatorTag({ value }: OperatorTagProps) {
    const addQueryNode = useDoggyStore(({ addQueryNode }) => addQueryNode)
    return (
        <Button
            className={styles.operatorTag}
            radius="xl"
            onClick={() => addQueryNode(value)}
        >
            {value}
        </Button>
    )
}

export default OperatorTag