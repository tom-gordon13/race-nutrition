import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { StagingContainer } from '../components/StagingContainer';
import { RaceContainerTop } from '../components/RaceContainerTop'
import { NavMain } from '../components/NavMain';
import { AllocatedItem } from '../interfaces/AllocatedItem'
import { NutritionInfoContainer } from '../components/NutritionInfoContainer'
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { fetchItem } from '../services/get-item';

const raceDurationSample = 10

export const Home = () => {
    const { allocatedItems, setAllocatedItems } = useAllocatedItems();
    fetchItem('skratch')

    return (
        <>
            <NavMain />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' }}>

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