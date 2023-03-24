import React from 'react'
import { QueryTreeState } from '../../types'
import DogTag from '../DogTag/DogTag';
import './QueryTree.css';
import { v4 as uuid } from 'uuid';
import { useDoggyStore } from '../../store/doggyStore';
import classNames from 'classnames';

interface QueryTreeProps {
    treeData: QueryTreeState
}

function QueryTree({ treeData }: QueryTreeProps) {
    const { operator, dogProps, queryNodes, id, selected } = treeData;
    const selectDogPropOrNode = useDoggyStore(({ selectDogPropOrNode }) => selectDogPropOrNode);
    const onClickDogNode = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (id) {
            selectDogPropOrNode(id);
        }
    }
    return (
        <div className={classNames('queryTree', {
            'queryTree--selected': selected
        })} onClick={onClickDogNode}>
            <div className='queryTreeHeader'>{operator}</div>
            <div className='queryTreeBody'>
                <div className={classNames('queryTreeDogProps', {
                    'queryTreeDogProps--addedMargin': queryNodes?.length
                })}>
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