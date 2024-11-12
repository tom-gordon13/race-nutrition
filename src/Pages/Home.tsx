import React, { useState } from 'react';
import { Box } from '@mui/material';
import { StagingContainer } from '../components/StagingContainer';
import { RaceContainerTop } from '../components/RaceContainerTop'
import { NavMain } from '../components/NavMain';
import { AllocatedItem } from '../interfaces/AllocatedItem'


export const Home = () => {
    const [allocatedItems, setAllocatedItems] = useState<AllocatedItem[]>([]);

    const handleDropInRaceContainer = (itemId: string, x: number, y: number) => {
        setAllocatedItems((prev) => [...prev, { id: itemId, x, y }]);
    };


    return (
        <>
            <NavMain />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' }}>
                <StagingContainer onDropInRaceContainer={handleDropInRaceContainer} />
                <RaceContainerTop allocatedItems={allocatedItems} />
            </Box>
        </>
    );
}