import { CommentItem } from "@/components/inspector/comments/CommentItem"
import type { Comment } from "@/store/commentsStore"

export function CommentList({
  comments,
  onResolve,
}: {
  comments: Comment[]
  onResolve: (commentId: string) => void
}) {
  if (comments.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-xs text-muted-foreground">
        No comments yet.
      </p>
    )
  }

  return (
    <div className="divide-y divide-border">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onResolve={() => onResolve(comment.id)}
        />
      ))}
    </div>
  )
}
