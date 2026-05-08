import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBodyParts, getDiscomfortTypes } from '../catalog/catalogApi'
import type { BodyPart, DiscomfortType } from '../catalog/catalogTypes'

export function SymptomCard() {
  const navigate = useNavigate()
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([])
  const [discomfortTypes, setDiscomfortTypes] = useState<DiscomfortType[]>([])
  const [bodyPartId, setBodyPartId] = useState('')
  const [discomfortTypeId, setDiscomfortTypeId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadCatalog() {
      setIsLoading(true)
      setError('')

      try {
        const [bodyPartsResult, discomfortTypesResult] = await Promise.all([getBodyParts(), getDiscomfortTypes()])

        if (!bodyPartsResult.response.ok || !discomfortTypesResult.response.ok) {
          throw new Error('Unable to load catalog data')
        }

        if (!isMounted) {
          return
        }

        setBodyParts(bodyPartsResult.data)
        setDiscomfortTypes(discomfortTypesResult.data)
      } catch {
        if (isMounted) {
          setError('Unable to load symptom options right now. Please refresh and try again.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCatalog()

    return () => {
      isMounted = false
    }
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const params = new URLSearchParams({
      bodyPartId,
      discomfortTypeId,
    })

    navigate(`/recommendations?${params.toString()}`)
  }

  return (
    <section className="mt-7 rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">Start Your Plan</p>
      <h2 className="mt-2 text-2xl font-semibold text-[color:var(--text-strong)]">What needs relief today?</h2>
      <p className="mt-2 text-sm text-[color:var(--text-soft)]">Pick your body area and discomfort type to unlock matched exercises.</p>

      {isLoading && <p className="mt-4 text-sm text-[color:var(--text-soft)]">Loading symptom options...</p>}
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {!isLoading && !error && (
        <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[color:var(--text-body)]">Body Part</span>
            <select
              value={bodyPartId}
              onChange={(event) => setBodyPartId(event.target.value)}
              required
              className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-2.5 text-[color:var(--text-strong)] outline-none transition focus:border-[color:var(--brand)]"
            >
              <option value="">Select body part</option>
              {bodyParts.map((part) => (
                <option key={part.id} value={part.id}>
                  {part.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[color:var(--text-body)]">Discomfort Type</span>
            <select
              value={discomfortTypeId}
              onChange={(event) => setDiscomfortTypeId(event.target.value)}
              required
              className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-2.5 text-[color:var(--text-strong)] outline-none transition focus:border-[color:var(--brand)]"
            >
              <option value="">Select discomfort type</option>
              {discomfortTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[color:var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-strong)] sm:col-span-2"
          >
            Find Exercises
          </button>
        </form>
      )}
    </section>
  )
}
