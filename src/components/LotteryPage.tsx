import * as React from 'react';
import { useEffect } from 'react';
import { CreateLottery } from './CreateLottery';
import { JoinLottery } from './JoinLottery';
import { LotteryResults } from './LotteryResults';
import { useLottery } from '../context/LotteryFirebaseContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const LotteryPage: React.FC = () => {
  const { activity, loading, error, createLottery, participate, completeLottery, handleNewLottery } = useLottery();

  useEffect(() => {
    const checkDrawTime = () => {
      if (activity && !activity.isCompleted && 
          activity.config.drawTime <= new Date() && 
          activity.results.length < activity.config.participants.length) {
        completeLottery();
      }
    };

    const timer = setInterval(checkDrawTime, 1000);
    return () => clearInterval(timer);
  }, [activity, completeLottery]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={handleNewLottery} />;
  }

  return (
    <div>
      {!activity ? (
        <CreateLottery onSubmit={createLottery} />
      ) : activity.isCompleted && new Date(activity.config.drawTime) <= new Date() ? (
        <div>
          <LotteryResults lotteryState={activity} />
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
            lotteryState={activity} 
            onParticipate={participate} 
            handleNewLottery={handleNewLottery}
          />
          {activity.results.length > 0 && !activity.isCompleted && (
            <LotteryResults lotteryState={activity} />
          )}
        </div>
      )}
    </div>
  );
}; 