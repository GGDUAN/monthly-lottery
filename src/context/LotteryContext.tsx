import * as React from 'react';
import { createContext, useContext, useReducer, useCallback, useEffect, useState, useRef } from 'react';
import { LotteryState, LotteryConfig, LotteryResult } from '../types/lottery';
import { generateRandomCoins, distributeRemainingCoins } from '../utils/lotteryUtils';

interface LotteryContextType {
  state: LotteryState;
  createLottery: (config: LotteryConfig) => void;
  participate: (participantName: string, isManual?: boolean) => void;
  completeLottery: () => void;
}

const LotteryContext = createContext<LotteryContextType | undefined>(undefined);

type Action = 
  | { type: 'CREATE_LOTTERY'; payload: LotteryConfig }
  | { type: 'ADD_RESULT'; payload: LotteryResult }
  | { type: 'COMPLETE_LOTTERY'; payload: LotteryResult[] }
  | { type: 'SYNC_STATE'; payload: LotteryState };

const STORAGE_KEY = 'lottery_state';

// 从本地存储加载状态
const loadState = (): LotteryState => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);
      // 恢复 Date 对象
      state.config.drawTime = new Date(state.config.drawTime);
      state.results = state.results.map((r: LotteryResult) => ({
        ...r,
        drawTime: new Date(r.drawTime),
        isManual: r.isManual ?? false // 确保旧数据也有 isManual 字段
      }));
      return state;
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return initialState;
};

// 保存状态到本地存储
const saveState = (state: LotteryState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
};

const initialState: LotteryState = {
  config: {
    totalCoins: 0,
    participantsCount: 0,
    participants: [],
    drawTime: new Date()
  },
  results: [],
  isCompleted: false
};

function reducer(state: LotteryState, action: Action): LotteryState {
  let newState: LotteryState;
  
  switch (action.type) {
    case 'CREATE_LOTTERY':
      newState = {
        config: action.payload,
        results: [],
        isCompleted: false
      };
      break;
    
    case 'ADD_RESULT':
      newState = {
        ...state,
        results: [...state.results, action.payload]
      };
      break;
    
    case 'COMPLETE_LOTTERY':
      newState = {
        ...state,
        results: [...state.results, ...action.payload],
        isCompleted: true
      };
      break;
    
    case 'SYNC_STATE':
      return action.payload;
    
    default:
      return state;
  }
  
  // 保存新状态到本地存储
  saveState(newState);
  return newState;
}

export const LotteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);
  const drawTimeRef = useRef<NodeJS.Timeout>();
  const isDrawingRef = useRef(false);  // 添加一个标记来防止重复开奖

  // 自动开奖逻辑
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

    drawTimeRef.current = setInterval(checkAndDraw, 1000);
    return () => {
      if (drawTimeRef.current) {
        clearInterval(drawTimeRef.current);
      }
    };
  }, [state.isCompleted, state.config.drawTime]);  // 移除 state.results 依赖

  // 恢复状态同步逻辑
  useEffect(() => {
    const handleStorageChange = () => {
      if (isDrawingRef.current) return;  // 如果正在开奖，不同步状态

      const newState = loadState();
      if (JSON.stringify(newState) !== JSON.stringify(state)) {
        dispatch({ type: 'SYNC_STATE', payload: newState });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [state]);

  const completeLottery = useCallback(() => {
    if (state.isCompleted || isDrawingRef.current) {
      return;
    }

    const participatedNames = new Set(
      state.results.filter(r => r.isManual).map(r => r.participantName)
    );
    
    const remainingParticipants = state.config.participants.filter(
      name => !participatedNames.has(name)
    );

    if (remainingParticipants.length > 0) {
      const remainingCoins = state.config.totalCoins - 
        state.results.reduce((sum, r) => sum + r.coins, 0);

      let currentRemainingCoins = remainingCoins;
      const remainingResults = remainingParticipants.map((name, index) => {
        const isLast = index === remainingParticipants.length - 1;
        const coins = isLast
          ? currentRemainingCoins
          : generateRandomCoins(currentRemainingCoins, remainingParticipants.length - index);
        
        currentRemainingCoins -= coins;

        return {
          participantName: name,
          coins,
          drawTime: new Date(),
          isManual: false
        };
      });

      dispatch({ type: 'COMPLETE_LOTTERY', payload: remainingResults });
    } else {
      dispatch({ type: 'COMPLETE_LOTTERY', payload: [] });
    }
  }, [state.isCompleted, state.config.totalCoins, state.config.participants, state.results]);

  const createLottery = (config: LotteryConfig) => {
    dispatch({ type: 'CREATE_LOTTERY', payload: config });
  };

  const participate = useCallback((participantName: string, isManual = false) => {
    const remainingCoins = state.config.totalCoins - 
      state.results.reduce((sum: number, r: LotteryResult) => sum + r.coins, 0);
    // 计算还需要分配的人数（未手动参与的人数）
    const manualParticipants = new Set(
      state.results.filter(r => r.isManual).map(r => r.participantName)
    );
    const remainingParticipants = state.config.participants.filter(
      name => !manualParticipants.has(name)
    ).length;

    const coins = generateRandomCoins(remainingCoins, remainingParticipants);
    
    dispatch({
      type: 'ADD_RESULT',
      payload: {
        participantName,
        coins,
        drawTime: new Date(),
        isManual
      }
    });
  }, [state.config.totalCoins, state.results, state.config.participants]);

  return (
    <LotteryContext.Provider value={{ state, createLottery, participate, completeLottery }}>
      {children}
    </LotteryContext.Provider>
  );
};

export const useLottery = () => {
  const context = useContext(LotteryContext);
  if (!context) {
    throw new Error('useLottery must be used within a LotteryProvider');
  }
  return context;
}; 