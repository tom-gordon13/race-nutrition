import React from 'react';
import { Box } from '@mui/material';

interface NutritionInfoContainerProps {
    totalNutrition: Record<string, { totalValue: number; unitName: string; }>;
}



export const NutritionInfoContainer: React.FC<NutritionInfoContainerProps> = ({ totalNutrition }) => {

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
            {Object.entries(totalNutrition).map(([nutrientName, nutrientValues]) => (
                <h2 key={nutrientName}>
                    {nutrientName}: {nutrientValues.totalValue}{nutrientValues.unitName}
                </h2>
            ))}


        </Box>
    );
}