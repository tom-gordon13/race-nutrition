import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material'




export const NavMain = () => {
    const theme = useTheme()
    return (
        <Box sx={{
            height: '12vh',
            width: '100%',
            alignContent: 'center',
            marginBottom: '1rem',
            backgroundColor: theme.palette.grey[100]
        }}>
            Race Nutrition
        </Box>
    );
}