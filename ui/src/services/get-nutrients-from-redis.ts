import axios from "axios";

const API_PORT = 3001;

export const getNutrients = async (fdcId: string) => {
    try {
        const response = await axios.get(`http://localhost:${API_PORT}/nutrition/${fdcId}`);
        return response.data.foodNutrients
    } catch (error: any) {
        console.error('Error fetching item: ', error)
    }
};