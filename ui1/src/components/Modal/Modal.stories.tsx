import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useCallback } from 'react';
import Modal from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the modal is visible',
    },
    title: {
      control: 'text',
      description: 'Modal title',
    },
    content: {
      control: 'text',
      description: 'Modal content',
    },
    width: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      mapping: {
        small: 320,
        medium: 520,
        large: 800,
      },
      description: 'Modal width (pixels)',
    },
    closeOnOverlay: {
      control: 'boolean',
      description: 'Close on overlay click',
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'Close on ESC key',
    },
    showClose: {
      control: 'boolean',
      description: 'Show close button',
    },
    confirmText: {
      control: 'text',
      description: 'Confirm button text',
    },
    cancelText: {
      control: 'text',
      description: 'Cancel button text',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modal dialog component with overlay, animations, and accessibility support.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          打开 Modal
        </button>
        <Modal
          open={isOpen}
          title="提示"
          content="这是一个基础的 Modal 对话框，用于展示信息和操作。"
          onClose={() => setIsOpen(false)}
          onConfirm={() => console.log('Confirmed')}
        />
      </div>
    );
  },
};

export const WithCustomFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          自定义 Footer
        </button>
        <Modal
          open={isOpen}
          title="自定义操作"
          content="这个 Modal 使用了自定义的 footer 插槽，可以放置任意内容。"
          onClose={() => setIsOpen(false)}
          footer={
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'var(--ui-border-lighter)',
                  border: 'none',
                  borderRadius: 'var(--ui-radius)',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                重置
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'var(--ui-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--ui-radius)',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                保存
              </button>
            </div>
          }
        />
      </div>
    );
  },
};

export const WithCustomContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          自定义内容
        </button>
        <Modal
          open={isOpen}
          title="表单示例"
          onClose={() => setIsOpen(false)}
          footer={
            <>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid var(--ui-border)',
                  borderRadius: 'var(--ui-radius)',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                取消
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '10px 20px',
                  background: 'var(--ui-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--ui-radius)',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                提交
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--ui-text-regular)' }}>
                用户名
              </label>
              <input
                type="text"
                placeholder="请输入用户名"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--ui-border)',
                  borderRadius: 'var(--ui-radius)',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--ui-text-regular)' }}>
                邮箱
              </label>
              <input
                type="email"
                placeholder="请输入邮箱"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--ui-border)',
                  borderRadius: 'var(--ui-radius)',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

export const SmallSize: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          小尺寸 Modal
        </button>
        <Modal
          open={isOpen}
          title="小尺寸"
          content="这是一个小尺寸的 Modal，宽度为 320px。"
          width={320}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const LargeSize: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          大尺寸 Modal
        </button>
        <Modal
          open={isOpen}
          title="大尺寸内容"
          content="这是一个大尺寸的 Modal，宽度为 800px，适用于展示更多内容。可以通过 width 属性设置不同的尺寸。"
          width={800}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const WithoutHeader: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          无标题 Modal
        </button>
        <Modal
          open={isOpen}
          content="这是一个没有标题的 Modal，只有内容和操作按钮。"
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const WithoutFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          无 Footer Modal
        </button>
        <Modal
          open={isOpen}
          title="纯内容展示"
          content="这是一个没有 Footer 的 Modal，仅用于信息展示。点击遮罩层或按 ESC 键可以关闭。"
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const MultipleModals: Story = {
  render: () => {
    const [isOpenFirst, setIsOpenFirst] = useState(false);
    const [isOpenSecond, setIsOpenSecond] = useState(false);

    return (
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setIsOpenFirst(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Modal 1
        </button>
        <button
          onClick={() => setIsOpenSecond(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-success)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Modal 2
        </button>
        <Modal
          open={isOpenFirst}
          title="第一个 Modal"
          content="可以打开多个 Modal，但由于 z-index 相同，后打开的会在上面。"
          onClose={() => setIsOpenFirst(false)}
          onConfirm={() => setIsOpenSecond(true)}
        />
        <Modal
          open={isOpenSecond}
          title="第二个 Modal"
          content="这是第二个 Modal，演示多个 Modal 并存的情况。"
          onClose={() => setIsOpenSecond(false)}
        />
      </div>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const longText = `
      这是一段很长的内容用于测试 Modal 的滚动功能。
      我们添加了很多文字来模拟实际使用中可能遇到的场景。
      
      第一段：Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      
      第二段：Ut enim ad minim veniam, quis nostrud exercitation ullamco 
      laboris nisi ut aliquip ex ea commodo consequat.
      
      第三段：Duis aute irure dolor in reprehenderit in voluptate velit 
      esse cillum dolore eu fugiat nulla pariatur.
      
      第四段：Excepteur sint occaecat cupidatat non proident, sunt in 
      culpa qui officia deserunt mollit anim id est laborum.
      
      第五段：继续添加更多内容来测试滚动条的显示效果。
      内容区域应该可以滚动，而不会被压缩或溢出。
      
      第六段：这是最后一段，确保 Modal 能够正确处理长内容的情况。
    `;

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          长内容 Modal
        </button>
        <Modal
          open={isOpen}
          title="长内容测试"
          content={longText}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const ConfirmationDialog: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleConfirm = useCallback(() => {
      setResult('已确认');
      setIsOpen(false);
    }, []);

    const handleCancel = useCallback(() => {
      setResult('已取消');
      setIsOpen(false);
    }, []);

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-danger)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          删除确认
        </button>
        {result && (
          <p style={{ marginTop: '16px', color: 'var(--ui-text-regular)' }}>
            操作结果：{result}
          </p>
        )}
        <Modal
          open={isOpen}
          title="确认删除"
          content="确定要删除这个项目吗？此操作无法撤销。"
          confirmText="删除"
          cancelText="取消"
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </div>
    );
  },
};

export const NoOverlayClose: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          禁止遮罩关闭
        </button>
        <Modal
          open={isOpen}
          title="禁止遮罩关闭"
          content="点击遮罩层不会关闭此 Modal，必须使用关闭按钮或 ESC 键。"
          closeOnOverlay={false}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const NoEscClose: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--ui-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--ui-radius)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          禁止 ESC 关闭
        </button>
        <Modal
          open={isOpen}
          title="禁止 ESC 关闭"
          content="按 ESC 键不会关闭此 Modal，必须使用关闭按钮或点击遮罩层。"
          closeOnEsc={false}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};
