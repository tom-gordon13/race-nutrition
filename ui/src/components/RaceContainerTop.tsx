import { Box } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';
import { AllocatedFoodItem } from './AllocatedFoodItem'
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from 'tiny-invariant';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '@mui/material/styles';
import { useNutrition } from '../context/NutritionContext';
import { useEventContext } from '../context/EventContext';
import { floatToHours } from '../utils/float-to-time';
import useMediaQuery from '@mui/material/useMediaQuery';
import { calculateTotalNutrition } from '../services/calculate-total-nutrition';


interface RaceContainerTopProps {
    raceDuration: number
}

const containerDimensions = {
    width: '90rem',
    height: '25rem'
}

const allocatedItemDimensions = {
    height: '70px',
    width: '120px',
}

const isValid = true

export const RaceContainerTop: React.FC<RaceContainerTopProps> = ({ raceDuration }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
    const { allocatedItems, setAllocatedItems } = useAllocatedItems();
    const { addItemToHourly, removeItemFromHourly, updateNutritionByHour } = useNutrition()
    const { eventDuration } = useEventContext()


    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const adjustCoordinates = (initialX: number, initialY: number, instance_id: number) => {
        const containerTop = containerRef?.current?.offsetTop ?? 0;
        const containerLeft = containerRef?.current?.offsetLeft ?? 0;
        const containerRect = containerRef?.current?.getBoundingClientRect();

        let x = initialX - containerLeft - mouseOffset.x;
        let y = 3;

        let overlapping = true;
        while (overlapping) {
            overlapping = false;

            for (const allocatedItem of allocatedItems) {
                if (allocatedItem.instance_id === instance_id) continue;
                const isHorizontalOverlap =
                    Math.abs(allocatedItem.x - x) < parseInt(allocatedItemDimensions.width);
                const isVerticalOverlap =
                    Math.abs(allocatedItem.y - y) < parseInt(allocatedItemDimensions.height);
                if (isHorizontalOverlap && isVerticalOverlap) {
                    y += parseInt(allocatedItemDimensions.height) + 3;
                    overlapping = false;
                }
            }
        }

        return { x: x, y: y };
    };

    const checkValidDrop = (x: number, y: number) => {
        invariant(containerRef?.current?.clientHeight);
        const valid_y = containerRef.current.clientHeight > y && y > 0
        const valid_x = containerRef.current.clientWidth > x && x > 0
        return valid_x && valid_y
    }

    useEffect(() => {
        const containerElement = containerRef.current;
        invariant(containerElement);

        return dropTargetForElements({
            element: containerElement,
            getData: ({ input, element, source }) => {
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
            onDragStart: ({ source, location }) => {
                setIsDraggedOver(true)
                invariant(containerRef?.current);
                const itemData: { item_id: string, item_name: string, instance_id: number | undefined, x: number } = source.data.item as { item_id: string; item_name: string, instance_id: number | undefined, x: number }
                removeItemFromHourly(itemData.item_id, floatToHours(itemData.x / containerRef.current.clientWidth * eventDuration) + 1)
                if (source.element) {
                    const rect = source.element.getBoundingClientRect();
                    const mouseOffset = {
                        x: location.current.input.clientX - rect.left,
                        y: location.current.input.clientY - rect.top,
                    };
                    setMouseOffset(mouseOffset)
                } else {
                    console.error("Source element is not available in onDragStart");
                }
            },
            onDragEnter: () => {
                if (isValid) setIsDraggedOver(true)
            },
            onDragLeave: ({ source }) => {
                setIsDraggedOver(false)
            },
            onDrop: ({ source, location }) => {
                const itemData: { item_id: string, item_name: string, instance_id: number | undefined } = source.data.item as { item_id: string; item_name: string, instance_id: number | undefined }
                const adjustedCoordinates = adjustCoordinates(location.current.input.clientX, location.current.input.clientY, itemData.instance_id as number)
                const isValidDrop = checkValidDrop(adjustedCoordinates.x, adjustedCoordinates.y)
                if (isValidDrop) {
                    invariant(containerRef?.current);
                    const hour = floatToHours(adjustedCoordinates.x / containerRef.current.clientWidth * eventDuration)
                    addItemToHourly(itemData.item_id, hour, 1)
                    updateNutritionByHour(hour)
                    const isUpdate = !!itemData.instance_id
                    const newInstanceId = allocatedItems.length + 1
                    const newItem = { item_id: itemData.item_id, instance_id: isUpdate ? itemData.instance_id || 0 : newInstanceId, item_name: itemData.item_name, x: adjustedCoordinates.x, y: adjustedCoordinates.y }
                    let newAllocatedItems: AllocatedItem[] = []
                    if (isValidDrop && !isUpdate) newAllocatedItems = [...allocatedItems, newItem];
                    if (isValidDrop && isUpdate) newAllocatedItems = [...allocatedItems.filter((item) => item.instance_id !== itemData.instance_id), { ...newItem }];
                    setAllocatedItems([...newAllocatedItems])
                }
                setIsDraggedOver(false)
            },
        });
    }, [allocatedItems]);

    const handleDragLeave = (e: any) => {
        if (e.relatedTarget === null || !e.currentTarget.contains(e.relatedTarget)) {
            setIsDraggedOver(false);
        }
    };

    const lineCount = raceDuration + 1;

    const getLinePositions = () => {
        if (!containerRef.current) return [];
        const containerWidth = containerRef.current.offsetWidth;
        return Array.from({ length: lineCount - 2 }, (_, index) => {
            return (index + 1) * (containerWidth / (lineCount - 1));
        });
    };

    const linePositions = getLinePositions();

    const handleLineCross = (item: AllocatedItem, previousLine: number | null, currentLine: number | null) => {
        if (previousLine === currentLine) {
            return;
        }

        const direction = previousLine !== null && currentLine !== null
            ? (currentLine > previousLine ? "right" : "left")
            : null;

        if (currentLine !== null && linePositions[currentLine] === item.x) {
            if (direction === "right") {
                return;
            }
        }

        if (previousLine) {
            console.log(`Item came from hour ${previousLine! + 1} and moved into hour ${currentLine! + 1}`)

            // addItemToHourly(item.item_id, floatToHours(currentLine! + 1), 1)
            // updateNutritionByHour(hour)
            // removeItemFromHourly(item.item_id, floatToHours(previousLine! + 1))
        }
    };
    return (
        <Box
            id="race-container"
            ref={containerRef}
            onDragLeave={handleDragLeave}
            onDragOver={() => setIsDraggedOver(true)}
            sx={{
                position: 'relative',
                padding: '1rem',
                border: `1px solid ${theme.palette.grey[300]}`,
                width: {
                    sm: containerDimensions.width,
                    xs: containerDimensions.height
                },
                height: {
                    sm: containerDimensions.height,
                    xs: containerDimensions.width,
                },
                marginTop: '1rem',
                display: 'flex',
                flexDirection: {
                    xs: 'row',
                    sm: 'column',
                },
                alignItems: 'center',
                bgcolor: isDraggedOver ? 'skyblue' : theme.palette.grey[500],
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            {[...Array(lineCount)].map((_, index) => {
                if (index === 0 || index === lineCount - 1) return null;

                if (isMobile) {
                    return (
                        <Box
                            key={index}
                            sx={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: `${(index * 100) / (lineCount - 1)}%`,
                                height: '1px',
                                bgcolor: 'white',
                            }}
                        />
                    );
                } else {
                    return (
                        <Box
                            key={index}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: `${(index * 100) / (lineCount - 1)}%`,
                                width: '1px',
                                bgcolor: 'white',
                            }}
                        />
                    );
                }
            })}
            {
                allocatedItems.map((item) => (
                    <AllocatedFoodItem key={uuidv4()} item={item} linePositions={linePositions}
                        onLineCross={handleLineCross} />
                ))
            }
        </Box >
    );
};