'use client';

import { type ComponentPropsWithoutRef, useState } from 'react';

import styles from './TextArea.module.css';

type TextAreaProps = Omit<
  ComponentPropsWithoutRef<'textarea'>,
  'value' | 'defaultValue'
> & {
  value?: string;
  defaultValue?: string;
  variant?: 'default';
  maxLength?: number;
};

const TextArea = ({
  value,
  defaultValue,
  onChange,
  variant = 'default',
  maxLength = 3000,
  ...props
}: TextAreaProps) => {
  const [innerValue, setInnerValue] = useState(defaultValue ?? '');

  const isControlled = value !== undefined;
  const rawValue = isControlled ? value : innerValue;
  const displayValue =
    maxLength === undefined ? rawValue : rawValue.slice(0, maxLength);

  const handleChange: ComponentPropsWithoutRef<'textarea'>['onChange'] = (
    e,
  ) => {
    const nextValue = e.currentTarget.value;
    if (maxLength !== undefined && nextValue.length > maxLength) {
      if (!isControlled) {
        setInnerValue(nextValue.slice(0, maxLength));
      }
      return;
    }
    if (!isControlled) setInnerValue(nextValue);
    onChange?.(e);
  };

  const classNames = {
    default: {
      wrapper: 'rounded-lg border border-g-0 border-opacity-60 bg-g-700',
      textarea:
        'min-h-90 mt-4 w-full resize-none bg-transparent px-4 font-body-base text-g-0 placeholder:text-g-0 placeholder:opacity-60 focus:outline-none disabled:opacity-50',
      counter: 'flex justify-end px-5 pb-4 font-body-s text-g-0',
    },
  }[variant];

  return (
    <div className={classNames.wrapper}>
      <textarea
        className={`${classNames.textarea} ${styles.scrollbarTransparentTrack}`}
        value={displayValue}
        onChange={handleChange}
        maxLength={maxLength}
        placeholder="지금 떠오르는 감정이나 생각을 부담없이 작성해보세요!"
        {...props}
      />

      <div className={classNames.counter}>
        {displayValue.length}/{maxLength}자
      </div>
    </div>
  );
};

export default TextArea;
