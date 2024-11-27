import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { FoodItemCard } from './FoodItemCard';
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { StagedItem } from '../pages/Home';

const itemList = [
    {
        item_id: '123',
        item_name: 'Gummies'
    },
    {
        item_id: '456',
        item_name: 'Energy Bar'
    },
    {
        item_id: '789',
        item_name: 'Gel'
    }
]


interface StagingContainerProps {
    stagedItems: StagedItem[]
    removeStagedItem: Function
}



export const StagingContainer: React.FC<StagingContainerProps> = ({ stagedItems, removeStagedItem }) => {
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
            flexDirection: 'row',
            justifyContent: 'start',
            gap: '1%'
        }}>
            {stagedItems.map((item) => (
                <FoodItemCard
                    key={item.item_id}
                    item={item}
                    onDropInRaceContainer={handleDropInRaceContainer}
                    removeStagedItem={removeStagedItem}
                />
            ))}

        </Box>
    );
}