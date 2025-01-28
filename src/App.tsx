import * as React from 'react';
import { LotteryProvider } from './context/LotteryContext';
import { LotteryPage } from './components/LotteryPage';
import './styles/lottery.css';

export default function App() {
  return (
    <LotteryProvider>
      <LotteryPage />
    </LotteryProvider>
  );
} 