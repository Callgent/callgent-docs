import { TreeNodeType } from '@site/src/types/components';
import React, { useState } from 'react';
import './index.scss';
import { Add, Delete, Edit } from './icon';
import Popconfirm from './confirm-delete';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface TreeNodeProps {
    nodes: TreeNodeType[];
    onAdd: (uuid: string) => void;
    onEdit: (uuid: string) => void;
    onDelete: (uuid: string) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ nodes, onAdd, onEdit, onDelete }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    const handleToggle = (uuid: string) => {
        setExpandedNodes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(uuid)) {
                newSet.delete(uuid);
            } else {
                newSet.add(uuid);
            }
            return newSet;
        });
    };

    const renderNodes = (nodes: TreeNodeType[]) => {
        return nodes.map((node) => (
            <div key={node.uuid} className="tree-node">
                <div className="node-content">
                    <div className="node-left">
                        <button className="toggle" onClick={() => handleToggle(node.uuid)}>
                            <span className='toggle_button'>
                                {node.children.length !== 0 && (
                                    expandedNodes.has(node.uuid) ? '-' : '+'
                                )}
                            </span>
                            {node.name}
                        </button>
                    </div>
                    <div className="node-right">
                        <div onClick={() => onAdd(node.uuid)}>
                            <Add />
                        </div>
                        <div onClick={() => onEdit(node.uuid)}>
                            <Edit />
                        </div>
                        <Popconfirm
                            title="Delete the node"
                            description="Are you sure you want to delete this node?"
                            onConfirm={() => onDelete(node.uuid)}
                            onCancel={() => { }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Delete />
                        </Popconfirm>
                    </div>
                </div>
                {expandedNodes.has(node.uuid) && node.children && (
                    <div className="children">
                        {renderNodes(node.children)}
                    </div>
                )}
            </div>
        ));
    };

    return <div>{renderNodes(nodes)}</div>;
};