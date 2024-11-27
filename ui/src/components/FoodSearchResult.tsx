import React, { useRef, useEffect, useState } from 'react';
import { dropTargetForElements, monitorForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from 'tiny-invariant';
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


    return (
        <Tooltip
            title={
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
            <Button
                onClick={() => addToStagedItems(item)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        height: containerDimensions.height,
                        width: containerDimensions.width,
                        padding: '0.5rem',
                        bgcolor: theme.palette.primary.main,
                        '&:hover': {
                            bgcolor: theme.palette.primary.light
                        },
                        borderRadius: 2,
                        boxShadow: 3,
                        color: 'white',
                        fontSize: '10px'
                    }}
                >
                    {item.brandName || fallbackText} - {item.description || fallbackText}
                </Box>
            </Button>
        </Tooltip>
    );
}