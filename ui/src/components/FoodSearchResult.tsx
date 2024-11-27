import React, { useRef, useEffect, useState } from 'react';
import { dropTargetForElements, monitorForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from 'tiny-invariant';
import { Box, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';


interface FoodSearchResult {
    item: any
}

const containerDimensions = {
    height: '70px',
    width: '120px',
}

export const FoodSearchResult: React.FC<FoodSearchResult> = ({ item }) => {
    const theme = useTheme();


    return (
        <Tooltip
            title={
                <>
                    Brand Name: {item.brandName}
                    <br />
                    Brand Owner: {item.brandOwner}
                    <br />
                    Description: {item.description}
                    <br />
                    Category: {item.foodCategory}
                </>
            } arrow>
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
                    fontWeight: 'bold',
                }}
            >
                {item.brandName} - {item.description}
            </Box>
        </Tooltip>
    );
}