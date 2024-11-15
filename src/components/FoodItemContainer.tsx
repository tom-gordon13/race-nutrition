import React, { useRef } from 'react';
import { Box } from '@mui/material';


interface FoodItemContainerProps {
    itemName: string;
    onDropInRaceContainer: (itemId: string, x: number, y: number) => void;
}

export const FoodItemContainer: React.FC<FoodItemContainerProps> = ({ itemName, onDropInRaceContainer }) => {
    const boxRef = useRef<HTMLDivElement | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', itemName);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        const dropArea = document.elementFromPoint(e.clientX, e.clientY);
        const margin = 5;
        
        if (dropArea && dropArea.id === 'race-container' && boxRef.current) {
            const raceContainerRect = dropArea.getBoundingClientRect();
            const boxRect = boxRef.current.getBoundingClientRect();
    
            let x = e.clientX - raceContainerRect.left - boxRect.width / 2;
            let y = e.clientY - raceContainerRect.top - boxRect.height / 2;

            x = Math.max(margin, Math.min(x, raceContainerRect.width - boxRect.width - margin));
            y = Math.max(margin, Math.min(y, raceContainerRect.height - boxRect.height - margin));
    
            onDropInRaceContainer(itemName, x, y);
        }
    };

    return (
        <Box
            ref={boxRef}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            sx={{
                position: 'relative',
                height: '4rem',
                width: '8rem',
                backgroundColor: 'lightgray',
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                marginBottom: '1rem'
            }}
        >
            {itemName}
        </Box>
    );
}