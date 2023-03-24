import React from 'react'
import { QueryTreeState } from '../../types'
import DogTag from '../DogTag/DogTag';
import './QueryTree.css';
import { v4 as uuid } from 'uuid';
import { useDoggyStore } from '../../store/doggyStore';
import classNames from 'classnames';
import { Card, Divider } from '@mantine/core';

interface QueryTreeProps {
    treeData: QueryTreeState
    className?: string;
}

function QueryTree({ className, treeData }: QueryTreeProps) {
    const { operator, dogProps, queryNodes, id, selected } = treeData;
    const selectDogPropOrNode = useDoggyStore(({ selectDogPropOrNode }) => selectDogPropOrNode);
    const onClickDogNode = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (id) {
            selectDogPropOrNode(id);
        }
    }
    return (
        <Card className={classNames(className, 'queryTree', {
            'queryTree--selected': selected
        })} onClick={onClickDogNode}>
            <Divider my="xs" label={operator} labelPosition="center" />
            <div className='queryTreeBody'>
                <div className={classNames('queryTreeDogProps', {
                    'queryTreeDogProps--addedMargin': queryNodes?.length
                })}>
                    {dogProps?.map(({ property, value, id, selected }) => (
                        <DogTag key={uuid()} className="queryTreeDogTag" propName={property} value={value} id={id} selected={selected} />
                    ))}
                </div>
                {queryNodes?.map((childTree, i) => {
                    return <QueryTree className={classNames({
                        "queryTree--addedMargin": i != queryNodes.length - 1
                    })} key={uuid()} treeData={childTree} />
                })}
            </div>
        </Card>
    )
}

export default QueryTree