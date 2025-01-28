import * as React from 'react';
import { useEffect } from 'react';
import { CreateLottery } from './CreateLottery';
import { JoinLottery } from './JoinLottery';
import { LotteryResults } from './LotteryResults';
import { useLottery } from '../context/LotteryContext';

export const LotteryPage: React.FC = () => {
  const { state, createLottery, participate, completeLottery } = useLottery();

  useEffect(() => {
    const checkDrawTime = () => {
      if (!state.isCompleted && 
          state.config.drawTime <= new Date() && 
          state.results.length < state.config.participants.length) {
        completeLottery();
      }
    };

    const timer = setInterval(checkDrawTime, 1000);
    return () => clearInterval(timer);
  }, [state.config.drawTime, state.isCompleted, state.results.length, state.config.participants.length, completeLottery]);

  return (
    <div>
      {!state.config.totalCoins ? (
        <CreateLottery onSubmit={createLottery} />
      ) : (
        <>
          {!state.isCompleted && <JoinLottery 
            lotteryState={state} 
            onParticipate={participate} 
          />}
          <LotteryResults lotteryState={state} />
        </>
      )}
    </div>
  );
}; 