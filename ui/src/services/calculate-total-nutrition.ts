import { create } from "domain";
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

    const nutrientSet = createNutrientSet(totalNutrients)
    console.log(nutrientSet)
    return nutrientSet;
};

const createNutrientSet = (nutrientsArray: any[]) => {
    const nutrientSet: Record<string, { totalValue: number; unitName: string }> = {};

    nutrientsArray.forEach((item) => {
        item.forEach((nutrient: any) => {
            const { nutrientName, value, unitName } = nutrient;

            if (!nutrientSet[nutrientName]) {
                nutrientSet[nutrientName] = { totalValue: 0, unitName };
            }

            nutrientSet[nutrientName].totalValue += value;
        });
    });

    return nutrientSet;
};