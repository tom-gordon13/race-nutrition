import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { AllocatedItem } from '../interfaces/AllocatedItem'

interface AllocatedItemsContextProps {
    allocatedItems: AllocatedItem[];
    setAllocatedItems: Dispatch<SetStateAction<AllocatedItem[]>>;
    handleDropInRaceContainer: (itemId: string, x: number, y: number) => void;
    removeAllocatedItem: (itemId: string) => void;
}

const AllocatedItemsContext = createContext<AllocatedItemsContextProps | undefined>(undefined);

export const AllocatedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allocatedItems, setAllocatedItems] = useState<AllocatedItem[]>([]);

    const handleDropInRaceContainer = (itemId: string, x: number, y: number) => {
        setAllocatedItems((prev) => [...prev, { id: itemId, x, y }]);
    };

    const removeAllocatedItem = (itemId: string) => {
        setAllocatedItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    };

    return (
        <AllocatedItemsContext.Provider value={{ allocatedItems, setAllocatedItems, handleDropInRaceContainer, removeAllocatedItem }}>
            {children}
        </AllocatedItemsContext.Provider>
    );
};

// Custom hook for accessing the context
export const useAllocatedItems = (): AllocatedItemsContextProps => {
    const context = useContext(AllocatedItemsContext);
    if (!context) {
        throw new Error('useAllocatedItems must be used within an AllocatedItemsProvider');
    }
    return context;
};
