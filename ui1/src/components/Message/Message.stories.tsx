import type { Meta, StoryObj } from '@storybook/react';
import Message from './Message';
import { MessageManager } from './MessageManager';
import { Message as MessageApi } from './messageApi';

const meta: Meta<typeof Message> = {
  title: 'Components/Message',
  component: Message,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MessageManager>
        <div style={{ padding: '20px' }}>
          <Story />
        </div>
      </MessageManager>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Message>;

export const Default: Story = {
  render: () => {
    return <Message content="This is a default message" />;
  },
};

export const Success: Story = {
  render: () => {
    return <Message type="success" content="Operation completed successfully!" />;
  },
};

export const Warning: Story = {
  render: () => {
    return <Message type="warning" content="Please review your input carefully." />;
  },
};

export const Error: Story = {
  render: () => {
    return <Message type="error" content="Something went wrong. Please try again." />;
  },
};

export const Info: Story = {
  render: () => {
    return <Message type="info" content="Here is some information for you." />;
  },
};

export const AllTypes: Story = {
  render: () => {
    const types = ['success', 'warning', 'error', 'info'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {types.map((type) => (
          <Message key={type} type={type} content={`This is a ${type} message`} />
        ))}
      </div>
    );
  },
};

export const WithoutIcon: Story = {
  render: () => {
    return <Message type="info" content="Message without icon" showIcon={false} />;
  },
};

export const Closable: Story = {
  render: () => {
    return <Message type="info" content="This message can be closed" closable />;
  },
};

export const DurationZero: Story = {
  render: () => {
    return <Message type="info" content="This message will not auto-close" duration={0} closable />;
  },
};

export const CustomDuration: Story = {
  render: () => {
    return <Message type="success" content="This message will close in 5 seconds" duration={5000} />;
  },
};

export const StackedMessages: Story = {
  render: () => {
    const handleShowAll = () => {
      MessageApi.success('Success message');
      MessageApi.warning('Warning message');
      MessageApi.error('Error message');
      MessageApi.info('Info message');
    };

    return (
      <button onClick={handleShowAll} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Show all message types
      </button>
    );
  },
};

export const ApiUsage: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={() => MessageApi.success('Success!')}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Show Success
        </button>
        <button
          onClick={() => MessageApi.warning('Warning!')}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Show Warning
        </button>
        <button
          onClick={() => MessageApi.error('Error!')}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Show Error
        </button>
        <button
          onClick={() => MessageApi.info('Info!')}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Show Info
        </button>
      </div>
    );
  },
};

export const ClosableVariants: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Message type="success" content="Success with close button" closable />
        <Message type="warning" content="Warning with close button" closable />
        <Message type="error" content="Error with close button" closable />
        <Message type="info" content="Info with close button" closable />
      </div>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    return (
      <Message
        type="info"
        content="This is a very long message that should wrap to multiple lines if the container is not wide enough to accommodate all the text on a single line."
      />
    );
  },
};
