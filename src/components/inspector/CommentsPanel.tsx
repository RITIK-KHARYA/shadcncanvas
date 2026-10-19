import { CommentInput } from "@/components/inspector/comments/CommentInput";
import { CommentList } from "@/components/inspector/comments/CommentList";
import { useCommentsStore } from "@/store/comments-store";
import { useAuth } from "@/hooks/use-auth";

export function CommentsPanel({ targetId }: { targetId: string }) {
  const comments = useCommentsStore((s) => s.commentsByTarget[targetId] ?? []);
  const addComment = useCommentsStore((s) => s.addComment);
  const resolveComment = useCommentsStore((s) => s.resolveComment);

  const { requireAuth } = useAuth();

  const handleSubmitComment = (text: string) => {
    requireAuth(() => {
      addComment(targetId, text);
    });
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1">
        <CommentList
          comments={comments}
          onResolve={(commentId) => resolveComment(targetId, commentId)}
        />
      </div>
      <CommentInput onSubmit={handleSubmitComment} />
    </div>
  );
}
