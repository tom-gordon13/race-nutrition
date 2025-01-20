import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { FoodItemCard } from './FoodItemCard';
import { useAllocatedItems } from '../../context/AllocatedItemsContext';
import { StagedItem } from '../../pages/Home';
import { useTheme } from '@mui/material/styles';

interface StagingContainerProps {
    stagedItems: StagedItem[]
    setStagedItems: Function
    removeStagedItem: Function
    setIsDraggingStagedItem: (isDraggingStagedItem: boolean) => void
    toggleDrawer: (newOpen: boolean) => void
    isCustomItemDialogOpen: boolean
    setIsCustomItemDialogOpen: Function
}



export const StagingContainer: React.FC<StagingContainerProps> = ({ stagedItems, setStagedItems, removeStagedItem, setIsDraggingStagedItem, toggleDrawer, isCustomItemDialogOpen, setIsCustomItemDialogOpen }) => {
    const { handleDropInRaceContainer } = useAllocatedItems()
    const theme = useTheme()

    return (
        <Box
            sx={{
                height: '15rem',
                width: '100%',
                border: `2px solid ${theme.palette.grey[300]}`,
                alignContent: 'center',
                marginBottom: '1rem',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'row',
                gap: '1%',
                borderRadius: 2,
            }}
        >
            <Box
                sx={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    gap: '10%',
                    padding: '1%'
                }}
            >
                <Button
                    onClick={() => toggleDrawer(true)}
                    variant="contained"
                    color="success"
                    sx={{ height: '40%' }}
                >
                    Search for Items
                </Button>
                <Button
                    onClick={() => setIsCustomItemDialogOpen(true)}
                    variant="contained"
                    sx={{ height: '40%' }}
                >
                    Add Custom Item
                </Button>
                <Button
                    onClick={() => setStagedItems([])}
                    variant="outlined"
                    color="error"
                    sx={{ height: '25%' }}
                >
                    Clear Items
                </Button>
            </Box>

            <Box
                sx={{
                    flex: '3',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: '15px',
                    overflow: 'hidden',
                    height: '100%',
                    paddingTop: '50px',
                    paddingLeft: '20px',
                    bgcolor: "rgba(211, 211, 211, 0.5)"
                }}
            >
                {stagedItems.map((item) => (
                    <Box
                        key={item.item_id}
                        sx={{
                            flex: '0 1 calc(100% / 6 - 10px)',
                            maxWidth: 'calc(100% / 6 - 10px)',
                            height: 'calc(100% / 4 - 50px)',
                            maxHeight: 'calc(100% / 4 - 50px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxSizing: 'border-box',
                        }}
                    >
                        <FoodItemCard
                            item={item}
                            onDropInRaceContainer={handleDropInRaceContainer}
                            removeStagedItem={removeStagedItem}
                            setIsDraggingStagedItem={setIsDraggingStagedItem}
                        />
                    </Box>
                ))}
            </Box>

        </Box>

    );
}