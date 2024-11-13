import React, { useState } from 'react';
import { Box } from '@mui/material';
import { StagingContainer } from '../components/StagingContainer';
import { RaceContainerTop } from '../components/RaceContainerTop'
import { NavMain } from '../components/NavMain';
import { AllocatedItem } from '../interfaces/AllocatedItem'
import { useAllocatedItems } from '../context/AllocatedItemsContext';

const raceDurationSample = 8

export const Home = () => {
    const { allocatedItems, setAllocatedItems } = useAllocatedItems();

    const handleDropInRaceContainer = (itemId: string, x: number, y: number) => {
        setAllocatedItems((prev) => [...prev, { id: itemId, x, y }]);
    };

    const removeAllocatedItem = (itemId: string) => {
        setAllocatedItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    };


    return (
        <>
            <NavMain />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' }}>
                <StagingContainer onDropInRaceContainer={handleDropInRaceContainer} />
                <RaceContainerTop removeAllocatedItem={removeAllocatedItem} raceDuration={raceDurationSample} />
            </Box>
        </>
    );
}