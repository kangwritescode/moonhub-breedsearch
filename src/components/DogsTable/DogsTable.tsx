import { Button, Container, Flex, Table } from '@mantine/core';
import classNames from 'classnames';
import { ReactNode } from 'react'
import { v4 as uuid } from 'uuid';
import { DogBreed } from '../../shared/types'
import "./DogsTable.css"
import { useUIStore } from "../../store/UIStore";

interface DogsViewProps {
    data: Array<DogBreed>;
}

function DogsView({ data }: DogsViewProps) {
    // State
    const goBack = useUIStore(state => () => {
        state.setIsAnimating(false);
        state.setShowResults(false)
    });

    // Create the table body
    const tbody: Array<ReactNode> = [];
    if (data && data.length) {
        data.forEach(({ Breed }) => {
            const tr: Array<ReactNode> = [];
            tr.push(<td key={uuid()}>{Breed}</td>);
            tbody.push(<tr key={uuid()}>{tr}</tr>);
        });
    }

    return (
        <Flex
            className="dogs-table-container animate__animated animate__zoomInDown"
            p={0}
            justify="center"
            align="center"
            direction="column">
            <h1><u>Dogs.</u></h1>
            <div className='dogsTableWrapper'>
                <Table
                    className='dogsTable'
                    striped
                    highlightOnHover
                    fontSize='lg'>
                    <tbody>
                        {tbody}
                    </tbody>
                </Table>
            </div>
            <Button
                variant="light"
                color="indigo"
                radius="xl"
                mt='lg'
                onClick={() => goBack()}>
                Go Back
            </Button>
        </Flex>
    );
}

export default DogsView