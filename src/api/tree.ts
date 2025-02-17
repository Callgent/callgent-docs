import axios from "axios";

export const fetchAdaptors = async () => {
    try {
        const { data } = await axios.get('/api/entries/adaptors?client=true')
        return data;
    } catch (error) {
        throw error;
    }
};
