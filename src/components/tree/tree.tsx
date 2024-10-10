import { TreeNodeProps, TreeNodeType } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState, useEffect } from 'react';
import { Add, Delete, Edit, Import, Lock } from './icon';
import Popconfirm from './confirm-delete';
import './index.scss';

export const TreeNode: React.FC<TreeNodeProps> = ({ nodes, onAdd, onEdit, onLock, treeData, setTreeData }) => {
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

    const getIconSrc = (level: number, node: TreeNodeType) => {
        switch (level) {
            case 1:
                return '/icons/Recruitment.svg';
            case 2:
                return `/icons/${node?.id}.svg`;
            case 3:
                return `/icons/${node?.adaptorKey}.svg`;
            case 4:
                return `/icons/api.svg`;
            default:
                return '/icons/default.svg';
        }
    };
    const renderNodes = (nodes: TreeNodeType[], level: number = 1, parentId: string | null = null) => {
        return nodes.map((node) => (
            <div key={node.id} className="tree-node">
                <div className="node-content">
                    <div className="node-left" title={node?.name} onClick={() => handleToggle(node.id, level)}>
                        <button className="toggle" title={node?.hint} >
                            <span className="icon-text">
                                <img src={getIconSrc(level, node)} />
                                <div className='left-text'>
                                    {node?.name}
                                </div>
                            </span>
                        </button>
                    </div>
                    <div className="node-right">
                        {node?.lock &&
                            <div onClick={() => onLock(node, level)}>
                                <Lock data={{ level, realms: treeData?.realms, securities: node?.securities }} />
                            </div>
                        }
                        {node?.add &&
                            <div onClick={() => onAdd(node, level)}>
                                <Add />
                            </div>
                        }
                        {node?.import &&
                            <div onClick={() => onAdd(node, level)}>
                                {node?.type === "SERVER" && <Import />}
                            </div>
                        }
                        {node?.edit &&
                            <div onClick={() => onEdit({ ...node, title: parentId }, level)}>
                                <Edit />
                            </div>
                        }
                        {node?.delete &&
                            <div>
                                <Popconfirm
                                    title={level === 1 ? 'Delete the callgent' : 'Delete the entry'}
                                    description="Are you sure you want to delete this content?"
                                    initialData={{ id: node.id, level }}
                                    onCancel={() => { }}
                                    treeData={treeData}
                                    setTreeData={setTreeData}
                                >
                                    <Delete />
                                </Popconfirm>
                            </div>
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
