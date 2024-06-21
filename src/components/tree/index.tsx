import { TreeNodeType } from '@site/src/types/components';
import React, { useState } from 'react';
import { TreeNode } from './tree';
import Modal from './modal';
import Endpoints from './endpoints';
import './index.scss';
import useIsBrowser from '@docusaurus/useIsBrowser';

const CascadingMenu: React.FC = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [treeData, setTreeData] = useState<TreeNodeType[]>([
        {
            uuid: 'uuid-1',
            name: 'parent 1',
            children: [
                { uuid: 'uuid-2', name: 'parent 1-0', children: [] },
                { uuid: 'uuid-3', name: 'parent 1-1', children: [] },
                {
                    uuid: 'uuid-4',
                    name: 'parent 1-2',
                    children: [
                        { uuid: 'uuid-5', name: 'leaf', children: [] },
                        { uuid: 'uuid-6', name: 'leaf', children: [] },
                    ],
                },
            ],
        },
        { uuid: 'uuid-7', name: 'parent 2', children: [] },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{ uuid: string; type: 'add' | 'edit'; initialData?: { adaptor: string; definition: string; host: string } } | null>(null);

    const handleAdd = (uuid: string) => {
        setModalData({ uuid, type: 'add' });
        setIsModalOpen(true);
    };

    const handleEdit = (uuid: string) => {
        const node = findNodeById(treeData, uuid);
        if (node) {
            setModalData({ uuid, type: 'edit', initialData: { adaptor: 'RestAPI', definition: '', host: '' } });
            setIsModalOpen(true);
        }
    };

    const handleDelete = (uuid: string) => {
        const newTreeData = [...treeData];
        const deleteNode = (nodes: TreeNodeType[], parent: TreeNodeType[]) => {
            nodes.forEach((node, index) => {
                if (node.uuid === uuid) {
                    parent.splice(index, 1);
                } else if (node.children) {
                    deleteNode(node.children, node.children);
                }
            });
        };
        deleteNode(newTreeData, newTreeData);
        setTreeData(newTreeData);
    };

    const handleModalSubmit = (data: { adaptor: string; definition: string; host: string }) => {
        if (modalData?.type === 'add') {
            const newTreeData = [...treeData];
            const addNode = (nodes: TreeNodeType[]) => {
                nodes.forEach((node) => {
                    if (node.uuid === modalData.uuid) {
                        node.children.push({
                            uuid: 'new-uuid',
                            name: data.adaptor,
                            children: [],
                        });
                    } else if (node.children) {
                        addNode(node.children);
                    }
                });
            };
            addNode(newTreeData);
            setTreeData(newTreeData);
        } else if (modalData?.type === 'edit') {
            const newTreeData = [...treeData];
            const editNode = (nodes: TreeNodeType[]) => {
                nodes.forEach((node) => {
                    if (node.uuid === modalData.uuid) {
                        node.name = data.adaptor;
                    } else if (node.children) {
                        editNode(node.children);
                    }
                });
            };
            editNode(newTreeData);
            setTreeData(newTreeData);
        }
    };

    const findNodeById = (nodes: TreeNodeType[], uuid: string): TreeNodeType | null => {
        for (const node of nodes) {
            if (node.uuid === uuid) {
                return node;
            }
            if (node.children) {
                const found = findNodeById(node.children, uuid);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    return (
        <div className='CascadingMenu'>
            <TreeNode
                nodes={treeData}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalData?.initialData ? 'Edit Endpoint' : 'Create Endpoint'}>
                <Endpoints
                    initialData={modalData?.initialData}
                    onSubmit={handleModalSubmit}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default CascadingMenu;
