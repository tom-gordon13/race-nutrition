import React from 'react';
import { Box } from '@mui/material';


interface FoodItemContainerProps {
    itemName: string;
}

export const FoodItemContainer: React.FC<FoodItemContainerProps> = ({ itemName }) => {
    return (
        <Box sx={{
            height: '5rem',
            width: '10rem',
            border: '1px solid black',
            alignContent: 'center',
            margin: '0.5rem'
        }}>
            FoodItemContainer - {itemName}
        </Box>
    );
}