import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useEventContext } from '../context/EventContext';
import { HourlyNutritionContainer } from './HourlyNutritionContainer';

interface NutritionAccordionProps {
    isDraggingStagedItem: boolean
}

export const NutritionAccordion: React.FC<NutritionAccordionProps> = ({ isDraggingStagedItem }) => {
    const { eventDuration } = useEventContext()
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [wasExpanded, setWasExpanded] = useState<boolean>(false)

    const lineCount = eventDuration + 1

    useEffect(() => {
        if (isDraggingStagedItem) {
            if (isExpanded) {
                setWasExpanded(true);
                setIsExpanded(false);
            }
        } else {
            if (wasExpanded) {
                setIsExpanded(true);
                setWasExpanded(false);
            }
        }
    }, [isDraggingStagedItem, isExpanded, wasExpanded]);

    return (

        <Accordion
            expanded={isExpanded}
            onChange={() => setIsExpanded(!isExpanded)}
        >
            <AccordionSummary
                // expandIcon={<ArrowDownwardIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                    width: '90rem',
                    minHeight: '80px',
                    height: '10vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '2rem',
                    // backgroundColor: theme.palette.primary.light,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography>Hourly Nutrition Info</Typography>
                <div style={{
                    marginTop: '20px'
                }}>
                    {[...Array(lineCount)].map((_, index) => (
                        (index !== lineCount - 1) ?
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${(index * 100) / (lineCount - 1)}%`,
                                    width: `${100 / lineCount}%`,

                                }}
                                key={index + '_line'}
                            >
                                <h3
                                    style={{
                                        fontSize: '20px',
                                        borderBottom: '2px black solid'
                                    }}>{index + 1}</h3>
                            </div> : null
                    ))}
                </div>
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    height: "300px",
                    maxHeight: "300px",
                    overflow: "auto",
                }}>
                {[...Array(lineCount)].map((_, index) => (
                    (index !== lineCount - 1) ?
                        <div
                            style={{
                                position: 'absolute',
                                left: `${(index * 100) / (lineCount - 1)}%`,
                                width: `${100 / lineCount}%`,
                            }}
                            key={index + '_container'}
                        >
                            <HourlyNutritionContainer hourNumber={index + 1} />
                        </div> : null
                ))}
            </AccordionDetails>
        </Accordion>
    );
}