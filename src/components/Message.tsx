import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './Message.css';

type MessageType = 'success' | 'error' | 'info';

interface MessageProps {
  type: MessageType;
  content: string;
  duration?: number;
  onClose?: () => void;
}

export const Message: React.FC<MessageProps> = ({ 
  type, 
  content, 
  duration = 1000,
  onClose 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`message message-${type}`}>
      <span className="message-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
      </span>
      <span className="message-content">{content}</span>
    </div>
  );
};

// 消息管理器
let messageContainer: HTMLDivElement | null = null;

const createMessageContainer = () => {
  const container = document.createElement('div');
  container.className = 'message-container';
  document.body.appendChild(container);
  return container;
};

export const message = {
  success(content: string, duration?: number) {
    if (!messageContainer) {
      messageContainer = createMessageContainer();
    }
    return new Promise<void>((resolve) => {
      this.show('success', content, duration, resolve);
    });
  },

  error(content: string, duration?: number) {
    if (!messageContainer) {
      messageContainer = createMessageContainer();
    }
    return new Promise<void>((resolve) => {
      this.show('error', content, duration, resolve);
    });
  },

  info(content: string, duration?: number) {
    if (!messageContainer) {
      messageContainer = createMessageContainer();
    }
    this.show('info', content, duration);
  },

  show(type: MessageType, content: string, duration?: number, onFinish?: () => void) {
    const div = document.createElement('div');
    messageContainer?.appendChild(div);

    const root = createRoot(div);
    const onClose = () => {
      if (messageContainer?.contains(div)) {
        root.unmount();
        messageContainer.removeChild(div);
        onFinish?.();
      }
    };

    root.render(
      <Message 
        type={type} 
        content={content} 
        duration={duration}
        onClose={onClose}
      />
    );
  }
}; 