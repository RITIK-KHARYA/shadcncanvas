import { create } from "zustand"

export type Comment = {
  id: string
  author: string
  avatarInitial: string
  text: string
  createdAt: number
  resolved: boolean
}

/** Comments are keyed by target id — a node id, or "page" for canvas-level notes. */
type CommentsStore = {
  commentsByTarget: Record<string, Comment[]>
  addComment: (targetId: string, text: string) => void
  resolveComment: (targetId: string, commentId: string) => void
  commentsFor: (targetId: string) => Comment[]
}

const CURRENT_USER = { author: "You", avatarInitial: "Y" }

export const useCommentsStore = create<CommentsStore>((set, get) => ({
  commentsByTarget: {
    page: [
      {
        id: "seed-1",
        author: "Alex",
        avatarInitial: "A",
        text: "Increase the spacing between these elements.",
        createdAt: Date.now() - 1000 * 60 * 2,
        resolved: false,
      },
    ],
  },

  addComment: (targetId, text) => {
    if (!text.trim()) return
    const comment: Comment = {
      id: crypto.randomUUID(),
      author: CURRENT_USER.author,
      avatarInitial: CURRENT_USER.avatarInitial,
      text: text.trim(),
      createdAt: Date.now(),
      resolved: false,
    }
    const existing = get().commentsByTarget[targetId] ?? []
    set({
      commentsByTarget: {
        ...get().commentsByTarget,
        [targetId]: [...existing, comment],
      },
    })
  },

  resolveComment: (targetId, commentId) => {
    const existing = get().commentsByTarget[targetId] ?? []
    set({
      commentsByTarget: {
        ...get().commentsByTarget,
        [targetId]: existing.map((comment) =>
          comment.id === commentId
            ? { ...comment, resolved: !comment.resolved }
            : comment,
        ),
      },
    })
  },

  commentsFor: (targetId) => get().commentsByTarget[targetId] ?? [],
}))
