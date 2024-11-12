import { Box } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';
import { AllocatedFoodItem } from './AllocatedFoodItem'
import { AllocatedItem } from '../interfaces/AllocatedItem';


interface RaceContainerTopProps {
    allocatedItems: AllocatedItem[];
    removeAllocatedItem: (itemId: string) => void;
    raceDuration: number
}

const conatinerDimensions = {
    width: '100rem',    
    height: '25rem'
}

export const RaceContainerTop: React.FC<RaceContainerTopProps> = ({ allocatedItems, removeAllocatedItem, raceDuration }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const lineCount = raceDuration - 1;

    return (
        <Box
            id="race-container"
            ref={containerRef}
            sx={{
                position: 'relative',
                padding: '1rem',
                border: '1px solid green',
                width: conatinerDimensions.width,
                height: conatinerDimensions.height,
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {[...Array(lineCount)].map((_, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${(index * 100) / (lineCount-1)}%`,
            width: '1px', 
            backgroundColor: 'black',
          }}
        />
      ))}
            {allocatedItems.map((item) => (
                <AllocatedFoodItem foodItem={item} removeItem={removeAllocatedItem} />
            ))}

        </Box>
    );
};