import { Button } from '@mantine/core';
import { useDoggyStore } from '../../store/doggyStore';
import { Operator } from '../../shared/types';
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