import React, { ReactNode } from 'react'
import { v4 as uuid } from 'uuid';
import { DogBreed } from '../../types'
import styles from './DogsView.module.css'

interface DogsViewProps {
    data: Array<DogBreed>;
}

function DogsView({ data }: DogsViewProps) {

    const thead: Array<ReactNode> = [];
    const tbody: Array<ReactNode> = [];

    // Create the table header
    if (data && data.length) {
        Object.keys(data[0]).forEach((key) => {
            thead.push(<th key={uuid()}>{key}</th>);
        });
    }
    // Create the table body
    if (data && data.length) {
        data.forEach((row) => {
            const tr: Array<ReactNode> = [];
            Object.values(row).forEach((value) => {
                tr.push(<td key={uuid()}>{value}</td>);
            });
            tbody.push(<tr key={uuid()}>{tr}</tr>);
        });
    }
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {thead}
                    </tr>
                </thead>
                <tbody>{tbody}</tbody>
            </table>
        </div>
    );
}

export default DogsView