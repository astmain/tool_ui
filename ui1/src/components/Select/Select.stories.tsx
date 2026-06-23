import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Select from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: 'Whether multiple options can be selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    clearable: {
      control: 'boolean',
      description: 'Whether the selected value can be cleared',
    },
    filterable: {
      control: 'boolean',
      description: 'Whether the options can be filtered/searched',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const defaultOptions = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' },
  { label: '禁用选项', value: 'option4', disabled: true },
];

export const Default: Story = {
  args: {
    placeholder: '请选择',
    options: defaultOptions,
  },
};

export const Multiple: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(['option1', 'option2']);
    return (
      <Select
        multiple
        value={value}
        onChange={(v) => setValue(v as string[])}
        options={defaultOptions}
        placeholder="请选择（多选）"
        style={{ width: '300px' }}
      />
    );
  },
};

export const Filterable: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <Select
        filterable
        value={value}
        onChange={(v) => setValue(v as string)}
        options={defaultOptions}
        placeholder="请选择并搜索"
        style={{ width: '300px' }}
      />
    );
  },
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = React.useState('option1');
    return (
      <Select
        clearable
        value={value}
        onChange={(v) => setValue(v as string)}
        options={defaultOptions}
        placeholder="请选择"
        style={{ width: '300px' }}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <Select
        disabled
        value="option1"
        options={defaultOptions}
        placeholder="禁用状态"
        style={{ width: '300px' }}
      />
    );
  },
};

export const WithInitialValue: Story = {
  args: {
    value: 'option2',
    options: defaultOptions,
    placeholder: '请选择',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ marginBottom: '8px', color: '#606266' }}>默认宽度</p>
        <Select
          options={defaultOptions}
          placeholder="请选择"
        />
      </div>
      <div>
        <p style={{ marginBottom: '8px', color: '#606266' }}>固定宽度</p>
        <Select
          options={defaultOptions}
          placeholder="请选择"
          style={{ width: '400px' }}
        />
      </div>
    </div>
  ),
};
