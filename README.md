# Monthly Lottery (月度抽奖系统)

一个基于 React + Firebase 的在线抽奖系统，支持多人参与，自动开奖，实时数据同步。

## 功能特点

### 创建抽奖
- 设置总光年币数量
- 添加参与者名单（支持逗号分隔和换行）
- 设置开奖时间

### 参与抽奖
- 手动参与功能
- 随机分配光年币
- 实时显示参与情况
- 实时倒计时显示

### 自动开奖
- 到点自动开奖
- 系统自动分配剩余光年币
- 确保总分配数量准确

### 结果展示
- 显示总光年币和已分配数量
- 显示参与人数统计
- 详细的参与记录表格
- 区分手动参与和系统分配

## 技术栈

- React 18
- TypeScript
- Firebase Realtime Database
- Context API
- React Hooks

## 项目结构

```
src/
├── components/          # React 组件
│   ├── CreateLottery   # 创建抽奖表单
│   ├── JoinLottery     # 参与抽奖界面
│   ├── LotteryResults  # 结果展示组件
│   ├── LoadingSpinner  # 加载动画
│   ├── ErrorMessage    # 错误提示
│   └── Message         # Toast 消息组件
├── context/            # 全局状态管理
├── services/           # Firebase 服务封装
└── types/              # TypeScript 类型定义
```

## 开发指南

### 环境要求
- Node.js >= 14
- npm >= 6

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm start
```

### 生产环境构建
```bash
npm run build
```

### 部署到 GitHub Pages
```bash
npm run deploy
```

## 主要功能说明

### 光年币分配算法
- 手动参与：随机分配，确保公平性
- 系统分配：自动处理剩余用户
- 最后一位用户获得剩余全部光年币

### 实时数据同步
- 使用 Firebase Realtime Database
- 自动同步所有用户的操作
- 实时更新抽奖状态

### 自动开奖机制
- 定时检查开奖时间
- 自动处理未参与用户
- 确保公平分配剩余光年币

## 部署说明

### 本地开发环境
1. 克隆仓库
2. 安装依赖
3. 配置 Firebase
4. 启动开发服务器

### GitHub Pages 部署
1. 修改 package.json 中的 homepage
2. 运行部署命令
3. 访问 GitHub Pages 地址

## 注意事项

- 确保 Firebase 配置正确
- 注意时区设置
- 建议使用最新版本浏览器
- 需要稳定的网络连接

## 待优化方向

1. 移动端适配优化
2. 主题切换功能
3. 更多的动画效果
4. 历史记录查询
5. 更多的数据统计

## License

MIT 