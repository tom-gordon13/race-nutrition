import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { AllocatedItem } from '../interfaces/AllocatedItem';


interface FoodItemContainerProps {
    foodItem: AllocatedItem,
    removeItem: (itemId: string) => void;
    rightEdge: number
}

const margin = 5
const stepSize = 3 

const remToPx = (rem: string) => parseFloat(rem) * parseFloat(getComputedStyle(document.documentElement).fontSize);

const containerDimensions = {
    height: '5rem',
    width: '8rem',
}

export const AllocatedFoodItem: React.FC<FoodItemContainerProps> = ({ foodItem, removeItem, rightEdge }) => {
    const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: foodItem.x, y: foodItem.y });

    const handleClick = () => {
        setIsInEditMode(!isInEditMode)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isInEditMode) return

        console.log(rightEdge)
        if (e.key === 'ArrowRight') setPosition((prev) => ({ ...prev, x: Math.min(rightEdge - remToPx(containerDimensions.width), prev.x + stepSize )}));
        if (e.key === 'ArrowLeft') setPosition((prev) => ({ ...prev, x: Math.max(margin, prev.x - stepSize) }));
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
                height: containerDimensions.height,
                width: containerDimensions.width,
                padding: '0.5rem',
                backgroundColor: isInEditMode ? 'red' : 'lightgreen',
                border: '1px solid black'
            }}
            onClick={handleClick}
        >
            {foodItem.id} - {position.x}, {position.y}
            <Button
                variant="contained"
                color="secondary"
                onClick={() => removeItem(foodItem.id)}
                sx={{ marginTop: '0.5rem' }}
            >
                Remove
            </Button>
        </Box>
    );
}