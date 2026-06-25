import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: '当前状态',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '尺寸',
    },
    activeText: {
      control: 'text',
      description: '开启状态文字',
    },
    inactiveText: {
      control: 'text',
      description: '关闭状态文字',
    },
    activeColor: {
      control: 'color',
      description: '开启状态颜色',
    },
    inactiveColor: {
      control: 'color',
      description: '关闭状态颜色',
    },
    onChange: {
      action: 'changed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
    size: 'medium',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
    size: 'medium',
  },
};

export const WithText: Story = {
  args: {
    checked: false,
    disabled: false,
    size: 'medium',
    activeText: '开启',
    inactiveText: '关闭',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Switch size="small" />
        <span style={{ fontSize: '12px', color: '#909399' }}>Small</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Switch size="medium" />
        <span style={{ fontSize: '12px', color: '#909399' }}>Medium</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Switch size="large" />
        <span style={{ fontSize: '12px', color: '#909399' }}>Large</span>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Switch disabled />
        <span style={{ fontSize: '12px', color: '#909399' }}>Disabled OFF</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Switch checked disabled />
        <span style={{ fontSize: '12px', color: '#909399' }}>Disabled ON</span>
      </div>
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Switch checked activeColor="#67c23a" inactiveColor="#dcdfe6" />
        <span style={{ fontSize: '14px', color: '#606266' }}>Success (green)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Switch checked activeColor="#e6a23c" inactiveColor="#dcdfe6" />
        <span style={{ fontSize: '14px', color: '#606266' }}>Warning (orange)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Switch checked activeColor="#f56c6c" inactiveColor="#dcdfe6" />
        <span style={{ fontSize: '14px', color: '#606266' }}>Danger (red)</span>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    checked: false,
    onChange: fn(),
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Switch {...args} />
      <p style={{ fontSize: '14px', color: '#909399' }}>
        Current state: {args.checked ? 'ON' : 'OFF'}
      </p>
    </div>
  ),
};
