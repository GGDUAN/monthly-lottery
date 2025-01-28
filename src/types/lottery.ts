// 抽奖配置接口
export interface LotteryConfig {
  totalCoins: number;      // 总光年币数量
  participantsCount: number; // 参与人数
  participants: string[];   // 参与者名单
  drawTime: Date;          // 开奖时间
}

// 抽奖结果接口
export interface LotteryResult {
  participantName: string;  // 参与者名字
  coins: number;           // 获得的光年币数量
  drawTime: Date;          // 抽奖时间
  isManual: boolean;        // 是否手动参与
}

// 抽奖状态接口
export interface LotteryState {
  config: LotteryConfig;   // 抽奖配置
  results: LotteryResult[]; // 抽奖结果列表
  isCompleted: boolean;    // 是否已完成抽奖
}

// 添加活动ID
export interface LotteryActivity {
  id: string;
  config: LotteryConfig;
  results: LotteryResult[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
} 