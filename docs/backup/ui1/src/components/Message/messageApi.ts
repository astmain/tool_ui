import { MessageType, MessageProps } from './Message';

export interface MessageApiOptions {
  duration?: number;
  closable?: boolean;
  showIcon?: boolean;
}

export interface MessageConfig {
  duration?: number;
  top?: number;
}

let globalConfig: MessageConfig = {
  duration: 3000,
  top: 24,
};

let managerRef: {
  addMessage: (options: MessageOptions) => string;
  removeMessage: (id: string) => void;
} | null = null;

export interface MessageOptions extends Omit<MessageProps, 'type'> {
  type: MessageType;
}

export const setMessageManager = (manager: typeof managerRef) => {
  managerRef = manager;
};

export const getMessageManager = () => managerRef;

export const Message = {
  success(content: React.ReactNode, options?: MessageApiOptions) {
    return managerRef?.addMessage({ type: 'success', content, ...options });
  },

  warning(content: React.ReactNode, options?: MessageApiOptions) {
    return managerRef?.addMessage({ type: 'warning', content, ...options });
  },

  error(content: React.ReactNode, options?: MessageApiOptions) {
    return managerRef?.addMessage({ type: 'error', content, ...options });
  },

  info(content: React.ReactNode, options?: MessageApiOptions) {
    return managerRef?.addMessage({ type: 'info', content, ...options });
  },

  config(options: MessageConfig) {
    globalConfig = { ...globalConfig, ...options };
  },

  getConfig() {
    return { ...globalConfig };
  },
};

export default Message;
