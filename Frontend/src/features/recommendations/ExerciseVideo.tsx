import { getYouTubeEmbedUrl } from './youtube'

type ExerciseVideoProps = {
  videoUrl?: string | null
  title: string
  className?: string
}

export function ExerciseVideo({ videoUrl, title, className = '' }: ExerciseVideoProps) {
  if (!videoUrl) {
    return null
  }

  const embedUrl = getYouTubeEmbedUrl(videoUrl)

  if (!embedUrl) {
    return (
      <a href={videoUrl} target="_blank" rel="noreferrer" className={`inline-block rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-800 transition hover:bg-stone-100 ${className}`}>
        Open Video
      </a>
    )
  }

  return (
    <div className={`aspect-video overflow-hidden rounded-2xl border border-[color:var(--line)] bg-stone-100 ${className}`}>
      <iframe
        src={embedUrl}
        title={`${title} video`}
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
