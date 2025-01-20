import React, { useRef, useEffect, useState } from 'react';
import { dropTargetForElements, monitorForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from 'tiny-invariant';
import { Box, Button, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getNutrients } from '../../services/get-nutrients-from-redis';
import { NUTRIENT_REFERENCE } from '../../reference/object-mapping/nutrient-mapping';


interface FoodItemCardProps {
    item: { item_id: string, item_name: string, item_brand: string }
    onDropInRaceContainer: (itemId: string, x: number, y: number, item_name: string) => void;
    removeStagedItem: Function
    setIsDraggingStagedItem: (isDraggingStagedItem: boolean) => void
}

const containerDimensions = {
    height: '80px',
    width: '120px',
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, onDropInRaceContainer, removeStagedItem, setIsDraggingStagedItem }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isInEditMode, setIsInEditMode] = useState<boolean>(false)
    const [itemNutrients, setItemNutrients] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const theme = useTheme();

    useEffect(() => {
        const foodItemElement = ref.current;
        invariant(foodItemElement);

        return combine(
            draggable({
                element: foodItemElement,
                getInitialData: () => ({ item }),
                onDragStart: () => {
                    setIsDraggingStagedItem(true)
                    setIsDragging(true)
                },
                onDrop: () => {
                    setIsDraggingStagedItem(false)
                    setIsDragging(false)
                },
            }),
            dropTargetForElements({
                element: foodItemElement,
                getData: ({ input, element, source }) => {
                    const data = { type: "card", cardId: source.data.itemId };

                    return attachClosestEdge(data, {
                        input,
                        element,
                        allowedEdges: ["top", "bottom"],
                    });
                },
                getIsSticky: () => true,
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

    const handleTooltipOpen = async () => {
        if (itemNutrients === null) {
            setLoading(true);
            try {
                const nutrients = await getNutrients(item.item_id);
                const formattedNutrients = nutrients.reduce(
                    (acc: Record<string, string | number>, nutrient: { nutrientName: string; value: number; unitName: string }) => {
                        const roundedValue = Math.round(nutrient.value * 10) / 10;
                        acc[nutrient.nutrientName] = `${roundedValue} ${nutrient.unitName}`;
                        return acc;
                    },
                    {}
                );
                setItemNutrients(formattedNutrients);
            } catch (error) {
                console.error("Failed to fetch nutrients:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const tooltipContent = itemNutrients
        ? Object.entries(itemNutrients)
            .map(([key, value]) => `${NUTRIENT_REFERENCE[key].APP_NAME}: ${value}`)
            .join("\n")
        : loading
            ? "Loading..."
            : "Hover to load nutrients";


    return (
        <Tooltip
            title={<span style={{ whiteSpace: "pre-line" }}>{tooltipContent}</span>}
            arrow
            onOpen={handleTooltipOpen}
        >
            <Box
                ref={ref}
                onDoubleClick={handleDoubleClick}
                sx={{
                    height: containerDimensions.height,
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
        </Tooltip>
    );
}