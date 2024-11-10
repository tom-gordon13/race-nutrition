import React from 'react';
import { Box } from '@mui/material';
import { FoodItemContainer } from './FoodItemContainer';

const itemNameList = [
    'Gummies',
    'Drink Mix',
    'Energy Bar'
]


export const StagingContainer = () => {
    return (
        <Box sx={{
            height: '15rem',
            width: '80%',
            border: '1px solid black',
            alignContent: 'center',
            marginBottom: '1rem',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'row'
        }}>
            Staging Container
            <FoodItemContainer itemName={itemNameList[0]} />
            <FoodItemContainer itemName={itemNameList[1]} />
            <FoodItemContainer itemName={itemNameList[2]} />
        </Box>
    );
}