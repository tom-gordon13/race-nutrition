import axios from "axios";

const API_PORT = 3001;

export const fetchItem = async (inputValue: string) => {
    try {
        const response = await axios.get(`http://localhost:${API_PORT}/item`, {
            params: { query: inputValue },
        });

        return response.data.data.foods
    } catch (error: any) {
        console.error('Error fetching item: ', error)
    }
};