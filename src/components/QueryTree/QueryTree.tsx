import React from 'react'
import { QueryTreeState } from '../../shared/types'
import DogTag from '../DogTag/DogTag';
import './QueryTree.css';
import { v4 as uuid } from 'uuid';
import { useDoggyStore } from '../../store/doggyStore';
import classNames from 'classnames';
import { Card, Divider } from '@mantine/core';
import { useUIStore } from '../../store/UIStore';

interface QueryTreeProps {
    treeData: QueryTreeState
    className?: string;
    isRoot?: boolean;
}

function QueryTree({ className, treeData }: QueryTreeProps) {
    const { operator, dogProps, queryNodes, id, selected, isRoot } = treeData;
    // State
    const [selectDogPropOrNode, unselectAll, removeQueryNode] = useDoggyStore(
        ({ selectDogPropOrNode, unselectAll, removeQueryNode }) => [selectDogPropOrNode, unselectAll, removeQueryNode]);
    const setShowResults = useUIStore(state => state.setShowResults);

    // Handlers
    const onClickDogNode = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        unselectAll()
        selectDogPropOrNode(id);
        // Remove the node when it's clicked twice sequentially
        if (selected && !isRoot) {
            removeQueryNode(id)
        }
    }
    return (
        <Card
            className={classNames(className, 'queryTree', {
                'queryTree--selected': selected,
                'queryTree--non-root': !isRoot
            })}
            onClick={onClickDogNode}
            onAnimationEnd={() => setShowResults(true)}>
            <Divider my="xs" label={operator} labelPosition="center" />
            <div className='queryTreeBody'>
                {/* Render the DogTag values */}
                <div className={classNames('queryTreeDogProps',
                    { 'queryTreeDogProps--addedMargin': queryNodes?.length })}>
                    {dogProps?.map(({ property, value, id, selected }) => (
                        <DogTag
                            key={uuid()}
                            className="queryTreeDogTag"
                            propName={property}
                            value={value}
                            id={id}
                            selected={selected} />
                    ))}
                </div>
                {/* Recursively render QueryTree child nodes */}
                {queryNodes?.map((childTree, i) => {
                    return (
                        <QueryTree
                            key={uuid()}
                            className={classNames({ "queryTree--addedMargin": i != queryNodes.length - 1 })}
                            treeData={childTree} />
                    )
                })}
            </div>
        </Card>
    )
}

export default QueryTree