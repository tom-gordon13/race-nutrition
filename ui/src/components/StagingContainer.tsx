import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { FoodItemCard } from './FoodItemCard';
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { StagedItem } from '../pages/Home';
import { useTheme } from '@mui/material/styles';

interface StagingContainerProps {
    stagedItems: StagedItem[]
    setStagedItems: Function
    removeStagedItem: Function
    setIsDraggingStagedItem: (isDraggingStagedItem: boolean) => void
    toggleDrawer: (newOpen: boolean) => void
}



export const StagingContainer: React.FC<StagingContainerProps> = ({ stagedItems, setStagedItems, removeStagedItem, setIsDraggingStagedItem, toggleDrawer }) => {
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
            <Grid container spacing={2} alignItems="flex-start" justifyContent='space-between' sx={{ margin: '1rem 10rem' }}>
                <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10%', height: '200px' }}>
                    {stagedItems.map((item) => (
                        <FoodItemCard
                            key={item.item_id}
                            item={item}
                            onDropInRaceContainer={handleDropInRaceContainer}
                            removeStagedItem={removeStagedItem}
                            setIsDraggingStagedItem={setIsDraggingStagedItem}
                        />
                    ))}</Grid>
                <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10%', height: '200px' }}>
                    <Button onClick={() => toggleDrawer(true)} variant='contained' sx={{ height: '40%' }}>Search for Items</Button>

                    <Button onClick={() => setStagedItems([])} variant='outlined' sx={{
                        height: '25%'
                    }}>Clear Items</Button>
                </Grid>
            </Grid>


        </Box>
    );
}