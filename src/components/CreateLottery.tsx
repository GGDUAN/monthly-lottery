import * as React from 'react';
import { useState } from 'react';
import { LotteryConfig } from '../types/lottery';
import './CreateLottery.css';

// 创建抽奖组件的属性接口
interface Props {
  onSubmit: (config: LotteryConfig) => void; // 提交抽奖配置的回调函数
}

export const CreateLottery: React.FC<Props> = ({ onSubmit }) => {
  // 状态管理
  const [totalCoins, setTotalCoins] = useState('');
  const [participants, setParticipants] = useState('');
  const [drawTime, setDrawTime] = useState('');

  const handleClear = () => {
    localStorage.clear();
    window.location.reload();
  };

  // 表单提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const participantList = participants
      .split(/[,，\n]/) // 支持逗号、中文逗号和换行分隔
      .map(name => name.trim())
      .filter(name => name); // 过滤空值
    
    if (participantList.length < 2) {
      alert('请至少输入两个参与者');
      return;
    }

    if (Number(totalCoins) < participantList.length) {
      alert('光年币数量必须大于等于参与人数');
      return;
    }

    onSubmit({
      totalCoins: Number(totalCoins),
      participantsCount: participantList.length,
      participants: participantList,
      drawTime: new Date(drawTime)
    });
  };

  return (
    <div className="container create-lottery">
      <h2>创建抽奖</h2>
      <button 
        type="button" 
        onClick={handleClear}
        className="clear-cache-button"
      >
        清除缓存
      </button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>总光年币</label>
          <input
            type="number"
            className="form-control"
            value={totalCoins}
            onChange={(e) => setTotalCoins(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>参与者名单（用逗号分隔）</label>
          <textarea
            className="form-control"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>开奖时间</label>
          <input
            type="datetime-local"
            className="form-control"
            value={drawTime}
            onChange={(e) => setDrawTime(e.target.value)}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit" className="button">创建抽奖</button>
        </div>
      </form>
    </div>
  );
}; 