import React, { createContext, useContext, useEffect, useState } from 'react';
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { getNutrients } from '../services/get-nutrients-from-redis';

interface NutritionContextProps {
    calculateHourlyNutrition: (allocatedItem: AllocatedItem, assignedHour: number) => void;
}

interface NutritionValue {
    volume: number;
    unit: string;
}

interface SingleHourNutrition {
    [nutritionName: string]: NutritionValue;
}


const NutritionContext = createContext<NutritionContextProps | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hourlyNutrition, setHourlyNutrition] = useState<SingleHourNutrition[]>([])

    const calculateHourlyNutrition = async (allocatedItem: AllocatedItem, assignedHour: number) => {
        const nutrients = await getNutrients(allocatedItem.item_id);
    }

    return (
        <NutritionContext.Provider value={{ calculateHourlyNutrition }}>
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
