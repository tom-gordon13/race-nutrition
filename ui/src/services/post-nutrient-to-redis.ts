import axios from "axios";

const API_PORT = 3001;



export const postNutrients = async (item: any) => {
    const { fdcId, foodNutrients, brandName, brandOwner, description, servingSize } = item;

    if (!servingSize || servingSize <= 0) {
        console.error("Invalid serving size");
        return;
    }

    const scaledFoodNutrients = foodNutrients.map((nutrient: any) => ({
        ...nutrient,
        value: nutrient.value * (servingSize / 100),
    }));

    const itemToPost = {
        fdcId,
        foodNutrients: scaledFoodNutrients,
        brandName,
        brandOwner,
        description,
    };

    try {
        const response = await axios.post(`http://localhost:${API_PORT}/nutrition`, {
            itemToPost,
        });

        console.log('Nutrients posted successfully:', response.data);
    } catch (error: any) {
        console.error('Error posting item:', error);
    }
};
