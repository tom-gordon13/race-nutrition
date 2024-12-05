import React from 'react';
import { Box } from '@mui/material';
import { FoodItemCard } from './FoodItemCard';
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { StagedItem } from '../pages/Home';
import { useTheme } from '@mui/material/styles';

interface StagingContainerProps {
    stagedItems: StagedItem[]
    removeStagedItem: Function
    setIsDraggingStagedItem: (isDraggingStagedItem: boolean) => void
}



export const StagingContainer: React.FC<StagingContainerProps> = ({ stagedItems, removeStagedItem, setIsDraggingStagedItem }) => {
    const { handleDropInRaceContainer } = useAllocatedItems();
    const theme = useTheme()

    return (
        <Box sx={{
            height: '15rem',
            width: '100%',
            border: `2px solid ${theme.palette.grey[300]}`,
            alignContent: 'center',
            marginBottom: '1rem',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            gap: '1%',
            borderRadius: 2,
        }}>
            {stagedItems.map((item) => (
                <FoodItemCard
                    key={item.item_id}
                    item={item}
                    onDropInRaceContainer={handleDropInRaceContainer}
                    removeStagedItem={removeStagedItem}
                    setIsDraggingStagedItem={setIsDraggingStagedItem}
                />
            ))}

        </Box>
    );
}