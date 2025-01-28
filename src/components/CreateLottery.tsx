import * as React from 'react';
import { useState } from 'react';
import { LotteryConfig } from '../types/lottery';

// 创建抽奖组件的属性接口
interface Props {
  onSubmit: (config: LotteryConfig) => void; // 提交抽奖配置的回调函数
}

export const CreateLottery: React.FC<Props> = ({ onSubmit }) => {
  // 状态管理
  const [totalCoins, setTotalCoins] = useState('');
  const [participants, setParticipants] = useState('');
  const [drawTime, setDrawTime] = useState('');

  // 表单提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const participantList = participants.split(',').map(p => p.trim());
    
    onSubmit({
      totalCoins: Number(totalCoins),
      participantsCount: participantList.length,
      participants: participantList,
      drawTime: new Date(drawTime)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 总光年币数量输入 */}
      <div>
        <label>总光年币数量：</label>
        <input
          type="number"
          value={totalCoins}
          onChange={e => setTotalCoins(e.target.value)}
          required
          min="1"
        />
      </div>
      
      {/* 参与者名单输入 */}
      <div>
        <label>参与者名单（用逗号分隔）：</label>
        <input
          type="text"
          value={participants}
          onChange={e => setParticipants(e.target.value)}
          required
          placeholder="张三,李四,王五"
        />
      </div>
      
      {/* 开奖时间输入 */}
      <div>
        <label>开奖时间：</label>
        <input
          type="datetime-local"
          value={drawTime}
          onChange={e => setDrawTime(e.target.value)}
          required
        />
      </div>
      
      <button type="submit">创建抽奖</button>
    </form>
  );
}; 