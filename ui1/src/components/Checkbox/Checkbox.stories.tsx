import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Checkbox from './Checkbox';
import CheckboxGroup from './CheckboxGroup';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in indeterminate state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    label: {
      control: 'text',
      description: 'Label text for the checkbox',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the checkbox',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Checkbox',
    size: 'medium',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Accept terms and conditions',
    size: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
    size: 'medium',
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Indeterminate state',
    indeterminate: true,
    size: 'medium',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox size="small" label="Small checkbox" />
      <Checkbox size="medium" label="Medium checkbox" />
      <Checkbox size="large" label="Large checkbox" />
    </div>
  ),
};

export const Group: Story = {
  render: () => {
    const options = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
      { label: 'Disabled option', value: 'option4', disabled: true },
    ];

    const [selected, setSelected] = React.useState<string[]>(['option1']);

    return (
      <CheckboxGroup
        options={options}
        value={selected}
        onChange={setSelected}
      />
    );
  },
};

export const GroupDisabled: Story = {
  render: () => {
    const options = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ];

    return (
      <CheckboxGroup
        options={options}
        defaultValue={['option1', 'option2']}
        disabled
      />
    );
  },
};
