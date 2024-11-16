import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { StagingContainer } from '../components/StagingContainer';
import { RaceContainerTop } from '../components/RaceContainerTop'
import { NavMain } from '../components/NavMain';
import { AllocatedItem } from '../interfaces/AllocatedItem'
import { NutritionInfoContainer } from '../components/NutritionInfoContainer'
import { useAllocatedItems } from '../context/AllocatedItemsContext';

const raceDurationSample = 8

export const Home = () => {
    const { allocatedItems, setAllocatedItems } = useAllocatedItems();

    const handleDropInRaceContainer = (itemId: string, x: number, y: number, item_name: string) => {
        setAllocatedItems((prev) => [...prev, { id: itemId, x, y, item_name }]);
    };

    const removeAllocatedItem = (itemId: string) => {
        setAllocatedItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    };


    return (
        <>
            <NavMain />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' }}>

                <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={8}>
                        <StagingContainer onDropInRaceContainer={handleDropInRaceContainer} />
                    </Grid>
                    <Grid item xs={4}>
                        <NutritionInfoContainer />
                    </Grid>
                </Grid>
                <RaceContainerTop removeAllocatedItem={removeAllocatedItem} raceDuration={raceDurationSample} />
            </Box>
        </>
    );
}