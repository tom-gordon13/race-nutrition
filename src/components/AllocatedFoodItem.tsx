import React, { useState, useRef, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { dropTargetForElements, monitorForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";


interface FoodItemContainerProps {
    item: AllocatedItem,
}

const margin = 5
const stepSize = 3

const containerDimensions = {
    height: '80px',
    width: '120px',
}

export const AllocatedFoodItem: React.FC<FoodItemContainerProps> = ({ item }) => {
    const allocatedItemRef = useRef<HTMLDivElement | null>(null);
    const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: item.x, y: item.y });
    const [originalPosition, setOriginalPosition] = useState({ x: item.x, y: item.y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const { allocatedItems } = useAllocatedItems();

    useEffect(() => { console.log(position) }, [position])

    const handleClick = () => {
        setIsInEditMode(!isInEditMode);
    };

    useEffect(() => {
        const allocatedItemElement = allocatedItemRef.current;
        invariant(allocatedItemElement);

        return combine(
            dropTargetForElements({
                element: allocatedItemElement,
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
                    // if (args.source.data.cardId !== item.itemId) {
                    //     console.log("onDragEnter", args);
                    // }
                },
            }),
            draggable({
                element: allocatedItemElement,
                getInitialData: () => ({ item }),
                onDragStart: ({ source }) => {
                    setIsDragging(true)
                    console.log('item', source.data)
                },
                onDrop: () => {
                    setIsDragging(false)
                },
            }))
    }, []);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isInEditMode) return;

        if (e.key === 'ArrowRight') {
            setPosition((prev) => ({
                ...prev,
                x: Math.min(parseInt(containerDimensions.width, 10) - margin, prev.x + stepSize),
            }));
        }
        if (e.key === 'ArrowLeft') {
            setPosition((prev) => ({
                ...prev,
                x: Math.max(margin, prev.x - stepSize),
            }));
        }
    };

    useEffect(() => {
        if (isInEditMode) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isInEditMode]);


    return (
        <Box
            ref={allocatedItemRef}
            sx={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                height: containerDimensions.height,
                width: containerDimensions.width,
                padding: '0.5rem',
                backgroundColor: isInEditMode ? 'red' : 'lightgreen',
                border: '1px solid black',
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onDoubleClick={handleClick}
        >
            {item.item_name} - {position.x}, {position.y}
            <Button
                variant="contained"
                color="secondary"
                sx={{ marginTop: '0.5rem', display: isInEditMode ? 'block' : 'none' }}
            >
                Remove
            </Button>
        </Box>
    );
}