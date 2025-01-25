import React, { useState, useRef, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { useNutrition } from '../context/NutritionContext';
import { useEventContext } from '../context/EventContext';
import { dropTargetForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { useTheme } from '@mui/material/styles';
import { floatToHours, floatToHoursAndMinutes, getOneMinuteStepSize } from '../utils/float-to-time'


interface FoodItemContainerProps {
    item: AllocatedItem;
    linePositions: number[];
    onLineCross: (item: AllocatedItem, previousLine: number | null, currentLine: number | null) => void;
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

export const AllocatedFoodItem: React.FC<FoodItemContainerProps> = ({ item, linePositions, onLineCross }) => {
    const allocatedItemRef = useRef<HTMLDivElement | null>(null);
    const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
    const isInEditModeRef = useRef<boolean>(false);
    const [editModePreviousHour, setEditModePreviousHour] = useState<number | null>(null)
    const [position, setPosition] = useState({ x: item.x, y: item.y });
    const [isDragging, setIsDragging] = useState(false);
    const { allocatedItems, setAllocatedItems, removeAllocatedItem } = useAllocatedItems();
    const { addItemToHourly, removeItemFromHourly, updateNutritionByHour } = useNutrition()
    const { eventDuration } = useEventContext()
    const previousLine = useRef<number | null>(null);

    const theme = useTheme();
    const raceContainer = document.querySelector('#race-container') as HTMLElement;
    const raceContainerRect = raceContainer.getBoundingClientRect()
    const containerWidth = raceContainerRect.width
    const stepSize = getOneMinuteStepSize(containerWidth, eventDuration)

    const adjustCoordinatesKeyboard = (initialX: number, initialY: number, instance_id: number) => {

        let x = initialX
        let y = 3;

        let overlapping = true;
        while (overlapping) {
            overlapping = false;

            for (const allocatedItem of allocatedItems) {
                if (allocatedItem.instance_id === instance_id) continue;
                const isHorizontalOverlap =
                    Math.abs(allocatedItem.x - x) < parseInt(containerDimensions.width);
                const isVerticalOverlap =
                    Math.abs(allocatedItem.y - y) < parseInt(containerDimensions.height);
                if (isHorizontalOverlap && isVerticalOverlap) {
                    y += parseInt(containerDimensions.height) + 3;
                }
            }
        }

        return { x: x, y: y };
    };

    const checkOverlap = (rect1: DOMRect, rect2: DOMRect) => {
        const horizontalOverlap = rect1.right <= rect2.left || rect1.left >= rect2.right
        const verticalOverlap = rect1.bottom <= rect2.top || rect1.top >= rect2.bottom

        return horizontalOverlap && verticalOverlap
    };

    const resolveOverlapOnDrop = (keydown: boolean = false) => {
        const allocatedItemElement = allocatedItemRef.current;
        if (!allocatedItemElement) return;

        if (!raceContainer) {
            console.error('RaceContainer not found!');
            return;
        }

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
                    newY += 750;
                    overlapping = true;
                    break;
                }
            }
        } while (overlapping);


        const absoluteY = newY

        const newPosition = { x: position.x, y: absoluteY }
        setPosition(() => (newPosition));
        if (keydown) return

        const newItem = { ...item, y: absoluteY, x: position.x };
        const newAllocatedItems = [
            ...allocatedItems.filter((itemData) => itemData.instance_id !== item.instance_id),
            { ...newItem },
        ];
        setAllocatedItems(newAllocatedItems);
    };

    const handleClick = () => {
        const currentLine = linePositions.findIndex((line) => position.x < line);
        if (!isInEditModeRef.current) {
            setEditModePreviousHour(currentLine)
        } else {
            try {
                const adjustedCoordinates = adjustCoordinatesKeyboard(position.x, position.y, item.instance_id as number)
                setPosition(() => ({ x: adjustedCoordinates.x, y: adjustedCoordinates.y }));

                setAllocatedItems((prevItems) =>
                    prevItems.map((allocatedItem) =>
                        allocatedItem.instance_id === item.instance_id
                            ? { ...allocatedItem, x: adjustedCoordinates.x, y: adjustedCoordinates.y }
                            : allocatedItem
                    )
                );
                addItemToHourly(item.item_id, currentLine!, 1)
                updateNutritionByHour(currentLine!)
                removeItemFromHourly(item.item_id, editModePreviousHour || currentLine)
            } catch {
                console.log('There was an error')
            }

        }

        isInEditModeRef.current = !isInEditModeRef.current;
        setIsInEditMode(isInEditModeRef.current);
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
                getIsSticky: () => true,
                onDrop: () => {
                    resolveOverlapOnDrop()
                },
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
                },
                onDrop: () => {
                    setIsDragging(false)
                },
            }))
    }, []);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isInEditModeRef.current) return;

        setPosition((prev) => {
            let newX = prev.x;

            if (e.key === 'ArrowRight') {
                newX = Math.min(containerWidth - margin, prev.x + stepSize);
            } else if (e.key === 'ArrowLeft') {
                newX = Math.max(margin, prev.x - stepSize);
            }

            return { ...prev, x: newX };
        });
    };


    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => handleKeyDown(e);
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

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
                    width: '200px'
                },
                cursor: isDragging ? 'grabbing' : 'grab',
                borderRadius: 2,
                boxShadow: 3,
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                overflow: 'hidden',
                transition: 'width 0.3s ease',
            }}
            onDoubleClick={handleClick}
            data-item-id={item.instance_id}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '4px', // Adjust to align with the box edges
                    right: '4px',
                    display: isInEditMode ? 'block' : 'none',
                }}
            >
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        minWidth: '20px',
                        height: '20px',
                        padding: 0,
                        fontSize: '12px',
                        lineHeight: 1,
                        borderRadius: '50%',
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}
                    onClick={() => {
                        removeAllocatedItem(item.instance_id)
                        removeItemFromHourly(item.item_id, floatToHours((position.x / containerWidth) * eventDuration + 1))
                    }}
                >
                    X
                </Button>
            </Box>
            {floatToHoursAndMinutes((position.x / containerWidth) * eventDuration)}
            <br />
            {item.item_name}
        </Box>
    );
}