import Card from '@/src/components/ui/Card/Card';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';

interface QuestionCardProps {
  isLoading: boolean;
  isReady: boolean;
  questionContent: string;
}

const QuestionCard = ({
  isLoading,
  isReady,
  questionContent,
}: QuestionCardProps) => {
  return (
    <section>
      <Card className="w-full bg-g-400">
        {isLoading && (
          <Skeleton className="h-20 py-2" ariaLabel="오늘의 질문 불러오는 중" />
        )}

        {isReady && !isLoading && (
          <div className="flex h-full flex-col justify-start">
            <p className="font-heading-h4 text-g-0">{questionContent}</p>
          </div>
        )}
      </Card>
    </section>
  );
};

export default QuestionCard;
