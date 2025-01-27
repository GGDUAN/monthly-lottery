import * as React from 'react';
import { useState } from 'react';
import { LotteryState } from '../types/lottery';

interface Props {
  lotteryState: LotteryState;
  onParticipate: (participantName: string) => void;
}

export const JoinLottery: React.FC<Props> = ({ lotteryState, onParticipate }) => {
  const [selectedName, setSelectedName] = useState('');
  const { config, results } = lotteryState;
  
  const availableParticipants = config.participants.filter(
    name => !results.find(r => r.participantName === name)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedName) {
      onParticipate(selectedName);
    }
  };

  if (lotteryState.isCompleted) {
    return <div>抽奖已结束</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>选择你的名字：</label>
        <select 
          value={selectedName}
          onChange={e => setSelectedName(e.target.value)}
          required
        >
          <option value="">请选择</option>
          {availableParticipants.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      
      <button 
        type="submit" 
        disabled={!selectedName}
      >
        参与抽奖
      </button>
    </form>
  );
}; 