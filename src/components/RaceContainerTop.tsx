import { Box } from '@mui/material';
import React from 'react';

interface DroppedItem {
    id: string;
    x: number;
    y: number;
}

interface RaceContainerTopProps {
    droppedItems: DroppedItem[];
}


export const RaceContainerTop: React.FC<RaceContainerTopProps> = ({ droppedItems }) => {
    return (
        <Box
            id="race-container"
            sx={{
                padding: '1rem',
                border: '1px solid green',
                width: '90%',
                height: '25rem',
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <h3>Race Container</h3>
            {droppedItems.map((item, index) => (
                <Box
                    key={index}
                    sx={{
                        position: 'absolute',
                        top: item.y,
                        left: item.x,
                        padding: '0.5rem',
                        backgroundColor: 'lightgreen',
                        border: '1px solid black'
                    }}
                >
                    {item.id}
                </Box>
            ))}
        </Box>
    );
};