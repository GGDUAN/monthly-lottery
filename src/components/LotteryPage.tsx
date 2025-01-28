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

  const handleNewLottery = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      {state.config.totalCoins === 0 ? (
        <CreateLottery onSubmit={createLottery} />
      ) : state.isCompleted ? (
        <div>
          <LotteryResults lotteryState={state} />
          <button 
            onClick={handleNewLottery}
            className="new-lottery-button"
          >
            新建抽奖
          </button>
        </div>
      ) : (
        <div>
          <JoinLottery 
            lotteryState={state} 
            onParticipate={participate} 
          />
          {state.results.length > 0 && (
            <LotteryResults lotteryState={state} />
          )}
        </div>
      )}
    </div>
  );
}; 