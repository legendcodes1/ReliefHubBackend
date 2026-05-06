function getCleanUrl(videoUrl: string) {
  return videoUrl.replace(/&amp;/g, '&')
}

function getStartSeconds(url: URL) {
  const start = url.searchParams.get('start')
  const time = url.searchParams.get('t')
  const rawValue = start ?? time

  if (!rawValue) {
    return null
  }

  const match = rawValue.match(/^(\d+)/)
  if (!match) {
    return null
  }

  return Number.parseInt(match[1], 10)
}

function getEndSeconds(url: URL) {
  const end = url.searchParams.get('end')

  if (!end) {
    return null
  }

  const match = end.match(/^(\d+)/)
  if (!match) {
    return null
  }

  return Number.parseInt(match[1], 10)
}

export function getYouTubeVideoId(videoUrl?: string | null) {
  if (!videoUrl) {
    return null
  }

  try {
    const url = new URL(getCleanUrl(videoUrl))
    const hostname = url.hostname.replace(/^www\./, '')

    if (hostname === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] ?? null
    }

    if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.split('/').filter(Boolean)[1] ?? null
      }

      if (url.pathname === '/watch') {
        return url.searchParams.get('v')
      }

      if (url.pathname.startsWith('/shorts/')) {
        return url.pathname.split('/').filter(Boolean)[1] ?? null
      }
    }
  } catch {
    return null
  }

  return null
}

export function getYouTubeThumbnailUrl(videoUrl?: string | null) {
  const videoId = getYouTubeVideoId(videoUrl)

  if (!videoId) {
    return null
  }

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

export function getYouTubeEmbedUrl(videoUrl?: string | null) {
  if (!videoUrl) {
    return null
  }

  const videoId = getYouTubeVideoId(videoUrl)
  if (!videoId) {
    return null
  }

  try {
    const url = new URL(getCleanUrl(videoUrl))
    const startSeconds = getStartSeconds(url)
    const endSeconds = getEndSeconds(url)
    const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`)

    if (startSeconds !== null) {
      embedUrl.searchParams.set('start', String(startSeconds))
    }

    if (endSeconds !== null) {
      embedUrl.searchParams.set('end', String(endSeconds))
    }

    return embedUrl.toString()
  } catch {
    return `https://www.youtube-nocookie.com/embed/${videoId}`
  }
}
