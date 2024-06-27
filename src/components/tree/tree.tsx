import { TreeNodeType } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { Add, Delete, Edit } from './icon';
import Popconfirm from './confirm-delete';
import React, { useState, useEffect } from 'react';
import './index.scss';

interface TreeNodeProps {
    nodes: TreeNodeType[];
    onAdd: (item: TreeNodeType, level: number) => void;
    onEdit: (item: TreeNodeType, level: number) => void;
    onDelete: (id: string, level: number) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ nodes, onAdd, onEdit, onDelete }) => {
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

    const renderNodes = (nodes: TreeNodeType[], level: number = 1) => {
        return nodes.map((node) => (
            <div key={node.id} className="tree-node">
                <div className="node-content">
                    <div className="node-left">
                        <button className="toggle" onClick={() => handleToggle(node.id, level)}>
                            <span className='toggle_button'>
                                {level !== 3 ? (expandedNodes.has(node.id) ? '-' : '+') : null}
                            </span>
                            {node?.name}
                        </button>
                    </div>
                    <div className="node-right">
                        <div onClick={() => onAdd(node, level)}>
                            {node?.add && <Add />}
                        </div>
                        <div onClick={() => onEdit(node, level)}>
                            {node?.edit && <Edit />}
                        </div>
                        {
                            node?.delete && <Popconfirm
                                title="Delete the node"
                                description="Are you sure you want to delete this node?"
                                onConfirm={() => onDelete(node.id, level)}
                                onCancel={() => { }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Delete />
                            </Popconfirm>
                        }
                    </div>
                </div>
                {expandedNodes.has(node.id) && node.children && (
                    <div className="children">
                        {renderNodes(node.children, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return <div>{renderNodes(nodes)}</div>;
};