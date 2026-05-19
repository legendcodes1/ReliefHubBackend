import { useEffect, useState } from 'react'
import { removeReaction, setReaction } from './reactionsApi'
import type { ExerciseReactionResponse, ReactionType } from './reactionsApi'

const REACTION_TIP_DISMISSED_KEY = 'reliefhub-reaction-tip-dismissed'

type ExerciseReactionControlsProps = {
  exerciseId: string
  reactions?: ExerciseReactionResponse
  onReactionsChange: (exerciseId: string, update: Partial<ExerciseReactionResponse>) => void
  showFeedbackTip?: boolean
}

export function ExerciseReactionControls({
  exerciseId,
  reactions,
  onReactionsChange,
  showFeedbackTip = true,
}: ExerciseReactionControlsProps) {
  const counts = reactions?.counts ?? { like: 0, dislike: 0 }
  const userReaction = reactions?.userReaction ?? null
  const [isTipVisible, setIsTipVisible] = useState(false)

  useEffect(() => {
    if (!showFeedbackTip) {
      setIsTipVisible(false)
      return
    }

    const isDismissed = window.localStorage.getItem(REACTION_TIP_DISMISSED_KEY) === 'true'
    setIsTipVisible(!isDismissed)
  }, [showFeedbackTip])

  function dismissTip() {
    setIsTipVisible(false)
    window.localStorage.setItem(REACTION_TIP_DISMISSED_KEY, 'true')
  }

  async function handleReaction(type: ReactionType) {
    dismissTip()
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
    <div className="relative mt-4 inline-flex w-fit self-start">
      {isTipVisible && (
        <div className="absolute bottom-full left-1/2 z-20 mb-3 w-[min(20rem,calc(100vw-3rem))] -translate-x-1/2 rounded-2xl border border-emerald-200/90 bg-[linear-gradient(145deg,_#f7fdf9_0%,_#f1fbf5_100%)] px-4 py-3 shadow-[0_14px_28px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-600">Recovery Feedback</p>
          <p className="mt-1 font-[var(--font-display)] text-base leading-snug text-stone-950">Your feedback improves future exercises</p>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-800">
            Thumbs up means helpful. Thumbs down means it did not help or did not feel right.
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
            We use this to curate better recommendations.
          </p>
          <button
            type="button"
            onClick={dismissTip}
            className="mt-3 inline-flex rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:bg-emerald-100"
          >
            Got it
          </button>
          <span
            aria-hidden="true"
            className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-emerald-200 bg-emerald-50"
          />
        </div>
      )}

      <div className="inline-flex items-center gap-1 rounded-full border border-[color:var(--line)] bg-white/90 p-1 shadow-sm">
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
    </div>
  )
}
