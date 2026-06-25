import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    bordered: {
      control: 'boolean',
      description: '是否显示边框',
    },
    shadow: {
      control: 'select',
      options: ['always', 'hover', 'never'],
      description: '阴影时机',
    },
    hoverable: {
      control: 'boolean',
      description: 'hover 时是否可抬起',
    },
    title: {
      control: 'text',
      description: '卡片标题',
    },
    subtitle: {
      control: 'text',
      description: '副标题',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: '卡片标题',
    subtitle: '这是副标题',
    bordered: true,
    shadow: 'hover',
    hoverable: true,
  },
  render: (args) => (
    <div style={{ width: 300 }}>
      <Card {...args}>
        这是卡片的内容区域，可以放置任意的文本、图片或其他组件。
      </Card>
    </div>
  ),
};

export const WithCover: Story = {
  render: () => (
    <div style={{ width: 300 }}>
      <Card
        cover={
          <img
            src="https://picsum.photos/300/200?random=1"
            alt="cover"
          />
        }
        title="风景摄影"
        subtitle="大自然的美景"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{
                padding: '6px 16px',
                background: 'var(--ui-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--ui-radius-sm)',
                cursor: 'pointer',
              }}
            >
              收藏
            </button>
            <button
              style={{
                padding: '6px 16px',
                background: 'transparent',
                color: 'var(--ui-primary)',
                border: '1px solid var(--ui-primary)',
                borderRadius: 'var(--ui-radius-sm)',
                cursor: 'pointer',
              }}
            >
              分享
            </button>
          </div>
        }
      >
        这里展示了一些关于风景摄影的作品集，包含山川、湖泊和日落等自然景观。
      </Card>
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div style={{ width: 300 }}>
      <Card
        title="任务卡片"
        subtitle="进行中"
        actions={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              style={{
                padding: '6px 16px',
                background: 'transparent',
                color: 'var(--ui-text-secondary)',
                border: '1px solid var(--ui-border)',
                borderRadius: 'var(--ui-radius-sm)',
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              style={{
                padding: '6px 16px',
                background: 'var(--ui-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--ui-radius-sm)',
                cursor: 'pointer',
              }}
            >
              确认
            </button>
          </div>
        }
      >
        这是一个带有操作按钮的任务卡片示例，底部展示了取消和确认两个操作按钮。
      </Card>
    </div>
  ),
};

export const Bordered: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      <Card title="带边框卡片" bordered>
        这是一张带有边框的卡片，边框可以帮助内容在复杂背景下保持清晰可见。
      </Card>
      <Card title="无边框卡片" bordered={false}>
        这是一张无边框的卡片，无边框设计可以让卡片更加轻盈，适合在简洁的布局中使用。
      </Card>
    </div>
  ),
};

export const NoShadow: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      <Card title="始终显示阴影" shadow="always">
        这张卡片的阴影始终可见，适用于需要强调的卡片内容。
      </Card>
      <Card title="悬停显示阴影" shadow="hover">
        这张卡片默认没有阴影，鼠标悬停时会显示阴影效果。
      </Card>
      <Card title="无阴影" shadow="never">
        这张卡片没有任何阴影效果，适合需要扁平化设计的场景。
      </Card>
    </div>
  ),
};

export const ShadowVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      <Card title="始终显示阴影" shadow="always">
        阴影始终可见
      </Card>
      <Card title="悬停显示阴影" shadow="hover" hoverable>
        鼠标悬停时抬起并显示阴影
      </Card>
      <Card title="无阴影" shadow="never">
        无阴影效果
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    title: '可交互卡片',
    subtitle: '尝试调整下方的控件',
    bordered: true,
    shadow: 'hover',
    hoverable: true,
  },
  render: (args) => (
    <div style={{ width: 300 }}>
      <Card {...args}>
        调整右侧控件来查看卡片的不同状态变化。
      </Card>
    </div>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 900 }}>
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          title={`卡片 ${i}`}
          subtitle={`副标题 ${i}`}
          cover={<img src={`https://picsum.photos/300/150?random=${i + 10}`} alt={`cover-${i}`} />}
          hoverable
        >
          这是卡片 {i} 的内容区域，可以放置任意的文本、图片或其他组件。
        </Card>
      ))}
    </div>
  ),
};
