import React, { useState, useRef, useEffect, useContext } from 'react';
import { Box, Button } from '@mui/material';
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { useEventContext } from '../context/EventContext';
import { dropTargetForElements, monitorForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { useTheme } from '@mui/material/styles';
import { floatToHoursAndMinutes, getOneMinuteStepSize } from '../utils/float-to-time'


interface FoodItemContainerProps {
    item: AllocatedItem,
}

const margin = 5

const containerDimensions = {
    height: '70px',
    width: '120px',
}

const simulateRect = (rect: DOMRect, newTop: number): DOMRect => ({
    top: newTop,
    bottom: newTop + rect.height,
    left: rect.left,
    right: rect.right,
    width: rect.width,
    height: rect.height,
    x: rect.x,
    y: newTop,
    toJSON: rect.toJSON
});

export const AllocatedFoodItem: React.FC<FoodItemContainerProps> = ({ item }) => {
    const allocatedItemRef = useRef<HTMLDivElement | null>(null);
    const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: item.x, y: item.y });
    const [originalPosition, setOriginalPosition] = useState({ x: item.x, y: item.y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [hasResolved, setHasResolved] = useState(false);
    const { allocatedItems, setAllocatedItems, removeAllocatedItem } = useAllocatedItems();
    const { eventDuration } = useEventContext()

    const theme = useTheme();
    const raceContainer = document.querySelector('#race-container') as HTMLElement;
    const containerWidth = raceContainer.getBoundingClientRect().width
    const stepSize = getOneMinuteStepSize(containerWidth, eventDuration)

    const checkOverlap = (rect1: DOMRect, rect2: DOMRect) => {
        return !(
            rect1.right <= rect2.left ||
            rect1.left >= rect2.right ||
            rect1.bottom <= rect2.top ||
            rect1.top >= rect2.bottom
        );
    };

    const resolveOverlapOnDrop = () => {
        const allocatedItemElement = allocatedItemRef.current;
        if (!allocatedItemElement) return;

        if (!raceContainer) {
            console.error('RaceContainer not found!');
            return;
        }

        const raceContainerRect = raceContainer.getBoundingClientRect();
        const currentRect = allocatedItemElement.getBoundingClientRect();

        const relativeY = currentRect.y - raceContainerRect.y;
        let newY = relativeY;
        let overlapping = false;

        do {
            overlapping = false;

            for (const otherItem of allocatedItems) {
                if (otherItem.instance_id === item.instance_id) continue;

                const otherElement = document.querySelector(
                    `[data-item-id="${otherItem.instance_id}"]`
                ) as HTMLElement;
                if (!otherElement) continue;

                const otherRect = otherElement.getBoundingClientRect();
                const simulatedRect = simulateRect(
                    { ...currentRect, y: newY + raceContainerRect.y },
                    newY + raceContainerRect.y
                );

                if (checkOverlap(simulatedRect, otherRect)) {
                    newY += 75;
                    overlapping = true;
                    break;
                }
            }
        } while (overlapping);


        const absoluteY = newY
        console.log(absoluteY, newY)


        const newPosition = { x: position.x, y: absoluteY }
        setPosition(() => (newPosition));

        const newItem = { ...item, y: absoluteY, x: position.x };
        const newAllocatedItems = [
            ...allocatedItems.filter((itemData) => itemData.instance_id !== item.instance_id),
            { ...newItem },
        ];
        setAllocatedItems(newAllocatedItems);
    };

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
                onDrop: () => { resolveOverlapOnDrop() },
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
                x: Math.min(containerWidth - margin, prev.x + stepSize),
            }));
        }
        if (e.key === 'ArrowLeft') {
            setPosition((prev) => ({
                ...prev,
                x: Math.max(margin, prev.x - stepSize),
            }));
        }
        if (e.key === 'Enter') {
            if (isInEditMode) setIsInEditMode(false)
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
                bgcolor: !isInEditMode ? theme.palette.primary.main : theme.palette.secondary.main,
                '&:hover': {
                    bgcolor: !isInEditMode ? theme.palette.primary.light : theme.palette.secondary.light,
                },
                cursor: isDragging ? 'grabbing' : 'grab',
                borderRadius: 2,
                boxShadow: 3,
                color: 'white',
                fontWeight: 'bold',
            }}
            onDoubleClick={handleClick}
            data-item-id={item.instance_id}
        >
            {/* {item.item_name} - {position.x}, {position.y} */}
            {item.item_name} - {floatToHoursAndMinutes(position.x / containerWidth * eventDuration)}
            <Button
                variant="contained"
                color="secondary"
                sx={{ marginTop: '0.5rem', display: isInEditMode ? 'block' : 'none' }}
                onClick={() => removeAllocatedItem(item.instance_id)}
            >
                Remove
            </Button>
        </Box>
    );
}