import React, { useState } from 'react';
import { FoodSearchResult } from './FoodSearchResult';
import { Box, Button, Grid, Input, CircularProgress } from '@mui/material';
import { fetchItem } from '../services/get-item';

interface FoodSearchContainerProps {
    addToStagedItems: Function
    searchResults: object[]
    setSearchResults: (values: object[]) => void
}



export const FoodSearchContainer: React.FC<FoodSearchContainerProps> = ({ addToStagedItems, searchResults, setSearchResults }) => {
    const [inputValue, setInputValue] = useState<string>('')
    const [pageError, setPageError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);


    const handleSearch = () => {
        const fetchData = async () => {
            setPageError(false);
            setLoading(true);
            try {
                const values = await fetchItem(inputValue);
                if (!values) throw new Error();
                setSearchResults(values);
            } catch {
                setPageError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box sx={{
            width: '100%'
        }}>
            Search for an item: {'   '}
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter item"
            />{'   '}
            <Button variant='contained' onClick={handleSearch}>Search</Button>
            <br />
            {loading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '1rem',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {pageError && !loading && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '20rem',
                    }}
                >
                    <h3>Unable to fetch results</h3>
                </Box>
            )}
            {!pageError && !loading && (
                <Grid
                    container
                    columnSpacing={3}
                    rowSpacing={12}
                    sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', margin: 0 }}
                >
                    {searchResults.map((item, index) => (
                        <Grid item xs={2.5} key={index}>
                            <FoodSearchResult item={item} addToStagedItems={addToStagedItems} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}