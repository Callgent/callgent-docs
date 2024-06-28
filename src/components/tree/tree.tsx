import { TreeNodeProps, TreeNodeType } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState, useEffect } from 'react';
import { Add, Delete, Edit } from './icon';
import Popconfirm from './confirm-delete';
import './index.scss';

export const TreeNode: React.FC<TreeNodeProps> = ({ nodes, onAdd, onEdit, treeData, setTreeData }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    useEffect(() => {
        const expandAllNodes = (nodes: TreeNodeType[], expandedSet: Set<string>) => {
            nodes.forEach(node => {
                expandedSet.add(node.id);
                if (node.children) {
                    expandAllNodes(node.children, expandedSet);
                }
            });
        };
        const initialExpandedNodes = new Set<string>();
        expandAllNodes(nodes, initialExpandedNodes);
        setExpandedNodes(initialExpandedNodes);
    }, [nodes]);

    const handleToggle = (id: string, level: number) => {
        setExpandedNodes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const renderNodes = (nodes: TreeNodeType[], level: number = 1, parentId: string | null = null) => {
        return nodes.map((node) => (
            <div key={node.id} className="tree-node">
                <div className="node-content">
                    <div className="node-left" onClick={() => handleToggle(node.id, level)}>
                        <button className="toggle" title={node?.hint} >
                            <span className="icon-text">
                                {level === 1 && <img src='/icons/Recruitment.svg' />}
                                {level === 2 && <img src={'/icons/' + node?.id + '.svg'} />}
                                {level === 3 && <img src={'/icons/' + node?.adaptorKey + '.svg'} />}
                                {node?.name}
                            </span>
                        </button>
                    </div>
                    <div className="node-right">
                        <div onClick={() => onAdd(node, level)}>
                            {node?.add && <Add />}
                        </div>
                        <div onClick={() => onEdit({ ...node, title: parentId }, level)}>
                            {node?.edit && <Edit />}
                        </div>
                        {
                            node?.delete && <Popconfirm
                                title={level === 1 ? 'Delete the callgent' : 'Delete the endpoint'}
                                description="Are you sure you want to delete this content?"
                                initialData={{ id: node.id, level }}
                                onCancel={() => { }}
                                treeData={treeData}
                                setTreeData={setTreeData}
                            >
                                <Delete />
                            </Popconfirm>
                        }
                    </div>
                </div>
                {expandedNodes.has(node.id) && node.children && (
                    <div className="children">
                        {renderNodes(node.children, level + 1, node.id)}
                    </div>
                )}
            </div>
        ));
    };

    return <div>{renderNodes(nodes)}</div>;
};