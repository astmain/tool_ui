import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Image URL for the avatar',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for the image',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the avatar',
    },
    shape: {
      control: { type: 'select' },
      options: ['circle', 'square'],
      description: 'Shape of the avatar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: 'User Avatar',
    size: 'medium',
    shape: 'circle',
  },
};

export const Image: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=5',
    alt: 'Sarah Wilson',
    size: 'large',
    shape: 'circle',
  },
};

export const Fallback: Story = {
  args: {
    src: 'https://invalid-image-url-example.com/broken.jpg',
    alt: 'Fallback User',
    size: 'large',
    shape: 'circle',
    fallback: <span style={{ color: '#67c23a', fontSize: '24px' }}>自定义</span>,
  },
};

export const IconFallback: Story = {
  args: {
    src: 'https://invalid-image-url-example.com/broken.jpg',
    alt: 'Icon User',
    size: 'large',
    shape: 'circle',
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
};

export const InitialsFallback: Story = {
  args: {
    src: 'https://invalid-image-url-example.com/broken.jpg',
    alt: 'John Smith',
    size: 'large',
    shape: 'circle',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="Small User" size="small" shape="circle" />
      <Avatar src="https://i.pravatar.cc/150?img=4" alt="Medium User" size="medium" shape="circle" />
      <Avatar src="https://i.pravatar.cc/150?img=5" alt="Large User" size="large" shape="circle" />
    </div>
  ),
};

export const CustomSize: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Avatar src="https://i.pravatar.cc/150?img=8" alt="Custom 80px" size={80} shape="circle" />
      <Avatar src="https://i.pravatar.cc/150?img=9" alt="Custom 100px" size={100} shape="circle" />
      <Avatar src="https://i.pravatar.cc/150?img=10" alt="Custom 120px" size={120} shape="circle" />
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Avatar src="https://i.pravatar.cc/150?img=11" alt="Circle Avatar" size="large" shape="circle" />
      <Avatar src="https://i.pravatar.cc/150?img=12" alt="Square Avatar" size="large" shape="square" />
    </div>
  ),
};

export const TextAvatars: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Avatar src="invalid" alt="Alice" size="medium" shape="circle" />
      <Avatar src="invalid" alt="Bob Johnson" size="medium" shape="circle" />
      <Avatar src="invalid" alt="Charlie" size="medium" shape="circle" />
      <Avatar src="invalid" alt="Diana Ross" size="medium" shape="circle" />
    </div>
  ),
};

export const AvatarGroup: Story = {
  render: () => (
    <div style={{ display: 'flex' }}>
      <Avatar src="https://i.pravatar.cc/150?img=15" alt="User 1" size="medium" shape="circle" />
      <Avatar
        src="https://i.pravatar.cc/150?img=16"
        alt="User 2"
        size="medium"
        shape="circle"
        style={{ marginLeft: '-12px', border: '2px solid var(--ui-bg, #ffffff)' }}
      />
      <Avatar
        src="https://i.pravatar.cc/150?img=17"
        alt="User 3"
        size="medium"
        shape="circle"
        style={{ marginLeft: '-12px', border: '2px solid var(--ui-bg, #ffffff)' }}
      />
      <Avatar
        src="https://i.pravatar.cc/150?img=18"
        alt="User 4"
        size="medium"
        shape="circle"
        style={{ marginLeft: '-12px', border: '2px solid var(--ui-bg, #ffffff)' }}
      />
    </div>
  ),
};
