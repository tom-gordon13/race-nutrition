import axios from "axios";

const API_PORT = 3001;



export const postNutrients = async (item: any) => {
    const { fdcId, foodNutrients, brandName, brandOwner, description } = item
    const itemToPost = { fdcId, foodNutrients, brandName, brandOwner, description }
    try {
        const response = await axios.post(`http://localhost:${API_PORT}/nutrition`, {
            itemToPost,
        });

        console.log('nutrients posted')
    } catch (error: any) {
        console.error('Error fetching item: ', error)
    }
};