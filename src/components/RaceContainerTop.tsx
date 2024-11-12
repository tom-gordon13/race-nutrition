import { Box } from '@mui/material';
import React, { useState } from 'react';
import { AllocatedFoodItem } from './AllocatedFoodItem'
import { AllocatedItem } from '../interfaces/AllocatedItem';


interface RaceContainerTopProps {
    allocatedItems: AllocatedItem[];
    removeAllocatedItem: (itemId: string) => void;
}


export const RaceContainerTop: React.FC<RaceContainerTopProps> = ({ allocatedItems, removeAllocatedItem }) => {



    return (
        <Box
            id="race-container"
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
            <h3>Race Container</h3>
            {allocatedItems.map((item, index) => (
                <AllocatedFoodItem foodItem={item} removeItem={removeAllocatedItem} />
            ))}
        </Box>
    );
};