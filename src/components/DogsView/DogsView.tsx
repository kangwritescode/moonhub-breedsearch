import React, { ReactNode } from 'react'
import { DogBreed } from '../../types'

interface DogsViewProps {
    data: Array<DogBreed>;
}

function DogsView({ data }: DogsViewProps) {
    console.log(data)
    const thead: Array<ReactNode> = [];
    const tbody: Array<ReactNode> = [];

    // Create the table header
    if (data && data.length) {
        Object.keys(data[0]).forEach((key, index) => {
            thead.push(<th key={index}>{key}</th>);
        });
    }
    // Create the table body
    if (data && data.length) {
        data.forEach((row, index) => {
            const tr: Array<ReactNode> = [];
            Object.values(row).forEach((value) => {
                tr.push(<td key={index}>{value}</td>);
            });
            tbody.push(<tr key={index}>{tr}</tr>);
        });
    }

    return (
        <table>
            <thead>
                <tr>
                    {thead}
                </tr>
            </thead>
            <tbody>{tbody}</tbody>
        </table>
    );
}

export default DogsView