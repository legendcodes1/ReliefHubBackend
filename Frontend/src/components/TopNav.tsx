import { NavLink, useNavigate } from 'react-router-dom'
import { logoutUser } from '../features/auth/authApi'
import { useAuthContext } from '../features/auth/AuthContext'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-1.5 text-sm font-medium transition ${
    isActive
      ? 'bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]'
      : 'text-[color:var(--text-soft)] hover:bg-white hover:text-[color:var(--text-strong)]'
  }`

export function TopNav() {
  const navigate = useNavigate()
  const { logout } = useAuthContext()

  async function handleLogout() {
    try {
      await logoutUser()
    } catch {
      // local logout still runs even if API logout fails
    } finally {
      logout()
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[color:var(--bg-soft)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)]">Pain Recovery Guide</p>
          <p className="text-lg font-semibold text-[color:var(--text-strong)]">ReliefHub</p>
        </div>
        <nav className="flex flex-wrap items-center gap-1">
          <NavLink to="/home" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/saved" className={navLinkClass}>
            Saved
          </NavLink>
          <NavLink to="/account" className={navLinkClass}>
            Account
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="ml-2 rounded-full bg-[color:var(--text-strong)] px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}
