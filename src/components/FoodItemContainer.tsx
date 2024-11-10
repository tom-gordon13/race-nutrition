import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';


interface FoodItemContainerProps {
    itemName: string;
}

export const FoodItemContainer: React.FC<FoodItemContainerProps> = ({ itemName }) => {
    const [dragging, setDragging] = useState(false);
    const [clonePosition, setClonePosition] = useState({ x: 0, y: 0 });
    const offset = useRef({ x: 0, y: 0 });
    const originalBoxRef = useRef<HTMLDivElement | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (originalBoxRef.current) {
            const rect = originalBoxRef.current.getBoundingClientRect();
            setDragging(true);

            offset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            setClonePosition({ x: rect.left, y: rect.top });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging) {
            setClonePosition({
                x: e.clientX - offset.current.x,
                y: e.clientY - offset.current.y
            });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    React.useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    return (
        <>
            <Box
                ref={originalBoxRef}
                onMouseDown={handleMouseDown}
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
                Food Item Container - {itemName}
            </Box>

            {dragging && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: clonePosition.y,
                        left: clonePosition.x,
                        height: '4rem',
                        width: '8rem',
                        backgroundColor: 'lightgray',
                        border: '1px solid black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        opacity: 0.7
                    }}
                >
                    Food Item Container - {itemName}
                </Box>
            )}
        </>
    );
}