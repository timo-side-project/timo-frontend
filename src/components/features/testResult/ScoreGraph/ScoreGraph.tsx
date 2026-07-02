import Image from 'next/image';
import { useMemo } from 'react';

import { CATEGORY_CHARACTER_MAP } from '@/src/lib/constants/character';
import { cn } from '@/src/lib/helpers/cn';
import { sortByCategory } from '@/src/lib/helpers/sortByCategory';

import { useIdealScoreGraph } from '../hooks/useIdealScoreGraph';
import { type ResponseType as TestRecordResponseType } from '../queries/useTestRecordQuery';
import { calculateScorePercentage } from '../utils/calculateScorePercentage';
import { formatCharacterName } from '../utils/formatCharacterName';
import { formatPolylinePoints } from '../utils/formatPolylinePoints';

type ScoreGraphProps = Pick<TestRecordResponseType['result'], 'scores'>;

const ScoreGraph = ({ scores }: ScoreGraphProps) => {
  const sortedScores = useMemo(() => sortByCategory(scores), [scores]);

  const { containerRef, dotsRef, linePoints } = useIdealScoreGraph({
    scores: sortedScores,
  });

  return (
    <>
      <div className="flex justify-end items-center pb-3">
        <Image
          src="/glow-dot.svg"
          alt="ideal glow dot"
          width={20}
          height={20}
        />
        <span className="font-caption-n text-g-80">이상적 수치표</span>
      </div>

      <section className="space-y-5">
        <div
          ref={containerRef}
          className="relative w-full bg-g-400 rounded-lg p-6 flex justify-between items-start"
        >
          {linePoints.length > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-1">
              <polyline
                points={formatPolylinePoints({ points: linePoints })}
                fill="none"
                stroke="white"
                strokeWidth="0.8"
              />
            </svg>
          )}

          {sortedScores.map((item, index) => {
            const userPercent = calculateScorePercentage({
              score: item.score,
            });
            const idealPercent = calculateScorePercentage({
              score: item.idealScore,
            });

            const { src, alt, color } = CATEGORY_CHARACTER_MAP[item.category];

            return (
              <div key={item.category} className="flex flex-col items-center">
                <div className="relative h-40 w-6 bg-white/20 rounded-xl">
                  <div
                    className="absolute bottom-0 w-full bg-g-100 rounded-xl"
                    style={{ height: `${userPercent}%` }}
                  />

                  <Image
                    src="/glow-dot.svg"
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ bottom: `${idealPercent}%` }}
                    alt="ideal score"
                    width={20}
                    height={20}
                    ref={(el) => {
                      dotsRef.current[index] = el;
                    }}
                  />
                </div>

                <Image
                  src={src}
                  alt={alt}
                  className="-mt-6 z-1 h-10"
                  width={40}
                  height={40}
                />
                <span
                  className={cn('font-caption-n whitespace-nowrap mt-2', color)}
                >
                  {formatCharacterName({ name: alt })}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-g-60 font-body-s break-keep">
          지금 나는 어떤 시간에 가장 머물러 있을까요? 그래프를 통해 나의 시간
          사용 습관을 확인해보세요! 작은 인식이 더 좋은 균형으로 이어질 수
          있어요.
        </p>
      </section>
    </>
  );
};

export default ScoreGraph;
