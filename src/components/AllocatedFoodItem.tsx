import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { AllocatedItem } from '../interfaces/AllocatedItem';


interface FoodItemContainerProps {
    foodItem: AllocatedItem
}

export const AllocatedFoodItem: React.FC<FoodItemContainerProps> = ({ foodItem }) => {
    const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: foodItem.x, y: foodItem.y });

    const handleClick = () => {
        setIsInEditMode(true)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isInEditMode) return

        if (e.key === 'ArrowRight') setPosition((prev) => ({ ...prev, x: prev.x + 3 }));
        if (e.key === 'ArrowLeft') setPosition((prev) => ({ ...prev, x: prev.x - 3 }));
    }

    useEffect(() => {
        if (isInEditMode) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isInEditMode])

    return (
        <Box
            sx={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                padding: '0.5rem',
                backgroundColor: 'lightgreen',
                border: '1px solid black'
            }}
            onClick={handleClick}
        >
            {foodItem.id} - {position.x}, {position.y}
        </Box>
    );
}