import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { LotteryActivity } from '../types/lottery';

export const useLotteryFirebase = (lotteryId: string | null) => {
  const [activity, setActivity] = useState<LotteryActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lotteryId) {
      setLoading(false);
      return;
    }

    // 监听抽奖活动的实时更新
    const unsubscribe = onSnapshot(
      doc(db, 'lotteries', lotteryId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          // 转换 Timestamp 为 Date
          const activity: LotteryActivity = {
            ...data,
            config: {
              ...data.config,
              drawTime: data.config.drawTime.toDate()
            },
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
            results: data.results?.map((r: any) => ({
              ...r,
              drawTime: r.drawTime.toDate()
            })) || []
          } as LotteryActivity;
          
          setActivity(activity);
        } else {
          setError('抽奖活动不存在');
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [lotteryId]);

  return { activity, loading, error };
}; 