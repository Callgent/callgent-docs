import { ModalType, TreeNodeType } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { Children, useEffect, useRef, useState } from 'react';
import Endpoints from './endpoints';
import { TreeNode } from './tree';
import Modal from './modal';
import './index.scss';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';
import Callgent from './callgent';
import CreateCallgent from '../user-as-a-service/create-callgent';

const CascadingMenu: React.FC = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    // tree
    const [modalData, setModalData] = useState<ModalType | null>(null);
    const [treeData, setTreeData] = useState<TreeNodeType[]>([]);

    const handleAdd = (id: string) => {
        setModalData({ ...modalData, id, type: 'Create', endpoint: true });
    };

    const handleEdit = (id: string) => {
        setModalData({ ...modalData, id, type: 'Edit', endpoint: true, initialData: { adaptor: 'RestAPI', definition: '', host: '' } });
    };

    const handleDelete = (id: string) => {
        const newTreeData = [...treeData];
        const deleteNode = (nodes: TreeNodeType[], parent: TreeNodeType[]) => {
            nodes.forEach((node, index) => {
                if (node.id === id) {
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
        if (modalData?.type === 'Create') {
            const newTreeData = [...treeData];
            const addNode = (nodes: TreeNodeType[]) => {
                nodes.forEach((node) => {
                    if (node.id === modalData.id) {
                        node.children.push({
                            id: 'new-id',
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
        } else if (modalData?.type === 'Edit') {
            const newTreeData = [...treeData];
            const editNode = (nodes: TreeNodeType[]) => {
                nodes.forEach((node) => {
                    if (node.id === modalData.id) {
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

    // Create a new callgent
    const addCallgent = () => {
        setModalData({ ...modalData, type: 'Create', callgent: true });
    };

    return (
        <div className='CascadingMenu'>
            {treeData?.length === 0 && (
                <button
                    type="submit"
                    className="button col col--3 margin--sm button--info button--secondary"
                    onClick={addCallgent}
                >
                    Create a new callgent
                </button>
            )}
            <TreeNode
                nodes={treeData}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onNodeClick={(id, level) => {
                    console.log(`Node clicked: ${id}, Level: ${level}`);
                }}
            />
            <Modal isOpen={modalData?.endpoint} onClose={() => setModalData({ ...modalData, endpoint: false })} title={modalData?.type + " Endpoint"}>
                <Endpoints
                    initialData={modalData?.initialData}
                    onSubmit={handleModalSubmit}
                    onClose={() => setModalData({ ...modalData, endpoint: false })}
                />
            </Modal>
            <Modal isOpen={modalData?.callgent} onClose={() => setModalData({ ...modalData, callgent: false })} title={modalData?.type + " Callgent"}>
                <Callgent
                    initialData={modalData?.initialData}
                    treeData={treeData}
                    setTreeData={setTreeData}
                    onClose={() => setModalData({ ...modalData, endpoint: false })}
                />
            </Modal>
        </div>
    );
};

export default CascadingMenu;
