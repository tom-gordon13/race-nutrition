import React, { createContext, useContext, useEffect, useState } from 'react';
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { getNutrients } from '../services/get-nutrients-from-redis';
import { useAllocatedItems } from './AllocatedItemsContext';
import { useEventContext } from './EventContext';

interface NutritionContextProps {
    hourlyNutrition: HourlyNutrition
    removeItemFromHourly: (itemId: string, hour: number, quantity?: number) => void
    addItemToHourly: (itemId: string, hour: number, servings: number) => void
    updateNutritionByHour: (assignedHour: number) => void
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

interface HourlyItemsByVolume {
    [itemId: string]: {
        itemName: string,
        servings: number
    }
}


const NutritionContext = createContext<NutritionContextProps | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hourlyNutrition, setHourlyNutrition] = useState<HourlyNutrition>({})
    const { eventDuration } = useEventContext()
    const [fullEventItems, setFullEventItems] = useState<HourlyItems[]>([])
    const [fullEventItemsByVolume, setFullEventItemsByVolume] = useState<HourlyItemsByVolume[]>(
        Array.from({ length: eventDuration }, () => ({}))
    );
    const [pendingHourUpdate, setPendingHourUpdate] = useState<number | null>(null);
    const { allocatedItems } = useAllocatedItems()

    useEffect(() => {
        if (eventDuration) {
            const initializedItems = Array.from({ length: eventDuration }, () => []);
            setFullEventItems(initializedItems);
        }
    }, [eventDuration]);


    const addItemToHourly = async (itemId: string, hour: number, servings: number = 1) => {
        const fullEventItemsCopy = [...fullEventItems]
        fullEventItemsCopy[hour - 1] = fullEventItemsCopy[hour - 1] ? [...fullEventItemsCopy[hour - 1], itemId] : []

        setFullEventItems([...fullEventItemsCopy])


        const fullEventItemsByVolumeCopy = [...fullEventItemsByVolume]
        if (!(itemId in fullEventItemsByVolumeCopy[hour])) {
            fullEventItemsByVolumeCopy[hour][itemId] = {
                itemName: 'no item names yet',
                servings: 1
            }
        } else {
            fullEventItemsByVolumeCopy[hour][itemId] = {
                itemName: 'no item names yet',
                servings: fullEventItemsByVolumeCopy[hour][itemId].servings += 1
            }
        }

        setFullEventItemsByVolume([...fullEventItemsByVolumeCopy])
    }

    useEffect(() => {
        if (pendingHourUpdate !== null) {
            updateNutritionByHour(pendingHourUpdate);
            setPendingHourUpdate(null);
        }
    }, [pendingHourUpdate]);

    const removeItemFromHourly = (itemId: string, hour: number, servings: number = 1) => {
        const fullEventItemsByVolumeCopy = fullEventItemsByVolume
        fullEventItemsByVolumeCopy[hour - 1][itemId].servings -= servings
        setFullEventItemsByVolume([...fullEventItemsByVolumeCopy])
        setPendingHourUpdate(hour - 1);
    }

    const updateNutritionByHour = async (assignedHour: number) => {
        const hourlyNutrients: any = {};

        const hourFoodItems = fullEventItemsByVolume[assignedHour];

        for (const [key, pair] of Object.entries(hourFoodItems)) {
            const nutrients = await getNutrients(key);
            const servings = pair.servings;

            nutrients.forEach((nutrient: { nutrientName: string; value: number; unitName: string }) => {
                const { nutrientName, value } = nutrient;

                if (nutrientName in hourlyNutrients) {
                    hourlyNutrients[nutrientName].volume += value * servings;
                } else {
                    hourlyNutrients[nutrientName] = { volume: value * servings };
                }
            });
        }

        setHourlyNutrition((prevHourlyNutrition) => ({
            ...prevHourlyNutrition,
            [assignedHour + 1]: hourlyNutrients,
        }));
    };

    return (
        <NutritionContext.Provider value={{ hourlyNutrition, addItemToHourly, removeItemFromHourly, updateNutritionByHour }}>
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
