import React, { useState, useContext, createContext, } from 'react';

interface EventContextProps {
    eventDuration: number
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const EventContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [eventDuration, setEventDuration] = useState<number>(10);

    return (
        <EventContext.Provider value={{ eventDuration }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEventContext = (): EventContextProps => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEventContext must be used within an EventContextProvider');
    }
    return context;
};
