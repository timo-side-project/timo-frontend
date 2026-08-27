import Icon from '@/src/components/ui/Icon/Icon';
import { cn } from '@/src/lib/helpers/cn';

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const CommentInput = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
}: CommentInputProps) => {
  const canSubmit = value.trim().length > 0 && !disabled;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit();
  };

  return (
    <div className="flex w-full items-center gap-2.5">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={1}
        className="h-13.25 w-full resize-none overflow-y-auto rounded-lg border border-g-40 bg-transparent p-4 font-body-s text-g-60 placeholder:text-g-80 focus:outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        aria-label="댓글 전송"
        className={cn(
          'flex size-13 shrink-0 items-center justify-center rounded-lg',
          canSubmit ? 'bg-primary' : 'bg-g-200',
        )}
      >
        <Icon name="send" size={32} decorative />
      </button>
    </div>
  );
};

export default CommentInput;
