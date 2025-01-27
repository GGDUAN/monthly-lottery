import * as React from 'react';
import { createContext, useContext, useReducer, useCallback } from 'react';
import { LotteryState, LotteryConfig, LotteryResult } from '../types/lottery';
import { generateRandomCoins, distributeRemainingCoins } from '../utils/lotteryUtils';

interface LotteryContextType {
  state: LotteryState;
  createLottery: (config: LotteryConfig) => void;
  participate: (participantName: string) => void;
  completeLottery: () => void;
}

const LotteryContext = createContext<LotteryContextType | undefined>(undefined);

type Action = 
  | { type: 'CREATE_LOTTERY'; payload: LotteryConfig }
  | { type: 'ADD_RESULT'; payload: LotteryResult }
  | { type: 'COMPLETE_LOTTERY'; payload: LotteryResult[] };

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
  switch (action.type) {
    case 'CREATE_LOTTERY':
      return {
        config: action.payload,
        results: [],
        isCompleted: false
      };
    
    case 'ADD_RESULT':
      return {
        ...state,
        results: [...state.results, action.payload]
      };
    
    case 'COMPLETE_LOTTERY':
      return {
        ...state,
        results: [...state.results, ...action.payload],
        isCompleted: true
      };
    
    default:
      return state;
  }
}

export const LotteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const createLottery = (config: LotteryConfig) => {
    dispatch({ type: 'CREATE_LOTTERY', payload: config });
  };

  const participate = useCallback((participantName: string) => {
    const remainingCoins = state.config.totalCoins - 
      state.results.reduce((sum: number, r: LotteryResult) => sum + r.coins, 0);
    const remainingParticipants = state.config.participants.length - 
      state.results.length;

    const coins = generateRandomCoins(remainingCoins, remainingParticipants);
    
    dispatch({
      type: 'ADD_RESULT',
      payload: {
        participantName,
        coins,
        drawTime: new Date()
      }
    });
  }, [state.config.totalCoins, state.results]);

  const completeLottery = useCallback(() => {
    const remainingResults = distributeRemainingCoins(state);
    dispatch({ type: 'COMPLETE_LOTTERY', payload: remainingResults });
  }, [state]);

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