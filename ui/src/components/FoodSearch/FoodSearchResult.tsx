import React, { useState } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';


interface FoodSearchResult {
    item: any,
    addToStagedItems: Function
}

const containerDimensions = {
    height: '70px',
    width: '120px',
}

const fallbackText = 'N/A'

export const FoodSearchResult: React.FC<FoodSearchResult> = ({ item, addToStagedItems }) => {
    const theme = useTheme();
    const [itemSelected, setItemSelected] = useState<boolean>(false)


    return (
        <Tooltip
            title={
                itemSelected ? <>Item has already been added</> :
                    <>
                        Brand Name: {item.brandName || fallbackText}
                        <br />
                        Brand Owner: {item.brandOwner || fallbackText}
                        <br />
                        Description: {item.description || fallbackText}
                        <br />
                        Category: {item.foodCategory || fallbackText}
                    </>
            } arrow>
            <div>
                <Button
                    onClick={() => {
                        setItemSelected(true)
                        addToStagedItems(item)
                    }
                    }
                    disabled={itemSelected}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            height: containerDimensions.height,
                            width: containerDimensions.width,
                            padding: '0.5rem',
                            bgcolor: itemSelected ? theme.palette.grey[500] : theme.palette.primary.main,
                            '&:hover': {
                                bgcolor: theme.palette.primary.light
                            },
                            borderRadius: 2,
                            boxShadow: 3,
                            color: itemSelected ? 'black' : 'white',
                            fontSize: '10px'
                        }}
                    >
                        {item.brandName || fallbackText} - {item.description || fallbackText}
                    </Box>
                </Button>
            </div>
        </Tooltip>
    );
}