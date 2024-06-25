export interface TreeNodeType {
    id: string;
    name: string;
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    children: TreeNodeType[];
}

export interface ModalType {
    type: 'Create' | 'Edit';
    id?: string;
    callgent?: boolean;
    endpoint?: boolean;
    initialData?: {
        adaptor: string;
        definition: string;
        host: string
    }
}