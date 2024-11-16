import React from 'react';
import { Box } from '@mui/material';
import { FoodItemContainer } from './FoodItemContainer';

const itemList = [
    {
        itemId: '123',
        item_name: 'Gummies'
    },
    {
        itemId: '456',
        item_name: 'Energy Bar'
    },
    {
        itemId: '789',
        item_name: 'Gel'
    }
]

interface StagingContainerProps {
    onDropInRaceContainer: (itemId: string, x: number, y: number, item_name: string) => void;
}



export const StagingContainer: React.FC<StagingContainerProps> = ({ onDropInRaceContainer }) => {

    return (
        <Box sx={{
            height: '15rem',
            width: '100%',
            border: '1px solid black',
            alignContent: 'center',
            marginBottom: '1rem',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'row'
        }}>
            {itemList.map((item) => (
                <FoodItemContainer
                    key={item.itemId}
                    item={item}
                    onDropInRaceContainer={onDropInRaceContainer}
                />
            ))}

        </Box>
    );
}