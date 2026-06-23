import type { Meta, StoryObj } from '@storybook/react';
import { useState, useCallback } from 'react';
import Textarea from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '当前值',
    },
    placeholder: {
      control: 'text',
      description: '占位文本',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    readonly: {
      control: 'boolean',
      description: '是否只读',
    },
    rows: {
      control: { type: 'select' },
      options: [2, 3, 4, 5, 6, 8, 10],
      description: '显示行数',
    },
    maxLength: {
      control: { type: 'number', min: 1, max: 10000 },
      description: '最大字符数',
    },
    showCount: {
      control: 'boolean',
      description: '是否显示字数统计',
    },
    autosize: {
      control: { type: 'select' },
      options: ['false', 'true', '{ minRows: 2, maxRows: 6 }'],
      mapping: {
        'false': false,
        'true': true,
        '{ minRows: 2, maxRows: 6 }': { minRows: 2, maxRows: 6 },
      },
      description: '自适应高度',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '多行文本输入框组件，支持自适应高度、字数统计等功能。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// Default story
export const Default: Story = {
  args: {
    placeholder: '请输入文本...',
    rows: 4,
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
};

// With character count
export const WithCount: Story = {
  args: {
    placeholder: '请输入文本（最多100字）...',
    maxLength: 100,
    showCount: true,
    rows: 4,
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: '显示当前字数和最大字数，当达到最大字数时数字变红。',
      },
    },
  },
};

// Autosize story
export const Autosize: Story = {
  args: {
    placeholder: '输入文本会自动调整高度...',
    autosize: true,
    rows: 2,
  },
  render: (args) => {
    const [value, setValue] = useState('这是一段初始文本。\n\n当您输入更多内容时，文本域会自动调整高度。');
    return (
      <Textarea
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: '启用自适应高度，文本域会根据内容自动调整大小。',
      },
    },
  },
};

// Autosize with min/max rows
export const AutosizeWithLimits: Story = {
  args: {
    placeholder: '限制最小2行，最大6行...',
    autosize: { minRows: 2, maxRows: 6 },
    rows: 2,
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: '设置最小和最大行数限制。',
      },
    },
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    placeholder: '禁用状态...',
    value: '这是一段禁用的文本，无法编辑。',
    disabled: true,
    rows: 3,
  },
  parameters: {
    docs: {
      description: {
        story: '禁用状态，不可编辑。',
      },
    },
  },
};

// Readonly state
export const Readonly: Story = {
  args: {
    placeholder: '只读状态...',
    value: '这是一段只读文本，显示但不充许编辑。',
    readonly: true,
    rows: 3,
  },
  parameters: {
    docs: {
      description: {
        story: '只读状态，显示文本但不充许编辑。',
      },
    },
  },
};

// Interactive playground
export const Playground: Story = {
  args: {
    placeholder: '自由练习...',
    rows: 4,
  },
  render: (args) => {
    const [value, setValue] = useState('');
    
    const handleFocus = useCallback(() => {
      console.log('Textarea focused');
    }, []);
    
    const handleBlur = useCallback(() => {
      console.log('Textarea blurred');
    }, []);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <Textarea
          {...args}
          value={value}
          onChange={setValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div style={{ fontSize: '12px', color: 'var(--ui-text-secondary)' }}>
          当前值长度: {value.length}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '交互式练习场，可以测试所有属性。',
      },
    },
  },
};

// All states showcase
export const AllStates: Story = {
  render: () => {
    const [basicValue, setBasicValue] = useState('');
    const [countValue, setCountValue] = useState('');
    const [autosizeValue, setAutosizeValue] = useState('');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
        <div>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>基本状态</h4>
          <Textarea
            placeholder="请输入文本..."
            value={basicValue}
            onChange={setBasicValue}
            rows={3}
          />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>带字数统计</h4>
          <Textarea
            placeholder="请输入文本（最多50字）..."
            value={countValue}
            onChange={setCountValue}
            maxLength={50}
            showCount
            rows={3}
          />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>自适应高度</h4>
          <Textarea
            placeholder="输入文本会自动调整高度..."
            value={autosizeValue}
            onChange={setAutosizeValue}
            autosize={{ minRows: 2, maxRows: 8 }}
            rows={2}
          />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>禁用状态</h4>
          <Textarea
            value="禁用的文本域"
            disabled
            rows={2}
          />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>只读状态</h4>
          <Textarea
            value="只读的文本域"
            readonly
            rows={2}
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '展示 Textarea 组件的所有状态和变体。',
      },
    },
  },
};
