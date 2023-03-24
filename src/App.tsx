import { useEffect, useState } from 'react'

import { DogBreed, QueryTreeState } from './types';
import QueryMaker from './components/QueryMaker/QueryMaker'
import csvtojson from 'csvtojson';
import DogsView from './components/DogsView/DogsView';
import QueryTree from './components/QueryTree/QueryTree';
import './App.css'
import { DogPropTags } from './types';
import { v4 as uuid } from "uuid";
import { DoggyStore, useDoggyStore } from './store/doggyStore';

function App() {
    const {
        dogData,
        queryTree,
        dogPropTags,
        setDogData,
        setDogPropTags 
    }: DoggyStore = useDoggyStore()

    // Fetch and set dogData from csv file
    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/src/dogdata.csv');
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
            <div className='layout__top'>
                <QueryMaker dogTags={dogPropTags} />
            </div>
            <div className='layout__bottom'>
                <div className='layout__left'>
                    <QueryTree treeData={queryTree} />
                </div>
                <div className='layout__right'>
                    <DogsView data={dogData} />
                </div>
            </div>
        </div>
    )
}

export default App
