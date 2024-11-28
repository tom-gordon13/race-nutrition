import React, { useEffect, useState } from 'react';
import { Box, Grid, Drawer, Button } from '@mui/material';
import { StagingContainer } from '../components/StagingContainer';
import { RaceContainerTop } from '../components/RaceContainerTop'
import { NavMain } from '../components/NavMain';
import { AllocatedItem } from '../interfaces/AllocatedItem'
import { NutritionInfoContainer } from '../components/NutritionInfoContainer'
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { FoodSearchContainer } from '../components/FoodSearchContainer';
import { postNutrients } from '../services/post-nutrient-to-redis';
import { calculateTotalNutrition } from '../services/calculate-total-nutrition'

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
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [stagedItems, setStagedItems] = useState<StagedItem[]>([])

    const toggleDrawer = (newOpen: boolean) => () => {
        setIsDrawerOpen(newOpen);
    };

    useEffect(() => {
        const fetchNutrients = async () => {
            await calculateTotalNutrition(allocatedItems)
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
                <Button onClick={toggleDrawer(true)}>Search for Items</Button>
                <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)} anchor='right' PaperProps={{
                    sx: {
                        width: "50vw",
                        maxWidth: "50vw",
                        height: "100vh",
                    },
                }}>
                    <FoodSearchContainer addToStagedItems={addToStagedItems} />
                </Drawer>

                <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={8}>
                        <StagingContainer stagedItems={stagedItems} removeStagedItem={removeStagedItem} />
                    </Grid>
                    <Grid item xs={4}>
                        <NutritionInfoContainer />
                    </Grid>
                </Grid>

                <RaceContainerTop raceDuration={raceDurationSample} />

            </Box>
        </>
    );
}