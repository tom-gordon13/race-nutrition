import { Box } from '@mui/material';
import React from 'react';
import { AllocatedFoodItem } from './AllocatedFoodItem'

interface AllocatedItem {
    id: string;
    x: number;
    y: number;
}

interface RaceContainerTopProps {
    allocatedItems: AllocatedItem[];
}


export const RaceContainerTop: React.FC<RaceContainerTopProps> = ({ allocatedItems }) => {
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
                <AllocatedFoodItem foodItem={item} />
            ))}
        </Box>
    );
};