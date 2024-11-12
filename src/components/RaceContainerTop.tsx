import { Box } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';
import { AllocatedFoodItem } from './AllocatedFoodItem'
import { AllocatedItem } from '../interfaces/AllocatedItem';


interface RaceContainerTopProps {
    allocatedItems: AllocatedItem[];
    removeAllocatedItem: (itemId: string) => void;
    raceDuration: number
}


export const RaceContainerTop: React.FC<RaceContainerTopProps> = ({ allocatedItems, removeAllocatedItem, raceDuration }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [lineSpacing, setLineSpacing] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            setLineSpacing(containerWidth / raceDuration);
        }
    }, [raceDuration]);

    const lineCount = raceDuration - 1;

    return (
        <Box
            id="race-container"
            ref={containerRef}
            sx={{
                padding: '1rem',
                border: '1px solid green',
                width: '90%',
                height: '25rem',
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {allocatedItems.map((item) => (
                <AllocatedFoodItem foodItem={item} removeItem={removeAllocatedItem} />
            ))}

        </Box>
    );
};