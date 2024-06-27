export interface TreeNodeType {
    id: string;
    name: string;
    hint?: string;
    title?: string;
    type?: string;
    host?: HostType;
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    adaptorKey?: string;
    children: TreeNodeType[];
}

export interface HostType {
    email?: string;
}

export interface ModalType {
    type: 'Create' | 'Edit';
    title?: string;
    id?: string;
    callgent?: boolean;
    endpoint?: boolean;
    initialData?: TreeNodeType;
}

export interface TreeNodeProps {
    nodes: TreeNodeType[];
    onAdd: (item: TreeNodeType, level: number) => void;
    onEdit: (item: TreeNodeType, level: number) => void;
    treeData?: TreeNodeType;
    setTreeData: (data: TreeNodeType[]) => void;
}

export interface PopconfirmProps {
    title: string;
    description: string;
    initialData: { id: string, level: number };
    onCancel: () => void;
    okText?: string;
    cancelText?: string;
    children: React.ReactNode;
    treeData?: TreeNodeType;
    setTreeData: (data: TreeNodeType[]) => void;
}

export interface ModalFormProps {
    initialData?: TreeNodeType;
    treeData?: TreeNodeType;
    setTreeData?: (data: TreeNodeType[]) => void;
    onClose: () => void;
    adaptorKey?: string;
    type?: string;
    onSubmit?: (data: TreeNodeType) => void;
}

export interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
