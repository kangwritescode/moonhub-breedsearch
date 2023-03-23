import React from 'react'
import PropSelector from '../PropSelector/PropSelector'
import QueryInput from '../QueryInput/QueryInput'
import SearchButton from '../SearchButton/SearchButton'

function QueryMaker() {
    return (
        <div>
            <div>
                <QueryInput />
                <SearchButton />
            </div>
            <PropSelector />
        </div>
    )
}

export default QueryMaker