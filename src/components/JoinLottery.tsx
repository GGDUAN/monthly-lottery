import * as React from 'react';
import { useState } from 'react';
import { LotteryState } from '../types/lottery';
import './JoinLottery.css';

interface Props {
  lotteryState: LotteryState;
  onParticipate: (participantName: string, isManual: boolean) => void;
}

export const JoinLottery: React.FC<Props> = ({ lotteryState, onParticipate }) => {
  const [selectedName, setSelectedName] = useState('');
  const { config, results } = lotteryState;
  
  // 获取还未参与抽奖的人（只统计主动参与的人）
  const availableParticipants = config.participants.filter(
    name => !results.some(r => r.participantName === name && r.isManual)
  );

  const remainingTime = new Date(config.drawTime).getTime() - new Date().getTime();
  const isDrawTimePassed = remainingTime <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedName && availableParticipants.includes(selectedName)) {
      onParticipate(selectedName, true); // 标记为手动参与
      setSelectedName('');
    }
  };

  if (lotteryState.isCompleted) {
    return <div className="notice">抽奖已结束</div>;
  }

  if (isDrawTimePassed) {
    return <div className="notice">开奖时间已到，等待系统开奖...</div>;
  }

  if (availableParticipants.length === 0) {
    return <div className="notice">所有人都已参与抽奖</div>;
  }

  return (
    <div className="container join-lottery">
      <h2>参与抽奖</h2>
      <div className="info">
        <p>总光年币：{config.totalCoins}</p>
        <p>剩余名额：{availableParticipants.length}</p>
        <p>开奖时间：{new Date(config.drawTime).toLocaleString()}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <select 
            className="form-control"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
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
          disabled={!selectedName}
        >
          立即参与
        </button>
      </form>
    </div>
  );
}; 