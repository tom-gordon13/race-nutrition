import axios from "axios";
import { NUTRIENT_REFERENCE } from "../reference/object-mapping/nutrient-mapping";

const API_PORT = 3001;

interface NutrientObject { nutrientName?: string, unitName?: string, value?: number }

export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
        const random = Math.random() * 16 | 0;
        const value = char === 'x' ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
}

const findNutrientByFdcNameWithKey = (fdcName: string) => {
    return Object.entries(NUTRIENT_REFERENCE).find(
        ([_, nutrient]) => nutrient.FDC_NAME === fdcName
    );
}

export const postFDCNutrients = async (item: any) => {
    const { fdcId, foodNutrients, brandName, brandOwner, description } = item;
    const servings = 1

    if (!servings || servings <= 0) {
        console.error("Invalid serving size");
        return;
    }

    const scaledFoodNutrients: any[] = [];

    foodNutrients.forEach((nutrient: any) => {
        const nutrientRefObject = findNutrientByFdcNameWithKey(nutrient.nutrientName)
        if (nutrientRefObject) {
            const [key] = nutrientRefObject
            const nutrientData = {
                ...nutrient,
                nutrientName: key,
                value: nutrient.value * (servings / 100),
            };
            scaledFoodNutrients.push(nutrientData);
        }
    });

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

const generateNutrients = (nutrients: Object) => {
    let returnedNutrients: NutrientObject[] = []

    Object.entries(nutrients).forEach(([key, value]) => {
        const nutrientObject: NutrientObject = {}
        nutrientObject.nutrientName = key
        nutrientObject.unitName = 'G'
        nutrientObject.value = value

        returnedNutrients = [...returnedNutrients, nutrientObject]
    });

    return returnedNutrients
}

export const postCustomNutrients = async (item: any) => {
    const { protein, fat, carbohydrate, fiber, sodium, itemName, itemBrand, itemCategory, item_id } = item
    const nutrients = {
        'Protein': protein,
        'Total lipid (fat)': fat,
        'Carbohydrate, by difference': carbohydrate,
        'Fiber, total dietary': fiber,
        'Sodium, Na': sodium
    }

    const foodNutrients = generateNutrients(nutrients)

    const itemToPost = {
        fdcId: item_id,
        foodNutrients,
        brandName: itemBrand,
        brandOwner: 'None',
        description: itemName,
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