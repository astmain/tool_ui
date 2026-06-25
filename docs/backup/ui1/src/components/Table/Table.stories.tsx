import type { Meta, StoryObj } from '@storybook/react';
import Table from './Table';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    bordered: {
      control: 'boolean',
      description: '是否显示边框',
    },
    striped: {
      control: 'boolean',
      description: '是否显示斑马纹',
    },
    hoverable: {
      control: 'boolean',
      description: '悬停高亮',
    },
    compact: {
      control: 'boolean',
      description: '紧凑模式',
    },
    emptyText: {
      control: 'text',
      description: '空数据文本',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const sampleData = [
  { id: 1, name: '张三', age: 28, city: '北京', status: '在线' },
  { id: 2, name: '李四', age: 34, city: '上海', status: '离线' },
  { id: 3, name: '王五', age: 25, city: '广州', status: '在线' },
  { id: 4, name: '赵六', age: 41, city: '深圳', status: '在线' },
];

const columns = [
  { key: 'id', title: 'ID', width: 60 },
  { key: 'name', title: '姓名', width: 100 },
  { key: 'age', title: '年龄', width: 80, align: 'center' as const },
  { key: 'city', title: '城市', width: 100 },
  { key: 'status', title: '状态', align: 'center' as const },
];

export const Default: Story = {
  args: {
    columns,
    data: sampleData,
  },
};

export const Bordered: Story = {
  args: {
    columns,
    data: sampleData,
    bordered: true,
  },
};

export const Striped: Story = {
  args: {
    columns,
    data: sampleData,
    striped: true,
  },
};

export const Hoverable: Story = {
  args: {
    columns,
    data: sampleData,
    hoverable: true,
  },
};

export const Compact: Story = {
  args: {
    columns,
    data: sampleData,
    compact: true,
  },
};

export const AllFeatures: Story = {
  args: {
    columns,
    data: sampleData,
    bordered: true,
    striped: true,
    hoverable: true,
  },
};

export const WithCustomRender: Story = {
  render: () => {
    const customColumns = [
      { key: 'id', title: 'ID', width: 60 },
      { key: 'name', title: '姓名', width: 100 },
      {
        key: 'age',
        title: '年龄',
        width: 100,
        render: (value: number) => (
          <span style={{ color: value > 30 ? '#e6a23c' : '#67c23a' }}>{value}</span>
        ),
      },
      {
        key: 'status',
        title: '状态',
        align: 'center' as const,
        render: (value: string) => (
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '4px',
              background: value === '在线' ? '#67c23a' : '#909399',
              color: '#fff',
              fontSize: '12px',
            }}
          >
            {value}
          </span>
        ),
      },
    ];

    return <Table columns={customColumns} data={sampleData} bordered />;
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    emptyText: '暂无数据',
  },
};

export const CustomEmptyText: Story = {
  args: {
    columns,
    data: [],
    emptyText: (
      <div style={{ color: '#909399' }}>
        <p>没有找到任何记录</p>
        <p style={{ fontSize: '12px', marginTop: '8px' }}>请尝试其他搜索条件</p>
      </div>
    ),
  },
};

export const FixedColumns: Story = {
  render: () => {
    const fixedColumns = [
      { key: 'id', title: 'ID', width: 80, fixed: 'left' as const },
      { key: 'name', title: '姓名', width: 120 },
      { key: 'email', title: '邮箱', width: 200 },
      { key: 'phone', title: '电话', width: 150 },
      { key: 'city', title: '城市', width: 120 },
      { key: 'country', title: '国家', width: 120 },
      { key: 'company', title: '公司', width: 150 },
      { key: 'department', title: '部门', width: 120 },
      { key: 'position', title: '职位', width: 150 },
      { key: 'status', title: '状态', width: 100, fixed: 'right' as const },
    ];

    const largeData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `用户${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `1380000${String(i + 1).padStart(4, '0')}`,
      city: ['北京', '上海', '广州', '深圳'][i % 4],
      country: '中国',
      company: '示例公司',
      department: ['技术部', '市场部', '人事部'][i % 3],
      position: ['工程师', '经理', '总监'][i % 3],
      status: i % 2 === 0 ? '在线' : '离线',
    }));

    return (
      <Table
        columns={fixedColumns}
        data={largeData}
        bordered
        style={{ maxWidth: '800px' }}
      />
    );
  },
};
