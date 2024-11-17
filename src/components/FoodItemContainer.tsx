import React, { useRef, useEffect, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import { Box } from '@mui/material';


interface FoodItemContainerProps {
    item: { itemId: string, item_name: string }
    onDropInRaceContainer: (itemId: string, x: number, y: number, item_name: string) => void;
}

export const FoodItemContainer: React.FC<FoodItemContainerProps> = ({ item, onDropInRaceContainer }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);

    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return draggable({
            element: el,
            getInitialData: () => ({ item }),
            onDragStart: () => setDragging(true),
            onDrop: () => setDragging(false),
        });
    }, [item]);

    return (
        <Box
            ref={ref}
            sx={{
                position: 'relative',
                height: '4rem',
                width: '8rem',
                backgroundColor: 'lightgray',
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                marginBottom: '1rem'
            }}
        >
            {item.item_name}
        </Box>
    );
}