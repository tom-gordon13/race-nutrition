import React, { useState } from 'react';
import { Box, Button, Input } from '@mui/material';
import { fetchItem } from '../services/get-item';

interface FoodSearchContainerProps {

}



export const FoodSearchContainer: React.FC<FoodSearchContainerProps> = ({ }) => {
    const [inputValue, setInputValue] = useState<string>('')


    const handleSearch = () => {
        const fetchData = async () => {
            const values = await fetchItem(inputValue)
            console.log(values)
        }
        fetchData()
    };


    return (
        <Box sx={{
            width: '100%'
        }}>
            Search for an item: {'   '}
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter item"
            />{'   '}
            <Button variant='contained' onClick={handleSearch}>Search</Button>
        </Box>
    );
}