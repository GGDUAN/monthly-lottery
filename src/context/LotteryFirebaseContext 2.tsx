import React, { createContext, useContext, useState, useEffect } from 'react';
import { lotteryService } from '../services/lotteryService';
import { LotteryConfig, LotteryResult, LotteryActivity } from '../types/lottery';
import { useLotteryFirebase } from '../hooks/useLotteryFirebase';
import { message } from '../components/Message';

interface LotteryContextType {
  lotteryId: string | null;
  activity: LotteryActivity | null;
  loading: boolean;
  error: string | null;
  createLottery: (config: LotteryConfig) => Promise<string>;
  participate: (participantName: string, isManual: boolean) => Promise<void>;
  completeLottery: () => Promise<void>;
  handleNewLottery: () => void;
}

const LotteryContext = createContext<LotteryContextType | undefined>(undefined);

export const LotteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lotteryId, setLotteryId] = useState<string | null>(() => {
    // 优先从 URL 参数获取 ID
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get('id');
    if (urlId) return urlId;
    
    // 其次从 localStorage 获取
    return localStorage.getItem('currentLotteryId');
  });

  // 更新 URL
  useEffect(() => {
    if (lotteryId) {
      const url = new URL(window.location.href);
      url.searchParams.set('id', lotteryId);
      window.history.replaceState({}, '', url.toString());
    }
  }, [lotteryId]);

  const { activity, loading, error } = useLotteryFirebase(lotteryId);

  const createLottery = async (config: LotteryConfig) => {
    const newActivity: LotteryActivity = {
      id: '',
      config,
      results: [],
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      const id = await lotteryService.createLottery(newActivity);
      setLotteryId(id);
      localStorage.setItem('currentLotteryId', id);
      message.success('抽奖创建成功');
      return id;
    } catch (err) {
      message.error('创建抽奖失败');
      throw err;
    }
  };

  const handleNewLottery = async () => {
    try {
      setLotteryId(null);
      localStorage.removeItem('currentLotteryId');
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.replaceState({}, '', url.toString());
      await message.success('已重置，可以创建新的抽奖');
      window.location.href = '/monthly-lottery';
    } catch (err) {
      message.error('重置失败，请刷新页面重试');
      console.error('重置失败:', err);
    }
  };

  const participate = async (participantName: string, isManual: boolean) => {
    if (!lotteryId || !activity) return;

    // 计算随机光年币数量
    const coins = await lotteryService.calculateCoins(lotteryId, participantName);

    const result: LotteryResult = {
      participantName,
      coins,
      drawTime: new Date(),
      isManual
    };

    try {
      await lotteryService.addResult(lotteryId, result);
      message.success('参与成功');
    } catch (err) {
      message.error('参与失败');
      throw err;
    }
  };

  const completeLottery = async () => {
    if (!lotteryId || !activity) return;
    
    try {
      await lotteryService.completeLottery(lotteryId);
    } catch (err) {
      console.error('完成抽奖失败:', err);
      throw err;
    }
  };

  return (
    <LotteryContext.Provider 
      value={{ 
        lotteryId,
        activity,
        loading,
        error,
        createLottery,
        participate,
        completeLottery,
        handleNewLottery
      }}
    >
      {children}
    </LotteryContext.Provider>
  );
};

export const useLottery = () => {
  const context = useContext(LotteryContext);
  if (context === undefined) {
    throw new Error('useLottery must be used within a LotteryProvider');
  }
  return context;
}; 