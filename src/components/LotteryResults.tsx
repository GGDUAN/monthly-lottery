import React, { useState, useEffect } from 'react';
import { LotteryActivity } from '../types/lottery';
import './LotteryResults.css';

interface Props {
  lotteryState: LotteryActivity;
}

export const LotteryResults: React.FC<Props> = ({ lotteryState }) => {
  const { results, config } = lotteryState;
  
  // 计算已分配的光年币总数
  const distributedCoins = results.reduce((sum, r) => sum + r.coins, 0);
  
  // 获取实际参与的唯一用户数量
  const uniqueParticipants = new Set(results.map(r => r.participantName));
  
  // 使用 state 存储剩余时间
  const [remainingTime, setRemainingTime] = useState(
    new Date(config.drawTime).getTime() - new Date().getTime()
  );
  const isDrawTimePassed = remainingTime <= 0;
  
  // 添加实时倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      const newRemainingTime = new Date(config.drawTime).getTime() - new Date().getTime();
      setRemainingTime(newRemainingTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [config.drawTime]);

  return (
    <div className="lottery-results">
      <h2>抽奖结果</h2>
      
      <div className="summary">
        <div className="summary-item">
          <span>总光年币</span>
          <strong>{config.totalCoins}</strong>
        </div>
        <div className="summary-item">
          <span>已分配</span>
          <strong>{distributedCoins}</strong>
        </div>
        <div className="summary-item">
          <span>参与人数</span>
          <strong>{uniqueParticipants.size}/{config.participantsCount}</strong>
        </div>
        {!lotteryState.isCompleted && (
          <div className="summary-item">
            <span>开奖倒计时</span>
            <strong>
              {isDrawTimePassed ? '等待开奖' : formatRemainingTime(remainingTime)}
            </strong>
          </div>
        )}
      </div>
      
      <div className="results-table">
        <table>
          <thead>
            <tr>
              <th>参与者</th>
              <th>获得光年币</th>
              <th>参与时间</th>
              <th>参与方式</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={`${result.participantName}-${index}`}>
                <td>{result.participantName}</td>
                <td className="coins">{result.coins}</td>
                <td>{result.drawTime instanceof Date 
                  ? result.drawTime.toLocaleString()
                  : new Date(result.drawTime).toLocaleString()
                }</td>
                <td>{result.isManual ? '手动参与' : '系统分配'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 格式化剩余时间
function formatRemainingTime(ms: number): string {
  if (ms <= 0) return '已到时间';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分`;
  }
  if (minutes > 0) {
    return `${minutes}分${seconds % 60}秒`;
  }
  return `${seconds}秒`;
} 