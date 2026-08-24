import { CommentInput } from "@/components/inspector/comments/CommentInput";
import { CommentList } from "@/components/inspector/comments/CommentList";
import { useCommentsStore } from "@/store/commentsStore";

export function CommentsPanel({ targetId }: { targetId: string }) {
  const comments = useCommentsStore((s) => s.commentsByTarget[targetId] ?? []);
  const addComment = useCommentsStore((s) => s.addComment);
  const resolveComment = useCommentsStore((s) => s.resolveComment);

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1">
        <CommentList
          comments={comments}
          onResolve={(commentId) => resolveComment(targetId, commentId)}
        />
      </div>
      <CommentInput onSubmit={(text) => addComment(targetId, text)} />
    </div>
  );
}
