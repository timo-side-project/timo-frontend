'use client';

import Image from 'next/image';

import Badge from '@/src/components/ui/Badge/Badge';
import type { Category } from '@/src/lib/constants/character';
import { CATEGORY_CHARACTER_MAP } from '@/src/lib/constants/character';
import { getCategoryMessage } from '@/src/lib/helpers/getCategoryMessage';

interface DetailProps {
  questionCategory: Category;
  questionContent: string;
  feedbackContent?: string | null;
  answerContent: string;
  friendNickname?: string;
}

const Detail = ({
  questionCategory,
  questionContent,
  answerContent,
  feedbackContent,
  friendNickname,
}: DetailProps) => {
  const { src, alt, color } = CATEGORY_CHARACTER_MAP[questionCategory];
  const categoryMessage = getCategoryMessage(questionCategory);

  return (
    <article className="space-y-10">
      <section className="space-y-5">
        <Badge>{friendNickname ? friendNickname : '나'}의 회고</Badge>

        <h1 className="font-heading-h4 text-primary">{questionContent}</h1>
        <p className="font-body-s text-g-60">{answerContent}</p>
      </section>

      <section className="bg-g-20 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col items-center">
          <Image src={src} alt={alt} width={120} height={120} />
        </div>

        <p className="font-heading-h4 text-g-900">
          {categoryMessage.prefix}
          <span className={color}>{categoryMessage.highlight}</span>
          {categoryMessage.suffix}
        </p>

        {!friendNickname && (
          <p className="font-body-s text-g-600">{feedbackContent}</p>
        )}
      </section>
    </article>
  );
};

export default Detail;
