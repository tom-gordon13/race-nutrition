import React, { createContext, useContext, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { AllocatedItem } from '../interfaces/AllocatedItem'

interface AllocatedItemsContextProps {
    allocatedItems: AllocatedItem[];
    setAllocatedItems: Dispatch<SetStateAction<AllocatedItem[]>>;
    handleDropInRaceContainer: (itemId: string, x: number, y: number, item_name: string) => void;
    removeAllocatedItem: (instance_id: number) => void;
}

const AllocatedItemsContext = createContext<AllocatedItemsContextProps | undefined>(undefined);

export const AllocatedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allocatedItems, setAllocatedItems] = useState<AllocatedItem[]>([]);

    useEffect(() => {
        console.log(allocatedItems)
    }, [allocatedItems])

    const handleDropInRaceContainer = (itemId: string, x: number, y: number, item_name: string) => {
        const newInstanceId = allocatedItems.length + 1
        setAllocatedItems((prev) => [...prev, { item_id: itemId, instance_id: newInstanceId, x, y, item_name }]);
    };

    const removeAllocatedItem = (instance_id: number) => {
        setAllocatedItems((prevItems) => prevItems.filter(item => item.instance_id !== instance_id));
    };

    return (
        <AllocatedItemsContext.Provider value={{ allocatedItems, setAllocatedItems, handleDropInRaceContainer, removeAllocatedItem }}>
            {children}
        </AllocatedItemsContext.Provider>
    );
};

export const useAllocatedItems = (): AllocatedItemsContextProps => {
    const context = useContext(AllocatedItemsContext);
    if (!context) {
        throw new Error('useAllocatedItems must be used within an AllocatedItemsProvider');
    }
    return context;
};
