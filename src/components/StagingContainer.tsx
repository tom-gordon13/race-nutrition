import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { FoodItemContainer } from './FoodItemContainer';
import { useAllocatedItems } from '../context/AllocatedItemsContext';

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

}



export const StagingContainer: React.FC<StagingContainerProps> = ({ }) => {
    const { handleDropInRaceContainer } = useAllocatedItems();

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
                    onDropInRaceContainer={handleDropInRaceContainer}
                />
            ))}

        </Box>
    );
}