import { Box } from '@mui/material';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AllocatedFoodItem } from './AllocatedFoodItem'
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { useAllocatedItems } from '../context/AllocatedItemsContext';
import { dropTargetForElements, monitorForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from 'tiny-invariant';


interface RaceContainerTopProps {
    raceDuration: number
}

interface DropEvent {
    source: Object;
    location: Object;
}

const conatinerDimensions = {
    width: '90rem',
    height: '25rem'
}

const isValid = true

export const RaceContainerTop: React.FC<RaceContainerTopProps> = ({ raceDuration }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const { allocatedItems, setAllocatedItems } = useAllocatedItems();


    const adjustCoordinates = (initial_x: number, initial_y: number, dropped_obj_height: number, dropped_obj_width: number) => {
        const y_offset = dropped_obj_height + (containerRef?.current?.offsetTop ?? 0)
        const x_offset = dropped_obj_width + (containerRef?.current?.offsetLeft ?? 0)
        return { x: initial_x - x_offset, y: initial_y - y_offset }
    }

    const handleDrop = useCallback(({ source, location }: DropEvent) => {
        // Logic to handle the drop event will be added here
        console.log("handleDrop", source, location);
    }, []);

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
            onDragStart: () => setIsDraggedOver(true),
            onDragEnter: () => {
                if (isValid) setIsDraggedOver(true)
            },
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: ({ source, location }) => {
                const itemRect = containerElement.getBoundingClientRect();
                console.log('here', source)
                // let mouseOffset = { x: 0, y: 0 }
                // if (itemRect) {
                //     mouseOffset = {
                //         x: event.clientX - itemRect.left,
                //         y: event.clientY - itemRect.top,
                //     };
                // }
                const itemData: { itemId: string, item_name: string } = source.data.item as { itemId: string; item_name: string }
                const adjustedCoordinates = adjustCoordinates(location.current.input.clientX, location.current.input.clientY, source.element.clientHeight as number, source.element.clientWidth as number)
                setAllocatedItems((prev) => [...prev, { item_id: itemData.itemId, instance_id: 123, item_name: itemData.item_name, x: adjustedCoordinates.x, y: adjustedCoordinates.y }]);
                setIsDraggedOver(false)
            },
        });
    }, []);

    useEffect(() => {
        console.log(allocatedItems)
    }, [allocatedItems])

    useEffect(() => {
        return monitorForElements({
            onDrop: handleDrop
        });
    }, []);

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
            {allocatedItems.map((item, index) => (
                <AllocatedFoodItem key={item.instance_id} foodItem={item} />
            ))}
        </Box>
    );
};