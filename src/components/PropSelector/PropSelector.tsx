import React, { useEffect } from 'react'
import { Operator, Tags } from '../../shared/types'
import styles from './PropSelector.module.css'
import { v4 as uuid } from 'uuid';
import DogTag from '../DogTag/DogTag';
import BooleanTag from '../OperatorTag/OperatorTag';

interface PropSelectorProps {
    tags: Tags;
    inputValue: string;
}

function PropSelector(props: PropSelectorProps) {
    const { tags, inputValue } = props;
    // State
    const [filteredTags, setFilteredTags] = React.useState<Tags>([])
    const [filteredBooleanTags, setFilteredBooleanTags] = React.useState<Operator[]>([])

    // Filter tags on input change
    useEffect(() => {
        // Clear input when no value
        if (inputValue === '') {
            setFilteredTags([]);
            setFilteredBooleanTags([]);
            return;
        }
        // Filter DogProp 
        const getMatchingTags = (inputS: string, tags: Tags) => {
            const matchesArray: Tags = [];
            tags.forEach(([key, value]) => value.toLowerCase().startsWith(inputS) ? matchesArray.push([key, value]) : null);
            return matchesArray;
        }
        const matchingTags = getMatchingTags(inputValue, tags);
        setFilteredTags(matchingTags);

        // Filter Boolean Tags
        const operators: Array<Operator> = ['AND', 'OR'];
        const matchingBooleanTags: Array<Operator> = operators.filter((value: Operator) => value.toLowerCase().startsWith(inputValue));
        setFilteredBooleanTags(matchingBooleanTags);
    }, [inputValue])

    return (
        <div className={styles.dogPropsContainer}>
            {filteredBooleanTags.map((value) => <BooleanTag key={uuid()} value={value} />)}
            {filteredTags.map(([key, value]) => <DogTag key={uuid()} propName={key} value={value} />)}
        </div>
    )
}

export default PropSelector