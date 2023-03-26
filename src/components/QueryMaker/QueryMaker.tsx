import { useState, useEffect, useRef } from 'react'
import { DogPropTags } from '../../shared/types'
import PropSelector from '../PropSelector/PropSelector';
import searchSVG from './search.svg';

import styles from './QueryMaker.module.css'
import { Button, createStyles, Flex, TextInput } from '@mantine/core';
import { useUIStore } from '../../store/UIStore';

interface QueryMakerProps {
    dogTags: DogPropTags;
    className?: string;
}

function QueryMaker({ dogTags, className }: QueryMakerProps) {
    // State
    const startAnimation = useUIStore(state => () => state.setIsAnimating(true))
    const [inputValue, setInputValue] = useState<string>('')

    const inputRef = useRef<HTMLInputElement>(null);
    
    // Autofocus on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    return (
        <Flex
            className={className}
            justify="center"
            align="left"
            direction="column"
            wrap="wrap">
            <div className={styles.inputButtonContainer}>
                <TextInput
                    className={styles.input}
                    placeholder="Type 'AND' or 'OR' or 'friendly'"
                    radius="xl"
                    size="xl"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value.toLowerCase())}
                    ref={inputRef}
                />
                <Button
                    className={styles.button}
                    variant="white"
                    radius="xl"
                    size="xl"
                    tabIndex={-1}
                    onClick={() => startAnimation()}>
                    <img className={styles.img} src={searchSVG} />
                </Button>
            </div>
            <PropSelector tags={dogTags} inputValue={inputValue} />
        </Flex>
    )
}

export default QueryMaker