import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { SingleHourNutrition, useNutrition } from '../../context/NutritionContext';
import { useAllocatedItems } from '../../context/AllocatedItemsContext';
import { nutrientMapping, nutrientsToShow, NUTRIENT_REFERENCE } from '../../reference/object-mapping/nutrient-mapping'


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
                Object.entries(currHourNutrition)
                    .filter(([key]) => nutrientsToShow.includes(key))
                    .map(([key, value]) => (
                        <Box key={key} sx={{ marginBottom: '2px' }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: '12px',
                                    marginBottom: 0,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <strong>{NUTRIENT_REFERENCE[key].APP_NAME || key}:</strong> {Number(value.volume).toFixed(1)} {NUTRIENT_REFERENCE[key].UNITS}
                            </Typography>
                        </Box>
                    ))
            ) : (
                <Typography variant="body1">N/A</Typography>
            )}
        </Box>
    );
}