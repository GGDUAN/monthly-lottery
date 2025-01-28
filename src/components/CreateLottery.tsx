import * as React from 'react';
import { useState } from 'react';
import { LotteryConfig } from '../types/lottery';
import './CreateLottery.css';

// 创建抽奖组件的属性接口
interface Props {
  onSubmit: (config: LotteryConfig) => Promise<string>;
}

export const CreateLottery: React.FC<Props> = ({ onSubmit }) => {
  // 状态管理
  const [totalCoins, setTotalCoins] = useState('');
  const [participants, setParticipants] = useState('');
  const [drawTime, setDrawTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 验证输入
    const participantList = participants
      .split(/[,，\n]/) // 支持英文逗号、中文逗号和换行
      .map(p => p.trim())
      .filter(Boolean); // 过滤空值

    if (participantList.length < 2) {
      setError('至少需要两名参与者');
      return;
    }

    const coins = parseInt(totalCoins);
    if (isNaN(coins) || coins < participantList.length) {
      setError('光年币数量必须大于参与人数');
      return;
    }

    const drawDate = new Date(drawTime);
    if (isNaN(drawDate.getTime()) || drawDate <= new Date()) {
      setError('请选择一个有效的未来时间');
      return;
    }

    try {
      setSubmitting(true);
      const config: LotteryConfig = {
        totalCoins: coins,
        participantsCount: participantList.length,
        participants: participantList,
        drawTime: drawDate
      };
      
      await onSubmit(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建抽奖失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container create-lottery">
      <h2>创建抽奖</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>总光年币数量</label>
          <input
            type="number"
            className="form-control"
            value={totalCoins}
            onChange={(e) => setTotalCoins(e.target.value)}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label>参与者名单（用逗号或换行分隔）</label>
          <textarea
            className="form-control"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder=""
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
          <button 
            type="submit" 
            className="button"
            disabled={submitting}
          >
            {submitting ? '创建中...' : '创建抽奖'}
          </button>
        </div>
      </form>
    </div>
  );
}; 