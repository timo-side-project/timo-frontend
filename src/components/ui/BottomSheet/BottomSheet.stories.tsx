import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import BottomSheet from './BottomSheet';

const meta = {
  title: 'UI/BottomSheet',
  component: BottomSheet,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    ariaLabel: '예시 시트',
    children: null,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-10">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg bg-g-0 px-4 py-3 font-body-s text-g-900"
        >
          시트 열기
        </button>

        <BottomSheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p className="font-body-s text-g-0">
            오버레이나 ESC로 닫을 수 있습니다.
          </p>
        </BottomSheet>
      </div>
    );
  },
};
