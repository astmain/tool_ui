import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';
import { Dropdown } from './Dropdown';
import type { MenuItem } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    trigger: {
      control: 'select',
      options: ['hover', 'click', 'manual'],
      description: '触发方式',
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '弹出方向',
    },
    align: {
      control: 'select',
      options: ['start', 'end'],
      description: '对齐方式',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    onSelect: {
      action: 'selected',
      description: '选中回调',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const basicMenu: MenuItem[] = [
  { key: 'profile', label: '个人中心' },
  { key: 'settings', label: '设置' },
  { key: 'logout', label: '退出登录' },
];

const menuWithDividers: MenuItem[] = [
  { key: 'copy', label: '复制' },
  { key: 'cut', label: '剪切' },
  { key: 'paste', label: '粘贴' },
  { key: 'd-divider', label: '', divided: true },
  { key: 'delete', label: '删除' },
];

const menuWithDisabled: MenuItem[] = [
  { key: 'action1', label: '操作一' },
  { key: 'action2', label: '操作二（禁用）', disabled: true },
  { key: 'action3', label: '操作三' },
  { key: 'action4', label: '操作四（禁用）', disabled: true },
];

const menuWithSubMenu: MenuItem[] = [
  { key: 'email', label: '邮件' },
  { key: 'tasks', label: '任务', children: [
    { key: 'task1', label: '已完成' },
    { key: 'task2', label: '进行中' },
    { key: 'task3', label: '待处理' },
  ]},
  { key: 'settings', label: '设置' },
];

export const Default: Story = {
  args: {
    trigger: 'click',
    placement: 'bottom',
    align: 'start',
    disabled: false,
    menu: basicMenu,
    onSelect: fn(),
    children: <button style={{
        padding: '8px 16px',
        fontSize: '14px',
        borderRadius: '6px',
        border: '1px solid #409eff',
        background: '#409eff',
        color: '#fff',
        cursor: 'pointer',
      }}>点击下拉</button>,
  },
};

export const ClickTrigger: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string>('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Dropdown
          trigger="click"
          menu={basicMenu}
          onSelect={(key) => setSelected(key)}
        >
          <button style={{
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #dcdfe6',
          background: '#fff',
          color: '#303133',
          cursor: 'pointer',
        }}>点击下拉菜单</button>
        </Dropdown>
        <p style={{ fontSize: '14px', color: '#909399' }}>
          选中项: <strong>{selected || '无'}</strong>
        </p>
      </div>
    );
  },
};

export const HoverTrigger: Story = {
  render: () => (
    <Dropdown
      trigger="hover"
      menu={basicMenu}
      onSelect={fn()}
    >
      <button style={{
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #dcdfe6',
          background: '#fff',
          color: '#303133',
          cursor: 'pointer',
        }}>悬停下拉菜单</button>
    </Dropdown>
  ),
};

export const WithDividers: Story = {
  render: () => (
    <Dropdown
      trigger="click"
      menu={menuWithDividers}
      onSelect={fn()}
    >
      <button style={{
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #dcdfe6',
          background: '#fff',
          color: '#303133',
          cursor: 'pointer',
        }}>带分割线的菜单</button>
    </Dropdown>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <Dropdown
      trigger="click"
      menu={menuWithDisabled}
      onSelect={fn()}
    >
      <button style={{
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #dcdfe6',
          background: '#fff',
          color: '#303133',
          cursor: 'pointer',
        }}>包含禁用项的菜单</button>
    </Dropdown>
  ),
};

export const PlacementTop: Story = {
  render: () => (
    <div style={{ marginTop: '200px' }}>
      <Dropdown
        trigger="click"
        placement="top"
        menu={basicMenu}
        onSelect={fn()}
      >
        <button style={{
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #dcdfe6',
          background: '#fff',
          color: '#303133',
          cursor: 'pointer',
        }}>向上弹出</button>
      </Dropdown>
    </div>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Dropdown
        trigger="click"
        align="end"
        menu={basicMenu}
        onSelect={fn()}
      >
        <button style={{
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #dcdfe6',
          background: '#fff',
          color: '#303133',
          cursor: 'pointer',
        }}>右对齐菜单</button>
      </Dropdown>
    </div>
  ),
};

export const DisabledDropdown: Story = {
  render: () => (
    <Dropdown
      trigger="click"
      menu={basicMenu}
      disabled
    >
      <button style={{
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #dcdfe6',
          background: '#f5f7fa',
          color: '#c0c4cc',
          cursor: 'not-allowed',
        }} disabled>禁用状态</button>
    </Dropdown>
  ),
};

export const Interactive: Story = {
  args: {
    trigger: 'click',
    placement: 'bottom',
    menu: basicMenu,
    onSelect: fn(),
    children: <button style={{
        padding: '8px 16px',
        fontSize: '14px',
        borderRadius: '6px',
        border: '1px solid #409eff',
        background: '#409eff',
        color: '#fff',
        cursor: 'pointer',
      }}>交互演示</button>,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Dropdown {...args}>
        {args.children}
      </Dropdown>
      <p style={{ fontSize: '14px', color: '#909399' }}>
        尝试点击按钮打开菜单，或使用 Tab 键聚焦后按 Enter/Space 打开。
      </p>
    </div>
  ),
};
