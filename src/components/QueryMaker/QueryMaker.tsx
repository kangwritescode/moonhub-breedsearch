import React from 'react'
import { DogPropTags } from '../../types'
import PropSelector from '../PropSelector/PropSelector';
import searchSVG from './search.svg';

import styles from './QueryMaker.module.css'

interface QueryMakerProps {
    dogTags: DogPropTags;
}

function QueryMaker({ dogTags }: QueryMakerProps) {

    const [inputValue, setInputValue] = React.useState<string>('')

    return (
        <div>
            <div className={styles.inputButtonContainer}>
                <input className={styles.input} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value.toLowerCase())} />
                <button className={styles.button}>
                    <img className={styles.img} src={searchSVG} />
                </button>
            </div>
            <PropSelector tags={dogTags} inputValue={inputValue} />
        </div>
    )
}

export default QueryMaker