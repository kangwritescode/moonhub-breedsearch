import React from 'react'
import { QueryTreeState } from '../../types'
import DogTag from '../DogTag/DogTag';
import './QueryTree.css';
import { v4 as uuid } from 'uuid';
import { useDoggyStore } from '../../store/doggyStore';
import classNames from 'classnames';
import { Card, CloseButton, Divider } from '@mantine/core';

interface QueryTreeProps {
    treeData: QueryTreeState
    className?: string;
    isRoot?: boolean;
}

function QueryTree({ className, treeData }: QueryTreeProps) {
    const { operator, dogProps, queryNodes, id, selected, isRoot } = treeData;
    const [selectDogPropOrNode, unselectAll, removeQueryNode] = useDoggyStore(({ selectDogPropOrNode, unselectAll, removeQueryNode }) => [selectDogPropOrNode, unselectAll, removeQueryNode]);

    const onClickDogNode = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        unselectAll() // Unselect all nodes
        selectDogPropOrNode(id); // Select the clicked node
        if (selected && !isRoot) {
            removeQueryNode(id)
        }
    }
    return (
        <Card className={classNames(className, 'queryTree', {
            'queryTree--selected': selected,
            'queryTree--non-root': !isRoot
        })} onClick={onClickDogNode}>
            <Divider my="xs" label={operator} labelPosition="center" />
            <div className='queryTreeBody'>
                {/* Render the DogTag values */}
                <div className={classNames('queryTreeDogProps', {
                    'queryTreeDogProps--addedMargin': queryNodes?.length
                })}>
                    {dogProps?.map(({ property, value, id, selected }) => (
                        <DogTag key={uuid()} className="queryTreeDogTag" propName={property} value={value} id={id} selected={selected} />
                    ))}
                </div>
                {/* Recursively render QueryTree child nodes */}
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