import React from 'react';
import { Box } from '@mui/material';

interface NutritionInfoContainerProps {

}



export const NutritionInfoContainer: React.FC<NutritionInfoContainerProps> = ({ }) => {

    return (
        <Box sx={{
            height: '15rem',
            border: '1px solid black',
            alignContent: 'center',
            marginBottom: '1rem',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'row'
        }}>
            Nutrition Info


        </Box>
    );
}