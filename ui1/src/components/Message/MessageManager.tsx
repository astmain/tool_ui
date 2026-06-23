import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Message, { MessageType, MessageProps } from './Message';
import { setMessageManager } from './messageApi';
import styles from './MessageManager.module.css';

export interface MessageOptions extends Omit<MessageProps, 'type' | 'onClose'> {
  type: MessageType;
}

interface MessageInstance {
  id: string;
  options: MessageOptions;
}

interface MessageContextValue {
  addMessage: (options: MessageOptions) => string;
  removeMessage: (id: string) => void;
}

const MessageContext = createContext<MessageContextValue | null>(null);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within MessageProvider');
  }
  return context;
};

export interface MessageManagerProps {
  children?: React.ReactNode;
}

export const MessageManager: React.FC<MessageManagerProps> = ({ children }) => {
  const [messages, setMessages] = useState<MessageInstance[]>([]);
  const counterRef = useRef(0);
  const managerRef = useRef<{ addMessage: (options: MessageOptions) => string; removeMessage: (id: string) => void } | null>(null);

  const addMessage = useCallback((options: MessageOptions): string => {
    const id = `message-${++counterRef.current}`;
    setMessages((prev) => [...prev, { id, options }]);
    return id;
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  useEffect(() => {
    managerRef.current = { addMessage, removeMessage };
    setMessageManager(managerRef.current);
    return () => {
      setMessageManager(null);
    };
  }, [addMessage, removeMessage]);

  return (
    <MessageContext.Provider value={{ addMessage, removeMessage }}>
      {children}
      {createPortal(
        <div className={styles.container} aria-live="polite">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={styles.messageWrapper}
              style={{ top: `${index * 72 + 24}px` }}
            >
              <Message
                {...msg.options}
                onClose={() => removeMessage(msg.id)}
              />
            </div>
          ))}
        </div>,
        document.body
      )}
    </MessageContext.Provider>
  );
};

export default MessageManager;
