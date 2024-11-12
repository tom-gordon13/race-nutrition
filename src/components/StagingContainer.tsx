import React from 'react';
import { Box } from '@mui/material';
import { FoodItemContainer } from './FoodItemContainer';

const itemNameList = [
    'Gummies',
    'Drink Mix',
    'Energy Bar'
]

interface StagingContainerProps {
    onDropInRaceContainer: (itemId: string, x: number, y: number) => void;
}



export const StagingContainer: React.FC<StagingContainerProps> = ({ onDropInRaceContainer }) => {

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
            {itemNameList.map((itemName) => (
                <FoodItemContainer
                    key={itemName}
                    itemName={itemName}
                    onDropInRaceContainer={onDropInRaceContainer}
                />
            ))}

        </Box>
    );
}