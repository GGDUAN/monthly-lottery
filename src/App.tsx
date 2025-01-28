import React from 'react';
import { LotteryPage } from './components/LotteryPage';
import { LotteryProvider } from './context/LotteryFirebaseContext';
import './styles/lottery.css';

function App() {
  return (
    <LotteryProvider>
      <div className="App">
        <LotteryPage />
      </div>
    </LotteryProvider>
  );
}

export default App; 