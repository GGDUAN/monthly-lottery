# 光年币抽奖系统 v1.0

## 项目概述
光年币抽奖系统是一个基于 React + TypeScript 的 Web 应用，支持创建抽奖活动、手动参与和自动开奖功能。系统采用响应式设计，确保在电脑、平板和手机上都能获得良好的用户体验。

## 功能特性

### 1. 核心功能
- 创建抽奖活动
  - 设置总光年币数量
  - 设置参与者名单
  - 设置开奖时间
- 手动参与抽奖
  - 实时显示剩余名额
  - 显示剩余光年币
  - 随机分配光年币数量
- 自动开奖功能
  - 定时检查开奖时间
  - 自动分配剩余光年币
  - 防止重复开奖
- 结果展示
  - 显示总览信息
  - 详细的分配记录
  - 实时更新状态

### 2. 技术实现

#### 状态管理
- 使用 React Context API 进行状态管理
- 使用 useReducer 处理复杂状态逻辑
- LocalStorage 实现数据持久化
- 多标签页状态同步

#### 核心文件结构
```
src/
├── components/          # 组件目录
│   ├── CreateLottery.tsx    # 创建抽奖组件
│   ├── JoinLottery.tsx     # 参与抽奖组件
│   └── LotteryResults.tsx  # 结果展示组件
├── context/            # 状态管理
│   └── LotteryContext.tsx
├── types/             # 类型定义
│   └── lottery.ts
├── utils/             # 工具函数
│   └── lotteryUtils.ts
└── styles/            # 样式文件
    └── common.css
```

#### 关键实现细节

1. **TypeScript 配置 (tsconfig.json)**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

2. **状态管理 (LotteryContext.tsx)**
```typescript
// 状态定义
interface LotteryState {
  config: LotteryConfig;
  results: LotteryResult[];
  isCompleted: boolean;
}

// Action 类型
type Action = 
  | { type: 'CREATE_LOTTERY'; payload: LotteryConfig }
  | { type: 'ADD_RESULT'; payload: LotteryResult }
  | { type: 'COMPLETE_LOTTERY'; payload: LotteryResult[] }
  | { type: 'SYNC_STATE'; payload: LotteryState };

// 状态持久化
const STORAGE_KEY = 'lottery_state';
const saveState = (state: LotteryState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// 防重复开奖机制
const isDrawingRef = useRef(false);
```

3. **随机分配算法 (lotteryUtils.ts)**
```typescript
export function generateRandomCoins(total: number, count: number): number {
  if (count <= 1) return total;
  const max = Math.floor(total / count * 2);
  return Math.floor(Math.random() * max) + 1;
}
```

4. **自动开奖机制**
```typescript
useEffect(() => {
  const checkAndDraw = () => {
    if (state.isCompleted || state.config.drawTime > new Date() || isDrawingRef.current) {
      return;
    }

    const currentState = loadState();
    if (!currentState.isCompleted && 
        JSON.stringify(currentState.results) === JSON.stringify(state.results)) {
      isDrawingRef.current = true;
      try {
        completeLottery();
      } finally {
        isDrawingRef.current = false;
      }
    }
  };

  const timer = setInterval(checkAndDraw, 1000);
  return () => clearInterval(timer);
}, [state.isCompleted, state.config.drawTime]);
```

### 3. 响应式设计
- 使用 CSS 变量实现主题统一
```css
:root {
  --primary-color: #1890ff;
  --background-color: #f5f5f5;
  --border-radius: 8px;
  --spacing: 16px;
}
```

- 移动端优化
```css
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
  .button {
    width: 100%;
  }
}
```

### 4. 使用说明

#### 创建抽奖
1. 输入总光年币数量（必须大于参与人数）
2. 输入参与者名单（用逗号分隔，至少两人）
3. 设置开奖时间
4. 点击"创建抽奖"按钮

#### 参与抽奖
1. 在开奖时间之前，参与者可以手动参与
2. 系统会随机分配光年币
3. 开奖时间到后，系统自动为未参与者分配光年币

#### 注意事项
- 每个参与者只能参与一次
- 总光年币会被完全分配
- 支持多个浏览器标签页同步
- 数据会保存在本地存储中

#### 5. 后续优化方向
- [ ] 部署到公网供更多用户使用
- [ ] 添加数据导出功能
- [ ] 优化移动端体验
- [ ] 添加更多自定义选项
- [ ] 添加历史记录功能
- [ ] 性能优化
- [ ] 单元测试覆盖

## 版本历史
- v1.0.0 (2024-01-28)
  - 完成基础抽奖功能
  - 实现响应式设计
  - 支持多设备访问
  - 确保数据同步和持久化 