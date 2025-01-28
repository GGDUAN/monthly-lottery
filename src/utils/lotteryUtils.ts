import { LotteryState, LotteryResult } from '../types/lottery';

// 生成随机光年币数量
export function generateRandomCoins(
  remainingCoins: number,    // 剩余的光年币总数
  remainingParticipants: number // 剩余的参与者数量
): number {
  if (remainingParticipants === 1) {
    return remainingCoins;
  }
  
  // 确保每个人至少获得1个光年币，且不超过剩余币数
  const minCoins = 1;
  const maxCoins = Math.floor(remainingCoins * 0.8); // 最多拿走80%的剩余币
  const randomCoins = Math.floor(Math.random() * (maxCoins - minCoins + 1)) + minCoins;
  
  return Math.min(randomCoins, remainingCoins - (remainingParticipants - 1)); // 确保留给其他人
}

// 分配剩余的洋葱币给未参与抽奖的人
export function distributeRemainingCoins(
  state: LotteryState
): LotteryResult[] {
  const { config, results } = state;
  
  // 找出还未参与抽奖的人
  const remainingParticipants = config.participants.filter(
    name => !results.find(r => r.participantName === name)
  );
  
  // 计算剩余的洋葱币数量
  const remainingCoins = config.totalCoins - results.reduce((sum, r) => sum + r.coins, 0);
  
  let currentRemainingCoins = remainingCoins;
  const newResults: LotteryResult[] = [];

  // 为每个剩余参与者分配洋葱币
  remainingParticipants.forEach((name, index) => {
    const isLast = index === remainingParticipants.length - 1;
    const coins = isLast 
      ? currentRemainingCoins 
      : generateRandomCoins(currentRemainingCoins, remainingParticipants.length - index);
    
    currentRemainingCoins -= coins;
    newResults.push({
      participantName: name,
      coins,
      drawTime: new Date()
    });
  });

  return newResults;
} 