import React from 'react';
import { StagingContainer } from '../components/StagingContainer';
import { RaceContainerTop } from '../components/RaceContainerTop'
import { NavMain } from '../components/NavMain';



export const Home = () => {
    return (
        <>
            <NavMain />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' }}>
                <StagingContainer />
                <RaceContainerTop />
            </div>
        </>
    );
}