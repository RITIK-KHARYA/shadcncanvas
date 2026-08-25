import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type NodeSkeletonProps = {
  componentType: string;
  /** Fill the full node body width (custom-size nodes). */
  fill?: boolean;
};

function Lines({ count, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {Array.from({ length: count ?? 3 }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3", i === (count ?? 3) - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

/**
 * Renders the skeleton (loading) form of any registered component type.
 * Shown by BaseNode while a `loading` signal is wired into the node.
 */
export function NodeSkeleton({ componentType, fill }: NodeSkeletonProps) {
  const wide = fill || undefined;

  switch (componentType) {
    case "button":
    case "badge":
      return <Skeleton className={cn("h-8 w-24 rounded-md", wide)} />;

    case "input":
    case "select":
    case "native-select":
      return <Skeleton className={cn("h-9 w-48 rounded-md", wide)} />;

    case "textarea":
      return <Skeleton className={cn("h-20 w-48 rounded-md", wide)} />;

    case "checkbox":
    case "switch":
    case "field":
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-sm" />
          <Skeleton className="h-3 w-28" />
        </div>
      );

    case "label":
    case "kbd":
    case "marker":
      return <Skeleton className="h-4 w-32" />;

    case "separator":
      return <Skeleton className="h-px w-48" />;

    case "skeleton":
      return <Skeleton className="h-10 w-full" />;

    case "card":
    case "form":
    case "empty":
      return (
        <div
          className={cn("w-56 space-y-3 rounded-lg border bg-card p-4", wide)}
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          {componentType === "empty" ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="h-3 w-24" />
            </div>
          ) : (
            <>
              <Skeleton className="h-8 w-full rounded-md" />
              {componentType === "form" && (
                <>
                  <Skeleton className="h-8 w-full rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </>
              )}
            </>
          )}
        </div>
      );

    case "tabs":
      return (
        <div className={cn("w-56 space-y-2", wide)}>
          <div className="flex gap-1">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      );

    case "button-group":
      return (
        <div className="flex overflow-hidden rounded-md">
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              className="h-8 w-14 rounded-none border-l-0 first:rounded-l-md first:border-l last:rounded-r-md"
            />
          ))}
        </div>
      );

    case "calendar":
      return (
        <div
          className={cn(
            "w-64 space-y-2 rounded-lg border bg-background p-3",
            wide,
          )}
        >
          <div className="flex items-center justify-between">
            <Skeleton className="size-6 rounded-sm" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-6 rounded-sm" />
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="size-7 rounded-sm" />
            ))}
          </div>
        </div>
      );

    case "carousel":
      return (
        <div className={cn("flex w-60 items-center gap-2", wide)}>
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <Skeleton className="aspect-video flex-1 rounded-lg" />
          <Skeleton className="size-8 shrink-0 rounded-full" />
        </div>
      );

    case "chart":
      return (
        <div
          className={cn(
            "flex aspect-video h-32 w-64 items-end gap-2 border-b border-l p-2",
            wide,
          )}
        >
          {[40, 70, 55, 85, 65].map((height, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t-sm"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      );

    case "command":
      return (
        <div className={cn("w-64 space-y-2 rounded-lg border p-2", wide)}>
          <Skeleton className="h-9 w-full rounded-sm" />
          <Lines count={4} className="px-1" />
        </div>
      );

    case "dialog":
    case "drawer":
    case "hover-card":
      return <Skeleton className="h-8 w-28 rounded-md" />;

    case "item":
      return (
        <div className={cn("w-56 space-y-2", wide)}>
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-md border p-2.5"
            >
              <Skeleton className="size-8 shrink-0 rounded-sm" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              <Skeleton className="size-4 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      );

    case "bubble":
      return <Skeleton className="h-10 w-44 rounded-2xl" />;

    case "message":
    case "message-scroller":
      return (
        <div className={cn("w-56 space-y-3", wide)}>
          <div className="flex items-end gap-2">
            <Skeleton className="size-7 shrink-0 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-2xl rounded-bl-md" />
          </div>
          <div className="flex flex-row-reverse items-end gap-2">
            <Skeleton className="size-7 shrink-0 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-2xl rounded-br-md" />
          </div>
          {componentType === "message-scroller" && (
            <div className="flex items-end gap-2">
              <Skeleton className="size-7 shrink-0 rounded-full" />
              <Skeleton className="h-11 w-40 rounded-2xl rounded-bl-md" />
            </div>
          )}
        </div>
      );

    case "direction":
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      );

    case "toast":
      return (
        <div className="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2.5">
          <Skeleton className="size-4 shrink-0 rounded-full" />
          <Skeleton className="h-3 w-28" />
        </div>
      );

    case "apiCall":
      return (
        <div className={cn("w-56 space-y-2 rounded-lg border p-3", wide)}>
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-full" />
        </div>
      );

    default:
      return (
        <div className={cn("w-48", wide)}>
          <Lines />
        </div>
      );
  }
}
