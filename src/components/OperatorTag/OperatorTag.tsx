import React from 'react'
import styles from './OperatorTag.module.css';

interface OperatorTagProps {
    value: string;
}

function OperatorTag({ value }: OperatorTagProps){
  return (
    <span className={styles.operatorTag}>{value}</span>
  )
}

export default OperatorTag