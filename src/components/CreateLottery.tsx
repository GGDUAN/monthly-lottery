import React, { useState } from 'react';
import { LotteryConfig } from '../types/lottery';

// 创建抽奖组件的属性接口
interface Props {
  onSubmit: (config: LotteryConfig) => void; // 提交抽奖配置的回调函数
}

export const CreateLottery: React.FC<Props> = ({ onSubmit }) => {
  // 状态管理
  const [totalCoins, setTotalCoins] = useState(0);         // 总洋葱币数量
  const [participantNames, setParticipantNames] = useState(''); // 参与者名单
  const [drawTime, setDrawTime] = useState('');            // 开奖时间

  // 表单提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 将参与者名单字符串转换为数组，并过滤空行
    const participants = participantNames.split('\n').filter(name => name.trim());
    
    // 提交抽奖配置
    onSubmit({
      totalCoins,
      participantsCount: participants.length,
      participants,
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
          onChange={e => setTotalCoins(Number(e.target.value))}
          min="1"
          required
        />
      </div>
      
      {/* 参与者名单输入 */}
      <div>
        <label>参与者名单（每行一个名字）：</label>
        <textarea
          value={participantNames}
          onChange={e => setParticipantNames(e.target.value)}
          required
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