import axios from "axios";

export const getChatBox = async (input: string) => {
    const data = await axios.post('/api/chat', { message: input });
    return data;
};

export const getChat = async (callgentId: string, entryId: string, requirement: string) => {
    try {
        const data = await axios.post(`/api/webpage/request/${callgentId}/${entryId}`, { requirement })
        return data
    }
    catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            return { data: { message: error.response.data.message } }
        } else {
            console.error('Unknown Error:', error);
            throw new Error('An unknown error occurred');
        }
    }
}
