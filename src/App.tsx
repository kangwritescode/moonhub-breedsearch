import { useEffect, useState } from 'react'
import './App.css'
import QueryMaker from './components/QueryMaker/QueryMaker'
import csvtojson from 'csvtojson';
import { DogBreed } from './types';
import DogsView from './components/DogsView/DogsView';
import QueryTree from './components/QueryTree/QueryTree';

function App() {
  const [dogData, setDogData] = useState<Array<DogBreed>>([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/src/dogdata.csv');
      const csvData = await response.text();
      const jsonData = await csvtojson().fromString(csvData);
      setDogData(jsonData);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <div className='layout__top'>
          <QueryMaker />
      </div>
      <div className='layout__bottom'>
        <div className='layout__left'>
          <QueryTree />
        </div>
        <div className='layout__right'>
          <DogsView data={dogData} />
        </div>
      </div>
    </div>
  )
}

export default App
