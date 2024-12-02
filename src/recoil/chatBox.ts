import { atom } from 'recoil';

export const chatBoxState = atom<Array<any>>({
    key: 'chatBoxState',
    default: [],
});


export const webUiState = atom<{
    files?: object;
    packages?: Array<string>;
    routes?: Array<{ name: string, path: string, component: string }>;
}>({
    key: 'webUiState',
    default: {},
});