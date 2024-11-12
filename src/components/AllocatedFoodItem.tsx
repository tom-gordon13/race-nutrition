import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import { AllocatedItem } from '../interfaces/AllocatedItem';


interface FoodItemContainerProps {
    foodItem: AllocatedItem
}

export const AllocatedFoodItem: React.FC<FoodItemContainerProps> = ({ foodItem }) => {

    return (
        <Box
            sx={{
                position: 'absolute',
                top: foodItem.y,
                left: foodItem.x,
                padding: '0.5rem',
                backgroundColor: 'lightgreen',
                border: '1px solid black'
            }}
        >
            {foodItem.id} - {foodItem.x}, {foodItem.y}
        </Box>
    );
}