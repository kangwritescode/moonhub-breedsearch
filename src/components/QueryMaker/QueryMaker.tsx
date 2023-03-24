import React from 'react'
import { DogPropTags } from '../../types'
import PropSelector from '../PropSelector/PropSelector';
import searchSVG from './search.svg';

import styles from './QueryMaker.module.css'
import { Button, Flex, TextInput } from '@mantine/core';

interface QueryMakerProps {
    dogTags: DogPropTags;
}

function QueryMaker({ dogTags }: QueryMakerProps) {

    const [inputValue, setInputValue] = React.useState<string>('')
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        inputRef.current?.focus();
    }, [])

    return (
        <Flex 
        justify="center"
        align="left"
        direction="column"
        wrap="wrap">
            <div className={styles.inputButtonContainer}>
                <TextInput
                    className={styles.input}
                    placeholder="Type 'AND' or 'OR' or 'friendly"
                    radius="xl"
                    size="xl"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value.toLowerCase())}
                    ref={inputRef}
                />
                <Button className={styles.button} variant="white" radius="xl" size="xl" tabIndex={-1}>
                    <img className={styles.img} src={searchSVG} />
                </Button>
            </div>
            <PropSelector tags={dogTags} inputValue={inputValue} />
        </Flex>
    )
}

export default QueryMaker