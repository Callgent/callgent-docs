import axios from "@site/src/util/axios/index";

export function uaaService() {
    return {
        createEndpoints: (data: {
            "type": string,
            "host": string,
            "callgentUuid": string
        }) => {
            return axios.post('/api/endpoints/mail/callgents', data);
        },
    };
}