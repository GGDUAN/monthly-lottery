import React, { useState } from 'react';
import './ShareLottery.css';

interface Props {
  lotteryId: string;
}

export const ShareLottery: React.FC<Props> = ({ lotteryId }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/monthly-lottery?id=${lotteryId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '光年币抽奖',
          text: '来参与光年币抽奖吧！',
          url: shareUrl
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('分享失败:', err);
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="share-lottery">
      <div className="share-url">
        <input 
          type="text" 
          value={shareUrl} 
          readOnly 
          onClick={(e) => e.currentTarget.select()}
        />
        <button 
          className="copy-button"
          onClick={handleCopy}
        >
          {copied ? '已复制' : '复制链接'}
        </button>
      </div>
      <button 
        className="share-button"
        onClick={handleShare}
      >
        分享抽奖
      </button>
    </div>
  );
}; 