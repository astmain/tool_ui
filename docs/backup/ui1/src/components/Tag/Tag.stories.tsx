import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Tag from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'danger', 'info'],
      description: 'Tag type/color',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tag size',
    },
    closable: {
      control: 'boolean',
      description: 'Whether the tag can be closed',
    },
    hit: {
      control: 'boolean',
      description: 'Whether the tag has highlighted border',
    },
    color: {
      control: 'color',
      description: 'Custom color',
    },
    effect: {
      control: { type: 'select' },
      options: ['light', 'dark', 'plain'],
      description: 'Theme effect',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when close icon is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Tag',
    type: 'primary',
    size: 'medium',
  },
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <Tag type="primary">Primary</Tag>
      <Tag type="success">Success</Tag>
      <Tag type="warning">Warning</Tag>
      <Tag type="danger">Danger</Tag>
      <Tag type="info">Info</Tag>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
      <Tag size="small">Small</Tag>
      <Tag size="medium">Medium</Tag>
      <Tag size="large">Large</Tag>
    </div>
  ),
};

export const Closable: Story = {
  render: () => {
    const [tags, setTags] = React.useState(['Tag 1', 'Tag 2', 'Tag 3']);

    const handleClose = (index: number) => {
      setTags((prev) => prev.filter((_, i) => i !== index));
    };

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {tags.map((tag, index) => (
          <Tag key={tag} closable onClose={() => handleClose(index)}>
            {tag}
          </Tag>
        ))}
      </div>
    );
  },
};

export const Effects: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <strong>Light:</strong>
        <Tag effect="light" type="primary">Primary</Tag>
        <Tag effect="light" type="success">Success</Tag>
        <Tag effect="light" type="warning">Warning</Tag>
        <Tag effect="light" type="danger">Danger</Tag>
        <Tag effect="light" type="info">Info</Tag>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <strong>Dark:</strong>
        <Tag effect="dark" type="primary">Primary</Tag>
        <Tag effect="dark" type="success">Success</Tag>
        <Tag effect="dark" type="warning">Warning</Tag>
        <Tag effect="dark" type="danger">Danger</Tag>
        <Tag effect="dark" type="info">Info</Tag>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <strong>Plain:</strong>
        <Tag effect="plain" type="primary">Primary</Tag>
        <Tag effect="plain" type="success">Success</Tag>
        <Tag effect="plain" type="warning">Warning</Tag>
        <Tag effect="plain" type="danger">Danger</Tag>
        <Tag effect="plain" type="info">Info</Tag>
      </div>
    </div>
  ),
};

export const Hit: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <Tag hit type="primary">Primary Hit</Tag>
      <Tag hit type="success">Success Hit</Tag>
      <Tag hit type="warning">Warning Hit</Tag>
      <Tag hit type="danger">Danger Hit</Tag>
      <Tag hit type="info">Info Hit</Tag>
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Tag color="#9c27b0">Purple Light</Tag>
        <Tag color="#e91e63">Pink Light</Tag>
        <Tag color="#00bcd4">Cyan Light</Tag>
        <Tag color="#ff9800">Orange Light</Tag>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Tag color="#9c27b0" effect="dark">Purple Dark</Tag>
        <Tag color="#e91e63" effect="dark">Pink Dark</Tag>
        <Tag color="#00bcd4" effect="dark">Cyan Dark</Tag>
        <Tag color="#ff9800" effect="dark">Orange Dark</Tag>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Tag color="#9c27b0" effect="plain">Purple Plain</Tag>
        <Tag color="#e91e63" effect="plain">Pink Plain</Tag>
        <Tag color="#00bcd4" effect="plain">Cyan Plain</Tag>
        <Tag color="#ff9800" effect="plain">Orange Plain</Tag>
      </div>
    </div>
  ),
};

export const AllSizesAndTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ width: '60px', fontWeight: 500 }}>{size}:</span>
          <Tag size={size} type="primary">Primary</Tag>
          <Tag size={size} type="success">Success</Tag>
          <Tag size={size} type="warning">Warning</Tag>
          <Tag size={size} type="danger">Danger</Tag>
          <Tag size={size} type="info">Info</Tag>
        </div>
      ))}
    </div>
  ),
};

export const ClosableMixed: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <Tag type="primary" closable>Primary</Tag>
      <Tag type="success" closable>Success</Tag>
      <Tag type="warning" closable>Warning</Tag>
      <Tag type="danger" closable>Danger</Tag>
      <Tag type="info" closable>Info</Tag>
      <Tag color="#9c27b0" closable>Custom</Tag>
    </div>
  ),
};
