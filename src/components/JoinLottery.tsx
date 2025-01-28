import * as React from 'react';
import { useState } from 'react';
import { LotteryActivity } from '../types/lottery';
import './JoinLottery.css';

interface Props {
  lotteryState: LotteryActivity;
  onParticipate: (participantName: string, isManual: boolean) => Promise<void>;
  handleNewLottery: () => void;
}

export const JoinLottery: React.FC<Props> = ({ lotteryState, onParticipate, handleNewLottery }) => {
  const [selectedName, setSelectedName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const remainingTime = new Date(lotteryState.config.drawTime).getTime() - new Date().getTime();
  const isDrawTimePassed = remainingTime <= 0;

  // 获取还未参与抽奖的人
  const availableParticipants = lotteryState.config.participants.filter(
    name => !lotteryState.results?.some(r => r.participantName === name)
  );

  // 添加调试日志
  console.log('抽奖状态:', {
    participants: lotteryState.config.participants,
    results: lotteryState.results,
    available: availableParticipants,
    drawTime: lotteryState.config.drawTime,
    isDrawTimePassed
  });

  if (isDrawTimePassed) {
    return <div className="notice">开奖时间已到，等待系统开奖...</div>;
  }

  if (lotteryState.isCompleted && isDrawTimePassed) {
    return <div className="notice">抽奖已结束</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedName) {
      setError('请选择参与者');
      return;
    }

    try {
      setSubmitting(true);
      await onParticipate(selectedName, true);
      setSelectedName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '参与失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (availableParticipants.length === 0) {
    return (
      <div className="notice">
        所有人都已参与抽奖
        <button 
          onClick={handleNewLottery}
          className="new-lottery-button"
        >
          新建抽奖
        </button>
      </div>
    );
  }

  return (
    <div className="join-lottery">
      <h2>参与抽奖</h2>
      <div className="info">
        <p>总光年币：{lotteryState.config.totalCoins}</p>
        <p>剩余名额：{availableParticipants.length}</p>
        <p>开奖时间：{new Date(lotteryState.config.drawTime).toLocaleString()}</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <select 
            className="form-control"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            disabled={submitting}
          >
            <option value="">选择参与者</option>
            {availableParticipants.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          className="button"
          disabled={!selectedName || submitting}
        >
          {submitting ? '参与中...' : '立即参与'}
        </button>
      </form>
    </div>
  );
}; 