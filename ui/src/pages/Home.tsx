import React, { useState } from 'react';
import { Box, Grid, Drawer, Button } from '@mui/material';
import { StagingContainer } from '../components/StagingContainer';
import { RaceContainerTop } from '../components/RaceContainerTop'
import { NavMain } from '../components/NavMain';
import { AllocatedItem } from '../interfaces/AllocatedItem'
import { NutritionInfoContainer } from '../components/NutritionInfoContainer'
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { FoodSearchContainer } from '../components/FoodSearchContainer';

const raceDurationSample = 10

export const Home = () => {
    const { allocatedItems, setAllocatedItems } = useAllocatedItems();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setIsDrawerOpen(newOpen);
    };

    return (
        <>
            <NavMain />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' }}>
                <Button onClick={toggleDrawer(true)}>Search for Items</Button>
                <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)} anchor='right' PaperProps={{
                    sx: {
                        width: "40vw",
                        maxWidth: "40vw",
                        height: "100vh",
                    },
                }}>
                    <FoodSearchContainer />
                </Drawer>

                <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={8}>
                        <StagingContainer />
                    </Grid>
                    <Grid item xs={4}>
                        <NutritionInfoContainer />
                    </Grid>
                </Grid>

                <RaceContainerTop raceDuration={raceDurationSample} />

            </Box>
        </>
    );
}