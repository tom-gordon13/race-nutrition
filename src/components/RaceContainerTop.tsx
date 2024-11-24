import { Box } from '@mui/material';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AllocatedFoodItem } from './AllocatedFoodItem'
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from 'tiny-invariant';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '@mui/material/styles';


interface RaceContainerTopProps {
    raceDuration: number
}

interface DropEvent {
    source: any;
    location: any;
    input: any
}

interface DragStartEvent {
    source: any,
    input: any
}

const containerDimensions = {
    width: '90rem',
    height: '25rem'
}

const allocatedItemDimensions = {
    height: '70px',
    width: '120px',
}

const remToPixels = (rem: string): number => {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize); // Get root font size
    return parseFloat(rem) * rootFontSize; // Convert rem to a number and multiply by root font size
};

const isValid = true

export const RaceContainerTop: React.FC<RaceContainerTopProps> = ({ raceDuration }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
    const { allocatedItems, setAllocatedItems } = useAllocatedItems();

    const theme = useTheme();

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
                    // break;
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
                if (source.element) {
                    const rect = source.element.getBoundingClientRect();
                    const mouseOffset = {
                        x: location.current.input.clientX - rect.left,
                        y: location.current.input.clientY - rect.top,
                    };
                    console.log("Source:", source, "Bounding Rect:", rect, "Mouse Offset:", mouseOffset);
                    setMouseOffset(mouseOffset)
                } else {
                    console.error("Source element is not available in onDragStart");
                }
            },
            onDragEnter: () => {
                if (isValid) setIsDraggedOver(true)
            },
            onDragLeave: () => {
                setIsDraggedOver(false)
            },
            onDrop: ({ source, location }) => {
                const itemData: { item_id: string, item_name: string, instance_id: number | undefined } = source.data.item as { item_id: string; item_name: string, instance_id: number | undefined }
                const adjustedCoordinates = adjustCoordinates(location.current.input.clientX, location.current.input.clientY, itemData.instance_id as number)
                const isValidDrop = checkValidDrop(adjustedCoordinates.x, adjustedCoordinates.y)
                if (isValidDrop) {
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

    // useEffect(() => {
    //     return monitorForElements({
    //         onDrop: handleDrop
    //     });
    // }, []);
    const handleDragLeave = (e: any) => {
        if (e.relatedTarget === null || !e.currentTarget.contains(e.relatedTarget)) {
            setIsDraggedOver(false);
            console.log('leave');
        }
    };

    const lineCount = raceDuration + 1;

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
                width: containerDimensions.width,
                height: containerDimensions.height,
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: isDraggedOver ? 'skyblue' : theme.palette.grey[500],
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            {[...Array(lineCount)].map((_, index) => (
                (index !== 0 && index !== lineCount - 1) ?
                    <div>
                        <h3 style={{
                            position: 'absolute',
                            left: `${(index * 100) / (lineCount - 1)}%`,
                            bottom: containerRef?.current?.clientHeight || '400px',
                            fontSize: '20px'
                        }}>{index}</h3>
                        < Box
                            key={index}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: `${(index * 100) / (lineCount - 1)}%`,
                                width: '1px',
                                bgcolor: 'white ',
                            }}
                        /> </div> : null
            ))}
            {
                allocatedItems.map((item) => (
                    <AllocatedFoodItem key={uuidv4()} item={item} />
                ))
            }
        </Box >
    );
};