export interface TreeNodeType {
    id: string;
    name: string;
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
    id?: string;
    callgent?: boolean;
    endpoint?: boolean;
    initialData?: TreeNodeType;
}