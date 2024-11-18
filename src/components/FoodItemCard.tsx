import React, { useRef, useEffect, useState } from 'react';
import { dropTargetForElements, monitorForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from 'tiny-invariant';
import { Box } from '@mui/material';


interface FoodItemCardProps {
    item: { itemId: string, item_name: string }
    onDropInRaceContainer: (itemId: string, x: number, y: number, item_name: string) => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, onDropInRaceContainer }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

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
                    if (args.source.data.cardId !== item.itemId) {
                        console.log("onDragEnter", args);
                    }
                },
            })
        )
    }, [item]);

    return (
        <Box
            ref={ref}
            sx={{
                position: 'relative',
                height: '4rem',
                width: '8rem',
                backgroundColor: isDragging ? "rgba(211, 211, 211, 0.5)" : "lightgray",
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                marginBottom: '1rem',
            }}
        >
            {item.item_name}
        </Box>
    );
}