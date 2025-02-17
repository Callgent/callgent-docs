import { atom } from 'recoil';

export const adaptorsState = atom({
    key: 'adaptorsState',
    default: { "restAPI": "/icons/RestAPI.svg", "Email": "/icons/Email.svg" },
});
