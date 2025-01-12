import React, { useEffect, useState } from 'react';
import { Box, Grid, Drawer, Button, Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import { StagingContainer } from '../components/StagingContainer';
import { RaceContainerTop } from '../components/RaceContainerTop'
import { NavMain } from '../components/NavMain';
import { useTheme } from '@mui/material/styles';
import { NutritionInfoContainer } from '../components/NutritionInfoContainer'
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { FoodSearchContainer } from '../components/FoodSearchContainer';
import { postNutrients } from '../services/post-nutrient-to-redis';
import { calculateTotalNutrition } from '../services/calculate-total-nutrition'
import { HourlyNutritionContainer } from '../components/HourlyNutritionContainer';
import { NutritionAccordion } from '../components/NutritionAccordion';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const raceDurationSample = 10

export interface StagedItem {
    item_id: string,
    item_name: string,
    item_brand: string
}

export interface searchedItem {
    fdcId?: string
    description?: string
    brandName?: string
}

export const Home = () => {
    const { allocatedItems, setAllocatedItems } = useAllocatedItems();
    const theme = useTheme()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [stagedItems, setStagedItems] = useState<StagedItem[]>([])
    const [totalNutrition, setTotalNutrition] = useState<Record<string, { totalValue: number; unitName: string; }>>({})
    const [isDraggingStagedItem, setIsDraggingStagedItem] = useState<boolean>(false)
    const [searchResults, setSearchResults] = useState<object[]>([])

    const lineCount = raceDurationSample + 1;

    const toggleDrawer = (newOpen: boolean) => {
        console.log('open')
        setIsDrawerOpen(newOpen);
    };

    useEffect(() => {
        const fetchNutrients = async () => {
            const nutrientSet = await calculateTotalNutrition(allocatedItems)
            setTotalNutrition(nutrientSet)
        }
        fetchNutrients()
    }, [allocatedItems])

    const addToStagedItems = (item: searchedItem) => {
        const newItem = {
            item_id: item?.fdcId || '',
            item_name: item?.description || '',
            item_brand: item?.brandName || ''
        }

        postNutrients(item)

        setStagedItems([...stagedItems, newItem])
    }

    const removeStagedItem = (item: StagedItem) => {
        const newStageditems = stagedItems.filter((stagedItem) => item.item_id !== stagedItem.item_id)
        setStagedItems([...newStageditems])
    }

    return (
        <>
            <NavMain />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' }}>
                <Drawer open={isDrawerOpen} onClose={() => toggleDrawer(false)} anchor='right' PaperProps={{
                    sx: {
                        width: "50vw",
                        maxWidth: "50vw",
                        height: "100vh",
                    },
                }}>
                    <FoodSearchContainer addToStagedItems={addToStagedItems} searchResults={searchResults} setSearchResults={setSearchResults} />
                </Drawer>

                <Grid container spacing={2} alignItems="flex-start" justifyContent='center' sx={{ margin: '1rem 10rem' }}>
                    <Grid item xs={9}>
                        <StagingContainer stagedItems={stagedItems} setStagedItems={setStagedItems} removeStagedItem={removeStagedItem} setIsDraggingStagedItem={setIsDraggingStagedItem} toggleDrawer={toggleDrawer} />
                        {/* <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10%', height: '200px' }}>
                            <Button onClick={toggleDrawer(true)} variant='contained'
                                sx={{
                                    height: '40%'
                                }}>Search for Items
                            </Button>

                            <Button onClick={() => { console.log('clear items') }} variant='outlined' sx={{
                                height: '25%'
                            }}>Clear Items</Button>
                        </Grid> */}
                    </Grid>
                </Grid>
                <NutritionAccordion isDraggingStagedItem={isDraggingStagedItem} />
                <RaceContainerTop raceDuration={raceDurationSample} />

            </Box >
        </>
    );
}