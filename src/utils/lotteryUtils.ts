import { LotteryState, LotteryResult } from '../types/lottery';

// 生成随机光年币数量
export function generateRandomCoins(
  remainingCoins: number,    // 剩余的光年币总数
  remainingParticipants: number // 剩余的参与者数量
): number {
  // 如果只剩最后一个人，给他所有剩余的币
  if (remainingParticipants === 1) {
    return remainingCoins;
  }
  
  // 确保每个人至少获得1个光年币
  const minCoins = 1;
  // 计算每人平均可分配的币数
  const averageCoins = Math.floor(remainingCoins / remainingParticipants);
  // 最大可分配数为平均数的两倍
  const maxCoins = Math.min(
    averageCoins * 2,
    remainingCoins - (remainingParticipants - 1)
  );
  
  return Math.floor(Math.random() * (maxCoins - minCoins + 1)) + minCoins;
}

// 分配剩余的光年币
export function distributeRemainingCoins(
  state: LotteryState
): LotteryResult[] {
  const { config, results } = state;
  
  // 找出还未手动参与抽奖的人
  const participatedNames = new Set(
    results.filter(r => r.isManual).map(r => r.participantName)
  );
  const remainingParticipants = config.participants.filter(
    name => !participatedNames.has(name)
  );
  
  // 计算剩余的光年币数量
  const usedCoins = results.reduce((sum, r) => sum + r.coins, 0);
  const remainingCoins = config.totalCoins - usedCoins;
  
  // 如果没有剩余币或剩余参与者，返回空数组
  if (remainingCoins <= 0 || remainingParticipants.length === 0) {
    return [];
  }

  // 一次性分配所有剩余的币
  const newResults: LotteryResult[] = [];
  let currentRemainingCoins = remainingCoins;

  // 为每个剩余参与者只分配一次
  remainingParticipants.forEach((name, index) => {
    const isLast = index === remainingParticipants.length - 1;
    const coins = isLast
      ? currentRemainingCoins  // 最后一个人获得所有剩余的币
      : generateRandomCoins(currentRemainingCoins, remainingParticipants.length - index);

    currentRemainingCoins -= coins;

    newResults.push({
      participantName: name,
      coins,
      drawTime: new Date(),
      isManual: false
    });
  });

  return newResults;
} 