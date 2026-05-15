import { removeReaction, setReaction } from './reactionsApi'
import type { ExerciseReactionResponse, ReactionType } from './reactionsApi'

type ExerciseReactionControlsProps = {
  exerciseId: string
  reactions?: ExerciseReactionResponse
  onReactionsChange: (exerciseId: string, update: Partial<ExerciseReactionResponse>) => void
}

export function ExerciseReactionControls({ exerciseId, reactions, onReactionsChange }: ExerciseReactionControlsProps) {
  const counts = reactions?.counts ?? { like: 0, dislike: 0 }
  const userReaction = reactions?.userReaction ?? null

  async function handleReaction(type: ReactionType) {
    const previous = reactions ?? { counts: { like: 0, dislike: 0 }, userReaction: null }
    const isTogglingOff = userReaction === type

    onReactionsChange(exerciseId, {
      counts: isTogglingOff
        ? { ...counts, [type]: Math.max(0, counts[type] - 1) }
        : {
            ...counts,
            [type]: counts[type] + 1,
            ...(userReaction ? { [userReaction]: Math.max(0, counts[userReaction] - 1) } : {}),
          },
      userReaction: isTogglingOff ? null : type,
    })

    try {
      if (isTogglingOff) {
        await removeReaction(exerciseId)
      } else {
        await setReaction(exerciseId, type)
      }
    } catch {
      onReactionsChange(exerciseId, previous)
    }
  }

  return (
    <div className="mt-4 inline-flex items-center gap-1 rounded-full border border-[color:var(--line)] bg-white/90 p-1 shadow-sm">
      <button
        type="button"
        onClick={() => handleReaction('like')}
        title="Like"
        aria-label="Like exercise"
        aria-pressed={userReaction === 'like'}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition duration-200 ${
          userReaction === 'like'
            ? 'bg-emerald-100 text-emerald-800 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]'
            : 'text-stone-600 hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]'
        }`}
      >
        <span>👍</span>
        <span className="text-xs font-medium tabular-nums">{counts.like}</span>
      </button>
      <button
        type="button"
        onClick={() => handleReaction('dislike')}
        title="Dislike"
        aria-label="Dislike exercise"
        aria-pressed={userReaction === 'dislike'}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition duration-200 ${
          userReaction === 'dislike'
            ? 'bg-rose-100 text-rose-800 shadow-[inset_0_0_0_1px_rgba(244,63,94,0.25)]'
            : 'text-stone-600 hover:-translate-y-0.5 hover:bg-rose-50 hover:text-rose-800 hover:shadow-[inset_0_0_0_1px_rgba(244,63,94,0.25)]'
        }`}
      >
        <span>👎</span>
        <span className="text-xs font-medium tabular-nums">{counts.dislike}</span>
      </button>
    </div>
  )
}
