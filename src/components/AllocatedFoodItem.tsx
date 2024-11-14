import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { AllocatedItem } from '../interfaces/AllocatedItem';
import { useAllocatedItems } from '../context/AllocatedItemsContext';


interface FoodItemContainerProps {
    foodItem: AllocatedItem,
    removeItem: (itemId: string) => void;
    rightEdge: number;
    containerTop: number;
    containerBottom: number;
}

const margin = 5
const stepSize = 3

const containerDimensions = {
    height: '80px',
    width: '120px',
}

export const AllocatedFoodItem: React.FC<FoodItemContainerProps> = ({ foodItem, removeItem, rightEdge, containerBottom, containerTop }) => {
    const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: foodItem.x, y: foodItem.y });
    const [originalPosition, setOriginalPosition] = useState({ x: foodItem.x, y: foodItem.y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const { allocatedItems } = useAllocatedItems();

    const handleClick = () => {
        setIsInEditMode(!isInEditMode);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setOriginalPosition(position);
        setIsDragging(true);

        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newX = Math.max(margin, e.clientX - dragOffset.x);
            const newY = e.clientY - dragOffset.y
            // const newY = Math.max(containerTop, e.clientY);
            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);

        const overlappingItem = allocatedItems.find(
            (item) =>
                // item.key !== foodItem.key &&
                Math.abs(item.x - position.x) < parseInt(containerDimensions.width, 10) &&
                Math.abs(item.y - position.y) < parseInt(containerDimensions.height, 10)
        );

        if (overlappingItem) {
            // If overlapping, adjust Y position to be below the overlapping item by at least 5px
            setPosition((prevPosition) => ({
                x: prevPosition.x,
                y: overlappingItem.y + parseInt(containerDimensions.height, 10) + margin,
            }));
        }
        else if (position.y < 0 || position.y > containerBottom) {
            // Revert to the original position if dropped outside
            setPosition(originalPosition);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isInEditMode) return;

        if (e.key === 'ArrowRight') {
            setPosition((prev) => ({
                ...prev,
                x: Math.min(rightEdge - parseInt(containerDimensions.width, 10) - margin, prev.x + stepSize),
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

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <Box
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
            onMouseDown={handleMouseDown}
            onDoubleClick={handleClick}
        >
            {foodItem.id} - {position.x}, {position.y}
            <Button
                variant="contained"
                color="secondary"
                onClick={() => removeItem(foodItem.id)}
                sx={{ marginTop: '0.5rem', display: isInEditMode ? 'block' : 'none' }}
            >
                Remove
            </Button>
        </Box>
    );
}