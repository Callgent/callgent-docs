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
                                 {/* {level !== 3 ? (expandedNodes.has(node.id) ? '-' : '+') : null} */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                </svg>
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