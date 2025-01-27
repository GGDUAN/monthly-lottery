import * as React from 'react';
import { LotteryState } from '../types/lottery';

interface Props {
  lotteryState: LotteryState;
}

export const LotteryResults: React.FC<Props> = ({ lotteryState }) => {
  const { results, config } = lotteryState;

  return (
    <div>
      <h2>抽奖结果</h2>
      <div>总光年币：{config.totalCoins}</div>
      <div>参与人数：{config.participantsCount}</div>
      
      <table>
        <thead>
          <tr>
            <th>参与者</th>
            <th>获得光年币</th>
            <th>抽奖时间</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.participantName}>
              <td>{result.participantName}</td>
              <td>{result.coins}</td>
              <td>{result.drawTime.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 