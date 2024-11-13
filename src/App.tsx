import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import './App.css';
import { AllocatedItemsProvider } from './context/AllocatedItemsContext';


function App() {
  return (
    <div className="App">
      <AllocatedItemsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </AllocatedItemsProvider>
    </div>
  );
}

export default App;
