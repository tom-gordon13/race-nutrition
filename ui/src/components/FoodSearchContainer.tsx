import React, { useState } from 'react';
import { FoodSearchResult } from './FoodSearchResult';
import { Box, Button, Container, Grid, Input } from '@mui/material';
import { fetchItem } from '../services/get-item';

interface FoodSearchContainerProps {

}



export const FoodSearchContainer: React.FC<FoodSearchContainerProps> = ({ }) => {
    const [inputValue, setInputValue] = useState<string>('')
    const [searchResults, setSearchResults] = useState<object[]>([])


    const handleSearch = () => {
        const fetchData = async () => {
            const values = await fetchItem(inputValue)
            setSearchResults(values)
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
            <br />
            <Grid container
                columnSpacing={3}
                rowSpacing={12}
                sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}
            >
                {searchResults.map((item, index) =>
                (<Grid item xs={2.5} key={index}>
                    <FoodSearchResult item={item} />
                </Grid>)
                )}
            </Grid>
        </Box>
    );
}