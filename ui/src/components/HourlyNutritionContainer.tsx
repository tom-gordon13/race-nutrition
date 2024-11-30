import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { SingleHourNutrition, useNutrition } from '../context/NutritionContext';
import { useAllocatedItems } from '../context/AllocatedItemsContext';


interface HourlyNutritionContainerProps {
    hourNumber: number
}

export const HourlyNutritionContainer: React.FC<HourlyNutritionContainerProps> = ({ hourNumber }) => {
    const { hourlyNutrition } = useNutrition()
    const { allocatedItems } = useAllocatedItems()
    const [currHourNutrition, setCurrHourNutrition] = useState<SingleHourNutrition>({})

    useEffect(() => {
        setCurrHourNutrition(hourlyNutrition[hourNumber] || {});
    }, [hourlyNutrition, hourNumber, allocatedItems]);


    return (
        <Box>
            {Object.keys(currHourNutrition).length > 0 ? (
                Object.entries(currHourNutrition).map(([key, value]) => (
                    <Box key={key} sx={{ marginBottom: '2px' }}>
                        <Typography variant="body1" sx={{
                            fontSize: '12px',
                            marginBottom: 0
                        }}>
                            <strong>{key}</strong>: {value.volume} {value.unit}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="body1">N/A</Typography>
            )}
        </Box>
    );
}