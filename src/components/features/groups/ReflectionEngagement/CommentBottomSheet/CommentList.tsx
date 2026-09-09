import type { ReflectionComment } from '../../queries/useReflectionCommentsQuery';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: ReflectionComment[];
  currentUserId?: number;
  editingCommentId: number | null;
  onEditStart: (comment: ReflectionComment) => void;
  onEditSubmit: (comment: ReflectionComment, content: string) => void;
  onEditCancel: () => void;
  onDelete: (comment: ReflectionComment) => void;
}

const CommentList = ({
  comments,
  currentUserId,
  editingCommentId,
  onEditStart,
  onEditSubmit,
  onEditCancel,
  onDelete,
}: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="flex h-47.75 w-full items-center justify-center rounded-lg bg-g-500 backdrop-blur-[5px]">
        <p className="font-body-s text-g-80">첫 번째 댓글을 작성해주세요</p>
      </div>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-3.75 overflow-y-auto">
      {comments.map((comment) => {
        const isMine = comment.commenterId === currentUserId;
        return (
          <li key={comment.id}>
            <CommentItem
              comment={comment}
              isMine={isMine}
              isEditing={editingCommentId === comment.id}
              onEditStart={isMine ? () => onEditStart(comment) : undefined}
              onEditSubmit={
                isMine ? (content) => onEditSubmit(comment, content) : undefined
              }
              onEditCancel={isMine ? onEditCancel : undefined}
              onDelete={isMine ? () => onDelete(comment) : undefined}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default CommentList;
