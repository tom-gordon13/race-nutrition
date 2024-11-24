import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import './App.css';
import { AllocatedItemsProvider } from './context/AllocatedItemsContext';
import { EventContextProvider } from './context/EventContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';


function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <EventContextProvider>
          <AllocatedItemsProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </Router>
          </AllocatedItemsProvider>
        </EventContextProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
