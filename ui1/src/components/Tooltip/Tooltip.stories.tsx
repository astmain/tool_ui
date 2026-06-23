import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '气泡提示组件，用于显示额外信息。',
      },
    },
  },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
        'left-start',
        'left-end',
        'right-start',
        'right-end',
      ],
      description: '弹出位置',
    },
    trigger: {
      control: 'select',
      options: ['hover', 'click', 'focus', 'manual'],
      description: '触发方式',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    enterable: {
      control: 'boolean',
      description: '鼠标是否可进入浮层',
    },
    content: {
      control: 'text',
      description: '提示内容',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '6px',
  border: '1px solid #dcdfe6',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '14px',
};

const smallButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  padding: '6px 12px',
  fontSize: '12px',
};

export const Default: Story = {
  args: {
    content: '这是一条提示信息',
    placement: 'top',
    trigger: 'hover',
    disabled: false,
    enterable: true,
    children: <button style={buttonStyle}>鼠标移入显示</button>,
  },
};

export const Placements: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 120px)',
        gap: '16px',
        justifyContent: 'center',
        padding: '120px 40px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Tooltip content="上左" placement="top-start">
          <button style={smallButtonStyle}>上左</button>
        </Tooltip>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Tooltip content="上边" placement="top">
          <button style={smallButtonStyle}>上边</button>
        </Tooltip>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Tooltip content="上右" placement="top-end">
          <button style={smallButtonStyle}>上右</button>
        </Tooltip>
      </div>
      <div style={{ textAlign: 'center' }} />

      <div style={{ textAlign: 'center' }}>
        <Tooltip content="左边" placement="left">
          <button style={smallButtonStyle}>左边</button>
        </Tooltip>
      </div>
      <div style={{ textAlign: 'center' }} />
      <div style={{ textAlign: 'center' }} />
      <div style={{ textAlign: 'center' }}>
        <Tooltip content="右边" placement="right">
          <button style={smallButtonStyle}>右边</button>
        </Tooltip>
      </div>

      <div style={{ textAlign: 'center' }} />
      <div style={{ textAlign: 'center' }}>
        <Tooltip content="下左" placement="bottom-start">
          <button style={smallButtonStyle}>下左</button>
        </Tooltip>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Tooltip content="下边" placement="bottom">
          <button style={smallButtonStyle}>下边</button>
        </Tooltip>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Tooltip content="下右" placement="bottom-end">
          <button style={smallButtonStyle}>下右</button>
        </Tooltip>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Tooltip content="左上" placement="left-start">
          <button style={smallButtonStyle}>左上</button>
        </Tooltip>
      </div>
      <div style={{ textAlign: 'center' }} />
      <div style={{ textAlign: 'center' }} />
      <div style={{ textAlign: 'center' }}>
        <Tooltip content="右上" placement="right-start">
          <button style={smallButtonStyle}>右上</button>
        </Tooltip>
      </div>

      <div style={{ textAlign: 'center' }} />
      <div style={{ textAlign: 'center' }}>
        <Tooltip content="左下" placement="left-end">
          <button style={smallButtonStyle}>左下</button>
        </Tooltip>
      </div>
      <div style={{ textAlign: 'center' }} />
      <div style={{ textAlign: 'center' }}>
        <Tooltip content="右下" placement="right-end">
          <button style={smallButtonStyle}>右下</button>
        </Tooltip>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '12 种弹出位置的示例',
      },
    },
  },
};

export const Triggers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', padding: '40px' }}>
      <Tooltip content="悬停触发（默认）" trigger="hover">
        <button style={buttonStyle}>Hover 悬停</button>
      </Tooltip>
      <Tooltip content="点击触发" trigger="click">
        <button style={buttonStyle}>Click 点击</button>
      </Tooltip>
      <Tooltip content="聚焦触发" trigger="focus">
        <button style={buttonStyle}>Focus 聚焦</button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '不同的触发方式：hover、click、focus',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', padding: '40px' }}>
      <Tooltip content="正常提示" disabled={false}>
        <button style={buttonStyle}>正常状态</button>
      </Tooltip>
      <Tooltip content="不会显示" disabled>
        <button style={buttonStyle} disabled>禁用状态</button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '禁用状态下的 Tooltip 不会显示',
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', padding: '40px' }}>
        <Tooltip
          content="受控模式的提示"
          open={open}
          onOpenChange={setOpen}
          trigger="manual"
          placement="top"
        >
          <span>受控元素</span>
        </Tooltip>
        <button style={buttonStyle} onClick={() => setOpen(!open)}>
          {open ? '关闭提示' : '打开提示'}
        </button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '受控模式，可通过 open 和 onOpenChange 控制显隐',
      },
    },
  },
};

export const LongContent: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', padding: '40px' }}>
      <Tooltip
        content="这是一段很长的提示内容，用于测试最大宽度和文字换行功能。气泡提示会自动换行显示，最长不超过 300px。"
        placement="top"
      >
        <button style={buttonStyle}>长文本提示</button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '长内容的提示会自动换行',
      },
    },
  },
};
