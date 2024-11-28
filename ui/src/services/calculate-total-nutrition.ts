import { AllocatedItem } from "../interfaces/AllocatedItem";
import { getNutrients } from "./get-nutrients-from-redis";

export const calculateTotalNutrition = async (allocatedItems: AllocatedItem[]) => {
    const totalNutrients: any[] = [];

    const nutrientPromises = allocatedItems.map(async (item) => {
        const nutrient = await getNutrients(item.item_id);
        if (nutrient) {
            return nutrient;
        }
        return null;
    });

    const resolvedNutrients = await Promise.all(nutrientPromises);

    resolvedNutrients.forEach((nutrient) => {
        if (nutrient) {
            totalNutrients.push(nutrient);
        }
    });

    return totalNutrients;
};