'use client';

import Image from 'next/image';
import type { ChangeEvent, FormEvent } from 'react';

import BottomCTA from '@/src/components/layout/BottomCTA/BottomCTA';
import Button from '@/src/components/ui/Button/Button';

interface GroupFormProps {
  name: string;
  onNameChange: (value: string) => void;
  imagePreview: string | null;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  submitLabel: string;
  isPending: boolean;
}

const GroupForm = ({
  name,
  onNameChange,
  imagePreview,
  onImageChange,
  onSubmit,
  submitLabel,
  isPending,
}: GroupFormProps) => {
  return (
    <>
      <form
        onSubmit={onSubmit}
        className="pt-14 px-7.5 pb-32 flex flex-col gap-8"
      >
        <div>
          <h2 className="font-heading-h4 mt-8">그룹 이름을 작성해주세요</h2>
          <div className="mt-5">
            <label
              htmlFor="group-name"
              className="pl-2 font-caption-n text-g-80"
            >
              그룹 이름
            </label>
            <input
              id="group-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="그룹 이름을 입력해주세요"
              className="mt-2 h-12 w-full rounded-xl border border-g-500 bg-g-700 px-2 font-body-s text-g-0 placeholder:text-g-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <h2 className="font-heading-h4">대표 이미지를 선택해주세요</h2>
          <div className="mt-5">
            <label
              htmlFor="group-image"
              className="pl-2 font-caption-n text-g-80"
            >
              대표 이미지
            </label>
            <label
              htmlFor="group-image"
              className="relative mt-2 w-full aspect-square rounded-2xl bg-g-600 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="그룹 대표 이미지 미리보기"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/icons/image-placeholder.svg"
                  width={49}
                  height={49}
                  alt=""
                />
              )}
            </label>
            <input
              id="group-image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onImageChange}
            />
          </div>
        </div>
      </form>

      <BottomCTA>
        <Button label={submitLabel} onClick={onSubmit} disabled={isPending} />
      </BottomCTA>
    </>
  );
};

export default GroupForm;
