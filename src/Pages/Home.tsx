import React, { useState } from 'react';
import { StagingContainer } from '../components/StagingContainer';
import { RaceContainerTop } from '../components/RaceContainerTop'
import { NavMain } from '../components/NavMain';
import { Box } from '@mui/material';

interface DroppedItem {
    id: string;
    x: number;
    y: number;
}

export const Home = () => {
    const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);

    const handleDropInRaceContainer = (itemId: string, x: number, y: number) => {
        setDroppedItems((prev) => [...prev, { id: itemId, x, y }]);
    };


    return (
        <>
            <NavMain />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' }}>
                <StagingContainer onDropInRaceContainer={handleDropInRaceContainer} />
                <RaceContainerTop droppedItems={droppedItems} />
            </Box>
        </>
    );
}