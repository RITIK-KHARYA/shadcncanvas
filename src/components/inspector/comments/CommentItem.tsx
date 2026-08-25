import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Comment } from "@/store/comments-store";
import { cn } from "@/lib/utils";

function timeAgo(timestamp: number): string {
  const seconds = Math.round((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function CommentItem({
  comment,
  onResolve,
}: {
  comment: Comment;
  onResolve: () => void;
}) {
  return (
    <div
      className={cn("flex gap-2 px-4 py-2.5", comment.resolved && "opacity-50")}
    >
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium">
        {comment.avatarInitial}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="font-medium">{comment.author}</span>
          <span className="text-muted-foreground">
            · {timeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="text-xs leading-relaxed wrap-break-word">
          {comment.text}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-pressed={comment.resolved}
        aria-label={comment.resolved ? "Unresolve comment" : "Resolve comment"}
        title={comment.resolved ? "Unresolve" : "Resolve"}
        className={cn("shrink-0", comment.resolved && "text-primary")}
        onClick={onResolve}
      >
        <Check className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}
