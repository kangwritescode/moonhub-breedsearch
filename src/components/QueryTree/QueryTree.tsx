import React from 'react'
import { QueryTreeState } from '../../types'
import DogTag from '../DogTag/DogTag';
import './QueryTree.css';
import { v4 as uuid } from 'uuid';

interface QueryTreeProps {
    treeData: QueryTreeState
}

function QueryTree({ treeData }: QueryTreeProps) {
    const { operator, dogProps, queryNodes } = treeData;
    return (
        <div className='queryTree'>
            <div className='queryTreeHeader'>{operator}</div>
            <div className='queryTreeBody'>
                <div className='queryTreeDogProps'>
                    {dogProps?.map(({ property, value, id, selected }) => (
                        <DogTag key={uuid()} className="queryTreeDogTag" propName={property} value={value} id={id} selected={selected} />
                    ))}
                </div>
                {queryNodes?.map((childTree) => (
                    <QueryTree key={uuid()} treeData={childTree} />
                ))}
            </div>
        </div>
    )
}

export default QueryTree