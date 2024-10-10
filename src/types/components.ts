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
    import?: boolean;
    lock?: boolean;
    adaptorKey?: string;
    children: TreeNodeType[];
    realms?: Realms;
    securities?: any;
}

export interface HostType {
    email?: string;
}

export interface ModalType {
    type: string;
    title?: string;
    id?: string;
    callgent?: boolean;
    entry?: boolean;
    auth?: boolean;
    import?: boolean;
    initialData?: TreeNodeType;
}

export interface TreeNodeProps {
    nodes: TreeNodeType[];
    onAdd: (item: TreeNodeType, level: number) => void;
    onEdit: (item: TreeNodeType, level: number) => void;
    onLock: (item: TreeNodeType, level: number) => void;
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

interface TabItem {
    label: string;
    content: React.ReactNode;
}
export interface TabsProps {
    tabs: TabItem[];
    callgentId?: string;
}

export interface Scheme {
    type: string;
    in: string;
    name: string;
    provider: string;
}

export interface Realm {
    realmKey: string;
    authType: string;
    realm: string;
    scheme: Scheme;
    perUser: boolean;
    enabled: boolean;
}

export interface Realms {
    realms: Realm[];
}
