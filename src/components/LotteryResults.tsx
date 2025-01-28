import * as React from 'react';
import { LotteryState } from '../types/lottery';
import './LotteryResults.css';

interface Props {
  lotteryState: LotteryState;
}

export const LotteryResults: React.FC<Props> = ({ lotteryState }) => {
  const { results, config } = lotteryState;
  
  // 计算已分配的光年币总数
  const distributedCoins = results.reduce((sum, r) => sum + r.coins, 0);
  
  // 获取实际参与的唯一用户数量（不管是手动还是自动）
  const uniqueParticipants = new Set(results.map(r => r.participantName));
  
  return (
    <div className="container lottery-results">
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
      </div>
      
      <div className="results-table">
        <table>
          <thead>
            <tr>
              <th>参与者</th>
              <th>获得光年币</th>
              <th>抽奖时间</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={`${result.participantName}-${index}`}>
                <td>{result.participantName}</td>
                <td className="coins">{result.coins}</td>
                <td>{new Date(result.drawTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 