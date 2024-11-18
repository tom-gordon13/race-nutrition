import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { useAllocatedItems } from '../context/AllocatedItemsContext';


interface FoodItemContainerProps {
    foodItem: AllocatedItem,
}

const margin = 5
const stepSize = 3

const containerDimensions = {
    height: '80px',
    width: '120px',
}

export const AllocatedFoodItem: React.FC<FoodItemContainerProps> = ({ foodItem }) => {
    const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: foodItem.x, y: foodItem.y });
    const [originalPosition, setOriginalPosition] = useState({ x: foodItem.x, y: foodItem.y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const { allocatedItems } = useAllocatedItems();

    const handleClick = () => {
        setIsInEditMode(!isInEditMode);
    };


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
                border: '1px solid black',
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onDoubleClick={handleClick}
        >
            {foodItem.item_name} - {position.x}, {position.y}
            <Button
                variant="contained"
                color="secondary"
                sx={{ marginTop: '0.5rem', display: isInEditMode ? 'block' : 'none' }}
            >
                Remove
            </Button>
        </Box>
    );
}