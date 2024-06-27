import { ModalType, TreeNodeType } from '@site/src/types/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState } from 'react';
import Endpoints from './endpoints';
import { TreeNode } from './tree';
import Modal from './modal';
import './index.scss';
import Callgent from './callgent';
import axios from 'axios';

const CascadingMenu: React.FC = ({ adaptorKey }: { adaptorKey?: string }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    // tree
    const [modalData, setModalData] = useState<ModalType | null>(null);
    const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
    const [importState, setImportState] = useState<boolean | string | null>(null);
    const handleAdd = (item: TreeNodeType, level: number) => {
        const { id } = item;
        setModalData({ ...modalData, id, type: 'Create', endpoint: true, initialData: item });
    };

    const handleEdit = (item: TreeNodeType, level: number) => {
        const { id } = item;
        if (level === 1) {
            setModalData({ ...modalData, id, type: 'Edit', callgent: true, initialData: item });
        } else {
            setModalData({ ...modalData, id, type: 'Edit', endpoint: true, initialData: item });
        }
    };

    const handleDelete = (id: string, level: number) => {
        if (level === 1) {
            axios.delete('/api/callgents/' + id).then((req) => {
                setTreeData([]);
            }).catch((error) => {

            })
            return null;
        } else if (level === 3) {
            axios.delete('/api/endpoints/' + id).then((req) => {
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
            }).catch((error) => {

            })
        }
    };

    const handleModalSubmit = (data: TreeNodeType) => {
        if (modalData?.type === 'Create') {
            const newTreeData = [...treeData];
            const addNode = (nodes: TreeNodeType[]) => {
                nodes.forEach((node) => {
                    if (node.id === modalData.id) {
                        node.children.push(data);
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
                        node.name = data?.host as string;
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
                    type="submit" onClick={addCallgent}
                    className="button margin--sm button--info button--secondary"
                >
                    Create a new callgent
                </button>
            )}
            <TreeNode
                nodes={treeData}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <Modal isOpen={modalData?.endpoint} onClose={() => setModalData({ ...modalData, endpoint: false })} title={modalData?.type + " Server Endpoint"}>
                <Endpoints
                    adaptorKey={adaptorKey}
                    treeData={treeData[0]}
                    initialData={modalData?.initialData}
                    onSubmit={handleModalSubmit}
                    type={modalData?.type}
                    onClose={() => setModalData({ ...modalData, endpoint: false })}
                />
            </Modal>
            <Modal isOpen={modalData?.callgent} onClose={() => setModalData({ ...modalData, callgent: false })} title={modalData?.type + " Callgent"}>
                <Callgent
                    initialData={modalData?.initialData}
                    treeData={treeData[0]}
                    setTreeData={setTreeData}
                    onClose={() => setModalData({ ...modalData, endpoint: false })}
                />
            </Modal>
        </div>
    );
};

export default CascadingMenu;
