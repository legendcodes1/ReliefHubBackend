import { SymptomCard } from '../features/recommendations/SymptomCard'
import neckTherapyImage from '../assets/Stiffneck.jpg'
import pediatricTherapyImage from '../assets/Physical therapy.jpg'

export function HomePage() {
  return (
    <main className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <article className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-8">
          <p className="inline-flex rounded-full border border-[color:var(--brand-soft)] bg-[color:var(--brand-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
            Daily Recovery Companion
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[color:var(--text-strong)] sm:text-5xl">
            Find gentle relief exercises based on how your body feels today.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--text-soft)]">
            ReliefHub helps you choose safer, focused routines by body area and discomfort type, so you can practice with more confidence and consistency.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">Tailored matching</span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900">Safety-first guidance</span>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-900">Save for later</span>
          </div>

          <SymptomCard />
          <p className="mt-5 text-xs font-medium text-[color:var(--text-soft)]">ReliefHub is a guided recommendation tool, not a medical diagnostic service.</p>
        </article>

        <article className="relative overflow-hidden rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] shadow-sm">
          <img
            src={neckTherapyImage}
            alt="Therapist guiding a neck mobility movement"
            className="h-full min-h-80 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2e2a]/70 via-[#0f2e2a]/20 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/30 bg-white/90 p-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--brand-strong)]">Guided Recovery</p>
            <p className="mt-1 text-sm font-semibold text-[color:var(--text-strong)]">Build confidence with clear movement descriptions and paced routines.</p>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="overflow-hidden rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] shadow-sm">
          <img
            src={pediatricTherapyImage}
            alt="Physical therapist supporting guided movement on a rehab mat"
            className="h-full min-h-80 w-full object-cover"
          />
        </article>

        <article className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">How It Flows</p>
          <h2 className="mt-2 text-3xl font-semibold text-[color:var(--text-strong)]">A clearer path from symptom to routine</h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-soft)]">
            Every session follows the same simple flow so you can stay focused and avoid decision fatigue during recovery.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--brand)]">Step 1</p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--text-strong)]">Choose body area</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--brand)]">Step 2</p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--text-strong)]">Choose discomfort</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--brand)]">Step 3</p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--text-strong)]">Practice and save</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-[color:var(--warning-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--warning-text)]">Safety Reminder</p>
            <p className="mt-1 text-sm text-[color:var(--warning-text)]">Stop and consult a licensed professional if pain is sharp, radiating, or worsening.</p>
          </div>
        </article>
      </section>
    </main>
  )
}
