import React, { useState, useRef } from 'react';
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

        console.log(dropArea, boxRef)
        if (dropArea && dropArea.id === 'race-container' && boxRef.current) {
            console.log('herehere')
            const rect = dropArea.getBoundingClientRect();
            const boxRect = boxRef.current.getBoundingClientRect();

            // Offset to position the box at the drop location's center
            const x = e.clientX - boxRect.width / 2;
            const y = e.clientY - boxRect.height / 2;

            // Pass the item ID and adjusted coordinates to the drop handler
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