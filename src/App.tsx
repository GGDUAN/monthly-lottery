import * as React from 'react';
import { LotteryProvider } from './context/LotteryContext';
import { LotteryPage } from './components/LotteryPage';

export const App: React.FC = () => {
  return (
    <LotteryProvider>
      <LotteryPage />
    </LotteryProvider>
  );
}; 