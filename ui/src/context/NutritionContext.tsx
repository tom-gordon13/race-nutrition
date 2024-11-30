import React, { createContext, useContext, useEffect, useState } from 'react';
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { getNutrients } from '../services/get-nutrients-from-redis';
import { useAllocatedItems } from './AllocatedItemsContext';
import { useEventContext } from './EventContext';

interface NutritionContextProps {
    calculateHourlyNutrition: (itemId: string, assignedHour: number) => void;
    hourlyNutrition: HourlyNutrition
    removeFromHourlyNutrition: (itemId: string, hour: number) => void
    addItemToHourly: (itemId: string, hour: number) => void
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

type HourlyItems = string[];


const NutritionContext = createContext<NutritionContextProps | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hourlyNutrition, setHourlyNutrition] = useState<HourlyNutrition>({})
    const { eventDuration } = useEventContext()
    const [fullEventItems, setFullEventItems] = useState<HourlyItems[]>([])
    const { allocatedItems } = useAllocatedItems()

    useEffect(() => {
        if (eventDuration) {
            // Initialize fullEventItems as an array of empty arrays
            const initializedItems = Array.from({ length: eventDuration }, () => []);
            setFullEventItems(initializedItems);
        }
    }, [eventDuration]);


    const addItemToHourly = (itemId: string, hour: number) => {
        const fullyEventItemsCopy = [...fullEventItems]
        fullyEventItemsCopy[hour] = [...fullyEventItemsCopy[hour], itemId]
        console.log([...fullyEventItemsCopy])

        setFullEventItems([...fullyEventItemsCopy])
    }

    const calculateHourlyNutrition = async (itemId: string, assignedHour: number) => {
        const nutrients = await getNutrients(itemId);

        setHourlyNutrition((prevHourlyNutrition) => {
            const updatedHourlyNutrition = { ...prevHourlyNutrition };

            if (!updatedHourlyNutrition[assignedHour]) {
                updatedHourlyNutrition[assignedHour] = {};
            }

            const hourlyNutritionObject = { ...updatedHourlyNutrition[assignedHour] };

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

            updatedHourlyNutrition[assignedHour] = hourlyNutritionObject;
            return updatedHourlyNutrition;
        });
    };

    const removeFromHourlyNutrition = async (itemId: string, hour: number) => {
        if (!hourlyNutrition[hour]) {
            console.error(`Hour ${hour} does not exist in hourlyNutrition.`);
            return;
        }

        const nutrients = await getNutrients(itemId);
        const hourlyNutritionObject = hourlyNutrition[hour];

        console.log(hour, hourlyNutrition)
        nutrients.forEach((nutrient: { nutrientName: string; value: number; unitName: string }) => {
            const { nutrientName, value, unitName } = nutrient;

            hourlyNutritionObject[nutrientName].volume -= value;
        });
        setHourlyNutrition({ ...hourlyNutrition, [hour]: hourlyNutritionObject })
    }


    return (
        <NutritionContext.Provider value={{ calculateHourlyNutrition, hourlyNutrition, removeFromHourlyNutrition, addItemToHourly }}>
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
