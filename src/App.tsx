import { useEffect } from 'react'
import csvtojson from 'csvtojson';
import { Flex } from '@mantine/core';
import classNames from 'classnames';
import 'animate.css';

import { DogPropTags } from './shared/types';
import { DoggyStore, useDoggyStore } from './store/doggyStore';
import { useUIStore } from './store/UIStore';
import './App.css'
import paw from './assets/paw.svg'
import { csvData } from './assets/dogdata'

import QueryMaker from './components/QueryMaker/QueryMaker'
import QueryTree from './components/QueryTree/QueryTree';
import DogsTable from './components/DogsTable/DogsTable';
import DogWidget from './components/DogWidget/DogWidget';

function App() {
    // Local UI State
    const showResults = useUIStore(state => state.showResults)
    const isAnimating = useUIStore(state => state.isAnimating)
    // Doggy Store
    const { dogData, queryTree, dogPropTags }: DoggyStore = useDoggyStore()
    const { setDogData, setDogPropTags, }: DoggyStore = useDoggyStore()

    // Fetch and set dogData from csv file
    useEffect(() => {
        async function fetchData() {
            const jsonData = await csvtojson().fromString(csvData);
            setDogData(jsonData);
        }
        fetchData();
    }, []);

    // Generate and set dogPropTags from dogData
    useEffect(() => {
        if (dogData.length) {
            const tags: DogPropTags = []
            const seenDogProps = new Set(); // Cache to avoid duplicates
            // For each row
            dogData.forEach((dog) => {
                // For each dog property
                Object.entries(dog).forEach(([key, value]) => {
                    if (key !== 'Breed') {
                        // Handle strings with multiple values
                        const trimmedValues = value.split(',').map(s => s.trim());
                        for (let trimmedValue of trimmedValues) {
                            if (!seenDogProps.has(trimmedValue.toLowerCase())) {
                                seenDogProps.add(trimmedValue.toLowerCase())
                                tags.push([key, trimmedValue]);
                            }
                        }
                    }
                })
            })
            setDogPropTags(tags);
        }
    }, [dogData])

    return (
        <Flex
            className="App"
            justify="center"
            align="center"
            direction="column">
            <img className='paw' src={paw} />
            <DogWidget />
            {!showResults && (
                <Flex
                    mih={"100vh"}
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="wrap">
                    <QueryTree
                        className={classNames({ 'animate__animated animate__bounceOutUp': isAnimating })}
                        treeData={queryTree} />
                    <QueryMaker
                        className={classNames({ 'animate__animated animate__bounceOutDown': isAnimating })}
                        dogTags={dogPropTags} />
                </Flex>
            )}
            {showResults && <DogsTable data={dogData} />}
        </Flex>
    )
}

export default App