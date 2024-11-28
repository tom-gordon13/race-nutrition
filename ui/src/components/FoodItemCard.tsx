import React, { useRef, useEffect, useState } from 'react';
import { dropTargetForElements, monitorForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from 'tiny-invariant';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getNutrients } from '../services/get-nutrients-from-redis';


interface FoodItemCardProps {
    item: { item_id: string, item_name: string, item_brand: string }
    onDropInRaceContainer: (itemId: string, x: number, y: number, item_name: string) => void;
    removeStagedItem: Function
}

const containerDimensions = {
    height: '70px',
    width: '120px',
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, onDropInRaceContainer, removeStagedItem }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isInEditMode, setIsInEditMode] = useState<boolean>(false)
    const theme = useTheme();

    useEffect(() => {
        const foodItemElement = ref.current;
        invariant(foodItemElement);

        return combine(
            draggable({
                element: foodItemElement,
                getInitialData: () => ({ item }),
                onDragStart: () => setIsDragging(true),
                onDrop: () => {
                    setIsDragging(false)
                },
            }),
            dropTargetForElements({
                element: foodItemElement,
                getData: ({ input, element, source }) => {
                    // To attach card data to a drop target
                    const data = { type: "card", cardId: source.data.itemId };

                    // Attaches the closest edge (top or bottom) to the data object
                    // This data will be used to determine where to drop card relative
                    // to the target card.
                    return attachClosestEdge(data, {
                        input,
                        element,
                        allowedEdges: ["top", "bottom"],
                    });
                },
                getIsSticky: () => true, // To make a drop target "sticky"
                onDragEnter: (args) => {
                    if (args.source.data.cardId !== item.item_id) {
                        console.log("onDragEnter", args);
                    }
                },
            })
        )
    }, [item]);

    const handleDoubleClick = () => {
        setIsInEditMode(!isInEditMode);
    };

    return (
        <Box
            ref={ref}
            onDoubleClick={handleDoubleClick}
            sx={{
                width: containerDimensions.width,
                padding: '0.5rem',
                bgcolor: isDragging ? "rgba(211, 211, 211, 0.5)" : theme.palette.primary.main,
                '&:hover': {
                    bgcolor: theme.palette.primary.light
                },
                cursor: isDragging ? 'grabbing' : 'grab',
                borderRadius: 2,
                boxShadow: 3,
                color: 'white',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isInEditMode ? 0.5 : 1,
            }}
        >
            {isInEditMode && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeStagedItem(item)}
                    sx={{
                        position: "absolute",
                        zIndex: 12,
                        color: 'black',
                        fontSize: '10px',
                    }}
                >
                    Remove
                </Button>
            )}
            {item.item_brand} - {item.item_name}
        </Box>
    );
}