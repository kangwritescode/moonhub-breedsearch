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
    const [selectNode, unselectAll, removeQueryNode] = useDoggyStore(
        (state) => [state.selectNode, state.unselectAll, state.removeQueryNode]);
    const setShowResults = useUIStore(state => state.setShowResults);

    // Handlers
    const onClickDogNode = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        unselectAll()
        selectNode(id);
        // Remove the node when it's clicked twice sequentially
        if (selected && !isRoot) {
            removeQueryNode(id)
        }
    }
    return (
        <Card
            className={classNames(className, 'query-tree', {
                'query-tree--selected': selected,
                'query-tree--non-root': !isRoot
            })}
            onClick={onClickDogNode}
            onAnimationEnd={() => setShowResults(true)}>
            <Divider my="xs" label={operator} labelPosition="center" />
            <div className='query-tree-body'>
                {/* Render the DogTag values */}
                <div className={classNames('query-tree-dog-props',
                    { 'query-tree-dog-props--added-margin': queryNodes?.length })}>
                    {dogProps.map(({ property, value, id }) => (
                        <DogTag
                            key={uuid()}
                            className="query-tree-dog-tag"
                            propName={property}
                            value={value}
                            id={id}/>
                    ))}
                </div>
                {/* Recursively render QueryTree child nodes */}
                {queryNodes.map((childTree, i) => {
                    return (
                        <QueryTree
                            key={uuid()}
                            className={classNames({ "query-tree--added-margin": i != queryNodes.length - 1 })}
                            treeData={childTree} />
                    )
                })}
            </div>
        </Card>
    )
}

export default QueryTree