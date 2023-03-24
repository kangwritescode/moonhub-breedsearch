import React, { useEffect } from 'react'
import { DogPropTags, Tags } from '../../types'
import styles from './PropSelector.module.css'
import { v4 as uuid } from 'uuid';
import { colorMap } from './utils';
import DogTag from '../DogTag/DogTag';

interface PropSelectorProps {
    tags: Tags;
    inputValue: string;
}

function PropSelector(props: PropSelectorProps) {
    const { tags, inputValue } = props;
    
    const [filteredTags, setFilteredTags] = React.useState<Tags>(tags)

    // Filter tags based on input value
    useEffect(() => {
        if (inputValue === '') {
            return setFilteredTags([]);
        }
        const getMatchingTags = (inputS: string, tags: Tags) => {
            const matchesArray: Tags = [];
            tags.forEach(([key, value]) => value.toLowerCase().startsWith(inputS) ? matchesArray.push([key, value]) : null);
            return matchesArray;
        }
        const matchingTags = getMatchingTags(inputValue, tags);
        setFilteredTags(matchingTags);
    }, [inputValue])

    return (
        <div className={styles.dogPropsContainer}>
            {filteredTags.map(([key, value]) => <DogTag key={uuid()} propName={key} value={value} />)}
        </div>
    )
}

export default PropSelector