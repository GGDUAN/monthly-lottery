import { db } from '../config/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { LotteryActivity, LotteryResult } from '../types/lottery';

export const lotteryService = {
  // 创建新抽奖
  async createLottery(activity: LotteryActivity) {
    const docRef = doc(collection(db, 'lotteries'));
    // 转换日期为 Timestamp
    const activityData = {
      ...activity,
      id: docRef.id,
      config: {
        ...activity.config,
        drawTime: Timestamp.fromDate(new Date(activity.config.drawTime))
      },
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    };
    await setDoc(docRef, activityData);
    return docRef.id;
  },

  // 获取抽奖
  async getLottery(id: string) {
    const docRef = doc(db, 'lotteries', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    // 转换 Timestamp 回 Date
    return {
      ...data,
      config: {
        ...data.config,
        drawTime: data.config.drawTime.toDate()
      },
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      results: data.results.map((r: any) => ({
        ...r,
        drawTime: r.drawTime.toDate()
      }))
    } as LotteryActivity;
  },

  // 更新抽奖结果
  async addResult(id: string, result: LotteryResult) {
    const docRef = doc(db, 'lotteries', id);
    await updateDoc(docRef, {
      results: arrayUnion({
        ...result,
        drawTime: Timestamp.fromDate(new Date(result.drawTime))
      }),
      updatedAt: Timestamp.fromDate(new Date())
    });
  },

  // 完成抽奖
  async completeLottery(id: string) {
    const docRef = doc(db, 'lotteries', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('抽奖活动不存在');
    }

    const activity = docSnap.data() as LotteryActivity;
    
    if (activity.isCompleted) {
      throw new Error('抽奖已经结束');
    }

    // 获取未参与的用户
    const participatedUsers = new Set(activity.results.map(r => r.participantName));
    // 过滤掉已经参与的用户，并确保每个用户只出现一次
    const remainingUsers = Array.from(new Set(
      activity.config.participants.filter(name => !participatedUsers.has(name))
    ));

    // 计算剩余光年币
    const distributedCoins = activity.results.reduce((sum, r) => sum + r.coins, 0);
    const remainingCoins = activity.config.totalCoins - distributedCoins;

    // 如果没有剩余用户或已分配完所有光年币，直接返回
    if (remainingUsers.length === 0 || remainingCoins <= 0) {
      return;
    }

    // 为剩余用户随机分配光年币
    const results: LotteryResult[] = remainingUsers.map(name => {
      // 最后一个用户获得所有剩余光年币
      const isLast = name === remainingUsers[remainingUsers.length - 1];
      let coins;
      if (isLast) {
        // 最后一个用户获得所有剩余光年币
        coins = remainingCoins;
      } else {
        // 使用与手动参与相同的计算逻辑
        const maxAllowed = Math.floor(remainingCoins / remainingUsers.length * 2);
        coins = Math.floor(Math.random() * maxAllowed) + 1;
      }

      return {
        participantName: name,
        coins,
        drawTime: new Date(),
        isManual: false
      };
    });

    // 更新数据库前再次检查是否有重复
    const finalResults = results.filter(result => {
      return !activity.results.some(r => r.participantName === result.participantName);
    });

    if (finalResults.length === 0) {
      return;
    }

    // 更新数据库
    await updateDoc(docRef, {
      results: arrayUnion(...finalResults),
      isCompleted: true,
      updatedAt: Timestamp.fromDate(new Date())
    });
  },

  // 计算随机光年币数量
  async calculateCoins(id: string, participantName: string): Promise<number> {
    const docRef = doc(db, 'lotteries', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('抽奖活动不存在');
    }

    const activity = docSnap.data() as LotteryActivity;
    
    // 计算已分配的光年币
    const distributedCoins = activity.results.reduce((sum, r) => sum + r.coins, 0);
    const remainingCoins = activity.config.totalCoins - distributedCoins;
    
    // 计算剩余参与者数量（未参与的人数）
    const participatedUsers = new Set(activity.results.map(r => r.participantName));
    const remainingParticipants = activity.config.participants.filter(
      name => !participatedUsers.has(name)
    ).length;
    
    // 为当前参与者随机分配光年币
    if (remainingParticipants === 1) {
      return remainingCoins; // 最后一个参与者获得所有剩余光年币
    }
    
    // 随机分配，但确保剩余的人也能分到
    const maxAllowed = Math.floor(remainingCoins / remainingParticipants * 2);
    return Math.floor(Math.random() * maxAllowed) + 1; // 至少分配1个光年币
  }
}; 