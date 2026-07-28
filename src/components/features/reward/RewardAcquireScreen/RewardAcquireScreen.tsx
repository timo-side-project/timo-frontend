import Image from 'next/image';

import Button from '@/src/components/ui/Button/Button';

interface RewardAcquireScreenProps {
  badgeText: string;
  rewardName: string;
  suffix: string;
  imageSrc?: string;
  imageAlt?: string;
  onApply: () => void;
  onSave: () => void;
}

// TODO(#189): 후속 연동 필요
// - imageSrc: 실제 보상 일러스트 asset/API 연결 (미전달 시 빈 프리뷰 박스)
// - onApply/onSave: 적용·저장 API 호출 + 완료 모달(홈 이동) 흐름 wiring
const RewardAcquireScreen = ({
  badgeText,
  rewardName,
  suffix,
  imageSrc,
  imageAlt = `${rewardName} 이미지`,
  onApply,
  onSave,
}: RewardAcquireScreenProps) => {
  return (
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-110 -translate-x-1/2 flex-col overflow-y-auto bg-g-700 px-7.5 py-8">
      <div className="my-auto flex flex-col items-center gap-15">
        <div className="relative aspect-269/332 w-full max-w-67 overflow-hidden rounded-2xl bg-g-600">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 440px) 100vw, 440px"
            />
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-5">
          <span className="rounded-2xl bg-g-300 px-6 py-1 font-label-n text-g-0">
            {badgeText}
          </span>
          <p className="text-center font-heading-h3 text-g-0">
            <span className="text-primary">{rewardName}</span>
            {suffix}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button label="바로 적용하기" onClick={onApply} />
        <Button label="저장하기" variant="secondary" onClick={onSave} />
      </div>
    </div>
  );
};

export default RewardAcquireScreen;
