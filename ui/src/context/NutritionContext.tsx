import React, { createContext, useContext, useEffect, useState } from 'react';
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { getNutrients } from '../services/get-nutrients-from-redis';
import { useAllocatedItems } from './AllocatedItemsContext';

interface NutritionContextProps {
    calculateHourlyNutrition: (itemId: string, assignedHour: number) => void;
    hourlyNutrition: HourlyNutrition
    removeFromHourlyNutrition: (itemId: string, hour: number) => void
}

interface NutritionValue {
    volume: number;
    unit: string;
}

export interface SingleHourNutrition {
    [nutritionName: string]: NutritionValue;
}

interface HourlyNutrition {
    [hour: number]: SingleHourNutrition;
}


const NutritionContext = createContext<NutritionContextProps | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hourlyNutrition, setHourlyNutrition] = useState<HourlyNutrition>({})
    const { allocatedItems } = useAllocatedItems()

    const calculateHourlyNutrition = async (itemId: string, assignedHour: number) => {
        const nutrients = await getNutrients(itemId);

        if (!hourlyNutrition[assignedHour]) {
            hourlyNutrition[assignedHour] = {};
        }

        const hourlyNutritionObject = hourlyNutrition[assignedHour];

        nutrients.forEach((nutrient: { nutrientName: string; value: number; unitName: string }) => {
            const { nutrientName, value, unitName } = nutrient;

            if (hourlyNutritionObject[nutrientName]) {
                hourlyNutritionObject[nutrientName].volume += value;
            } else {
                hourlyNutritionObject[nutrientName] = {
                    volume: value,
                    unit: unitName,
                };
            }
        });
        setHourlyNutrition({ ...hourlyNutrition, [assignedHour]: hourlyNutritionObject })
        console.log(assignedHour)
    };

    const removeFromHourlyNutrition = async (itemId: string, hour: number) => {
        const nutrients = await getNutrients(itemId);

        const hourlyNutritionObject = hourlyNutrition[hour];

        nutrients.forEach((nutrient: { nutrientName: string; value: number; unitName: string }) => {
            const { nutrientName, value, unitName } = nutrient;

            if (hourlyNutritionObject[nutrientName]) {
                hourlyNutritionObject[nutrientName].volume -= value;
            } else {
                hourlyNutritionObject[nutrientName] = {
                    volume: value,
                    unit: unitName,
                };
            }
        });
        setHourlyNutrition({ ...hourlyNutrition, [hour]: hourlyNutritionObject })
    }


    return (
        <NutritionContext.Provider value={{ calculateHourlyNutrition, hourlyNutrition, removeFromHourlyNutrition }}>
            {children}
        </NutritionContext.Provider>
    );
};

export const useNutrition = (): NutritionContextProps => {
    const context = useContext(NutritionContext);
    if (!context) {
        throw new Error('useNutrition must be used within an NutritionProvider');
    }
    return context;
};
