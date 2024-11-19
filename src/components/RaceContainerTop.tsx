import { Box } from '@mui/material';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AllocatedFoodItem } from './AllocatedFoodItem'
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from 'tiny-invariant';
import { v4 as uuidv4 } from 'uuid';
import { BaseEventPayload, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';


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

const conatinerDimensions = {
    width: '90rem',
    height: '25rem'
}

const isValid = true

export const RaceContainerTop: React.FC<RaceContainerTopProps> = ({ raceDuration }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
    const { allocatedItems, setAllocatedItems } = useAllocatedItems();

    const adjustCoordinates = (initialX: number, initialY: number) => {
        const containerTop = containerRef?.current?.offsetTop ?? 0;
        const containerLeft = containerRef?.current?.offsetLeft ?? 0;

        return {
            x: initialX - containerLeft - mouseOffset.x,
            y: initialY - containerTop - mouseOffset.y,
        };
    };

    const checkValidDrop = (x: number, y: number) => {
        invariant(containerRef?.current?.clientHeight);
        const valid_y = containerRef.current.clientHeight > y && y > 0
        const valid_x = containerRef.current.clientWidth > x && x > 0
        return valid_x && valid_y
    }

    const handleDrop = ({ input, source }: DropEvent) => {
        const adjustedCoordinates = adjustCoordinates(input.clientX, input.clientY);
        console.log("Adjusted Coordinates:", adjustedCoordinates);

        const itemData: { item_id: string; item_name: string; instance_id?: number } = source.data.item;

        const isUpdate = !!itemData.instance_id;
        const newInstanceId = isUpdate ? itemData.instance_id! : allocatedItems.length + 1;

        const newItem: AllocatedItem = {
            item_id: itemData.item_id,
            item_name: itemData.item_name,
            instance_id: newInstanceId,
            x: adjustedCoordinates.x,
            y: adjustedCoordinates.y,
        };

        setAllocatedItems((prev) =>
            isUpdate
                ? prev.map((item) => (item.instance_id === newItem.instance_id ? newItem : item))
                : [...prev, newItem]
        );

        setIsDraggedOver(false);
    };

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
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: ({ source, location }) => {
                const itemData: { item_id: string, item_name: string, instance_id: number | undefined } = source.data.item as { item_id: string; item_name: string, instance_id: number | undefined }
                const adjustedCoordinates = adjustCoordinates(location.current.input.clientX, location.current.input.clientY)
                const isValidDrop = checkValidDrop(adjustedCoordinates.x, adjustedCoordinates.y)
                const isUpdate = !!itemData.instance_id
                const newInstanceId = allocatedItems.length + 1
                const newItem = { item_id: itemData.item_id, instance_id: isUpdate ? itemData.instance_id || 0 : newInstanceId, item_name: itemData.item_name, x: adjustedCoordinates.x, y: adjustedCoordinates.y }
                let newAllocatedItems: AllocatedItem[] = []
                if (isValidDrop && !isUpdate) newAllocatedItems = [...allocatedItems, newItem];
                if (isValidDrop && isUpdate) newAllocatedItems = [...allocatedItems.filter((item) => item.instance_id !== itemData.instance_id), { ...newItem }];
                setAllocatedItems([...newAllocatedItems])
                setIsDraggedOver(false)
            },
        });
    }, [allocatedItems]);

    // useEffect(() => {
    //     return monitorForElements({
    //         onDrop: handleDrop
    //     });
    // }, []);

    const lineCount = raceDuration - 1;

    return (
        <Box
            id="race-container"
            ref={containerRef}
            sx={{
                position: 'relative',
                padding: '1rem',
                border: '1px solid green',
                width: conatinerDimensions.width,
                height: conatinerDimensions.height,
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: isDraggedOver ? 'skyblue' : 'white'
            }}
        >
            {[...Array(lineCount)].map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: `${(index * 100) / (lineCount - 1)}%`,
                        width: '1px',
                        backgroundColor: 'black',
                    }}
                />
            ))}
            {allocatedItems.map((item) => (
                <AllocatedFoodItem key={uuidv4()} item={item} />
            ))}
        </Box>
    );
};