import { useEffect } from 'react'
import QueryMaker from './components/QueryMaker/QueryMaker'
import csvtojson from 'csvtojson';
import QueryTree from './components/QueryTree/QueryTree';
import './App.css'
import { DogPropTags } from './shared/types';
import { DoggyStore, useDoggyStore } from './store/doggyStore';
import { Flex, Tooltip } from '@mantine/core';
import doggySVG from './assets/doggy.svg';

function App() {
    const {
        dogData,
        queryTree,
        dogPropTags,
        setDogData,
        setDogPropTags,
    }: DoggyStore = useDoggyStore()

    // Fetch and set dogData from csv file
    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/src/assets/dogdata.csv');
            const csvData = await response.text();
            const jsonData = await csvtojson().fromString(csvData);
            setDogData(jsonData);
        }
        fetchData();
    }, []);

    // Generate and set dogPropTags from dogData
    useEffect(() => {
        if (dogData.length) {
            const tags: DogPropTags = []
            const seenDogProps = new Set();
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
        <div className="App">
            <Tooltip
                label="bork bork bork 🎵"
                color="cyan"
                withArrow
            >
                <img className='doggySVG' src={doggySVG} />
            </Tooltip>
            <Flex
                mih={"100vh"}
                gap={{ base: 'sm', sm: 'lg' }}
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
            >
                <QueryTree treeData={queryTree} />
                <QueryMaker dogTags={dogPropTags} />
            </Flex>
        </div>
    )
}

export default App