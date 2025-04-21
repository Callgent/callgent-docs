import { atom } from 'recoil';

export const adaptorsState = atom({
    key: 'adaptorsState',
    default: { "RestAPI": "/icons/RestAPI.svg", "Email": "/icons/Email.svg" },
});
