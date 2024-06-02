import axios from 'axios';

export function uaas() {
    return {
        createEndpoints: (data: {
            "type": string,
            "host": object,
            "initParams": object,
            "content": object,
            "callgentUuid": string
        }) => {
            return axios.post('/api/endpoints/{adaptorKey}/callgents', data);
        },
    };
}