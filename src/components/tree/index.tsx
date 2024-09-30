import { ModalType, TreeNodeType } from '@site/src/types/components';
import CreateCallgent from '../user-as-a-service/create-callgent';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState } from 'react';
import Endpoints from './endpoints';
import { TreeNode } from './tree';
import Callgent from './callgent';
import Modal from './component/modal';
import './index.scss';
import Import from './import';
import Auth from '../user-as-a-service/callgent-auth';

const CascadingMenu: React.FC = ({ adaptorKey, name }: { adaptorKey?: string, name?: string }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }

    // tree
    const [modalData, setModalData] = useState<ModalType | null>(null);
    const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
    const handleAdd = (item: TreeNodeType, level: number) => {
        const { id } = item;
        if (level === 2) {
            setModalData({ ...modalData, title: id, id, type: 'Create', endpoint: true, initialData: item });
        } else if (level === 3) {
            setModalData({ ...modalData, title: id, id, type: 'Import', import: true, initialData: item });
        }
    };

    const handleLock = (item: TreeNodeType, level: number) => {
        const { id } = item;
        if (level === 1) {
            setModalData({ ...modalData, title: "Manage", id, type: '', auth: true, initialData: null });
        } else {
            setModalData({ ...modalData, title: "Quote", id, type: '', auth: true, initialData: item });
        }
    };

    const handleEdit = (item: TreeNodeType, level: number) => {
        const { id } = item;
        if (level === 1) {
            setModalData({ ...modalData, title: item.title, id, type: 'Edit', callgent: true, initialData: item });
        } else if (level === 3) {
            setModalData({ ...modalData, title: item.title, id, type: 'Edit', endpoint: true, initialData: item });
        } else if (level === 4) {
            setModalData({ ...modalData, title: item.title, id, type: 'Edit', import: true, initialData: item });
        }
    };
    const handleModalSubmit = (data: TreeNodeType) => {
        console.log(data);
        
        if (modalData?.type === 'Create' || modalData?.type === 'Import') {
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

    const onDataReceived = (data: TreeNodeType) => {
        if (!data) return;
        const enhancedData = enhanceNode(data, 1);
        setTreeData([enhancedData]);
    };

    const enhanceNode = (node: TreeNodeType, level: number): TreeNodeType => {
        let enhancedNode = { ...node };
        if (level === 2) {
            enhancedNode = { ...enhancedNode, add: true };
        } else if (level === 3 && node?.type === "SERVER") {
            enhancedNode = { ...enhancedNode, edit: true, delete: true, import: true, lock: true };
        } else if (level === 3 || level === 1) {
            enhancedNode = { ...enhancedNode, edit: true, delete: true, lock: true };
        } else if (level === 4) {
            enhancedNode = { ...enhancedNode, lock: true };
        }
        if (node.children) {
            enhancedNode.children = node.children.map(child => enhanceNode(child, level + 1));
        }
        return enhancedNode;
    };

    return (
        <div className='CascadingMenu'>
            {treeData?.length === 0 && (
                <CreateCallgent onDataReceived={onDataReceived} name={name} />
            )}
            <TreeNode
                nodes={treeData}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onLock={handleLock}
                treeData={treeData[0]}
                setTreeData={setTreeData}
            />
            <Modal isOpen={modalData?.auth} onClose={() => setModalData({ ...modalData, auth: false })} title={modalData?.type + " " + modalData?.title + " Auth"}>
                <Auth
                    initialData={modalData?.initialData}
                    treeData={treeData[0]}
                    onSubmit={handleModalSubmit}
                    setTreeData={setTreeData}
                    onClose={() => setModalData({ ...modalData, endpoint: false })}
                />
            </Modal>
            <Modal isOpen={modalData?.endpoint} onClose={() => setModalData({ ...modalData, endpoint: false })} title={modalData?.type + " " + modalData?.title + " Endpoint"}>
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
            <Modal isOpen={modalData?.import} onClose={() => setModalData({ ...modalData, import: false })} title={modalData?.type + " Api"}>
                <Import
                    initialData={modalData?.initialData}
                    treeData={treeData[0]}
                    type={modalData?.type}
                    onSubmit={handleModalSubmit}
                    setTreeData={setTreeData}
                    onClose={() => setModalData({ ...modalData, import: false })}
                />
            </Modal>
        </div>
    );
};

export default CascadingMenu;
