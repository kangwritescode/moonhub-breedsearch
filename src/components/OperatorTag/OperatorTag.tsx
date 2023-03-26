import { Button } from '@mantine/core';
import { useDoggyStore } from '../../store/doggyStore';
import { Operator } from '../../shared/types';
import styles from './OperatorTag.module.css';

interface OperatorTagProps {
    value: Operator;
}

function OperatorTag({ value }: OperatorTagProps) {
    const addNode = useDoggyStore(({ addNode }) => addNode)
    return (
        <Button
            className={styles.operatorTag}
            radius="xl"
            onClick={() => addNode(value)}>
            {value}
        </Button>
    )
}

export default OperatorTag