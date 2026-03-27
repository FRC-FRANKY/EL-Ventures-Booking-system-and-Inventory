import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  LogOut,
  Layers,
} from 'lucide-react'
import { getSidebarNav, MODULE_SWITCHER } from './shellNav'

export default function ManagementShell({
  module,
  portalSubtitle,
  userName = 'User',
  receptionistState,
  onSwitchRole,
  children,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [moduleOpen, setModuleOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const profileRef = useRef(null)
  const moduleRef = useRef(null)
  const notifRef = useRef(null)

  const navItems = getSidebarNav(module, receptionistState)

  const handleSwitchRole = () => {
    setProfileOpen(false)
    if (onSwitchRole) {
      void Promise.resolve(onSwitchRole())
      return
    }
    navigate('/')
  }

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const syncSidebar = () => setSidebarOpen(media.matches)
    syncSidebar()
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', syncSidebar)
      return () => media.removeEventListener('change', syncSidebar)
    }
    media.addListener(syncSidebar)
    return () => media.removeListener(syncSidebar)
  }, [])

  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (moduleRef.current && !moduleRef.current.contains(e.target)) setModuleOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const linkClass = ({ isActive }) =>
    [
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-gradient-to-r from-[#C2185B]/15 via-[#EC407A]/15 to-[#F48FB1]/15 text-[#C2185B] ring-1 ring-[#EC407A]/40 dark:text-fuchsia-200 dark:ring-[#EC407A]/40'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
    ].join(' ')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-60 border-r border-slate-200/80 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-14 items-center gap-2 border-b border-slate-200/80 px-4 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-200">
            <img src="/EL.png" alt="EL Ventures logo" className="h-8 w-8 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              EL Ventures
            </p>
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              Management System
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          {navItems.map(({ to, label, icon: Icon, end, state }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              state={state}
              onClick={() => setSidebarOpen(false)}
              className={linkClass}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200/80 p-3 dark:border-slate-800">
          <div className="rounded-xl bg-gradient-to-br from-[#C2185B]/10 via-[#EC407A]/10 to-[#F48FB1]/10 p-3 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-white">Modules</p>
            <p className="mt-1 leading-relaxed">
              HR · Reception · Accounting in one workspace.
            </p>
          </div>
        </div>
      </aside>

      {/* Top bar */}
      <header
        className={[
          'sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-slate-200/80 bg-white/90 px-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90',
          sidebarOpen ? 'lg:pl-[calc(15rem+0.75rem)] lg:pr-6' : 'lg:px-6',
        ].join(' ')}
      >
        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden min-w-0 flex-1 lg:block">
          <h1 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            EL Ventures Incorporated
          </h1>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{portalSubtitle}</p>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Module switcher */}
          <div className="relative" ref={moduleRef}>
            <button
              type="button"
              onClick={() => {
                setModuleOpen((v) => !v)
                setNotifOpen(false)
                setProfileOpen(false)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-[#EC407A] hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-fuchsia-500/40"
            >
              <Layers className="h-3.5 w-3.5 text-[#C2185B]" />
              <span className="hidden sm:inline">Switch module</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            {moduleOpen ? (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200/80 bg-white py-1 shadow-card-hover dark:border-slate-700 dark:bg-slate-900">
                {MODULE_SWITCHER.map((m) => (
                  <button
                    key={m.path}
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => {
                      setModuleOpen(false)
                      navigate(m.path)
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotifOpen((v) => !v)
                setProfileOpen(false)
                setModuleOpen(false)
              }}
              className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-fuchsia-500 ring-2 ring-white dark:ring-slate-900" />
            </button>
            {notifOpen ? (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200/80 bg-white p-3 shadow-card-hover dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  No new alerts. System running normally.
                </p>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setProfileOpen((v) => !v)
                setNotifOpen(false)
                setModuleOpen(false)
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white py-1 pl-1 pr-2 shadow-sm transition hover:border-[#EC407A] dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#C2185B] to-[#EC407A] text-xs font-bold text-white">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
              <span className="hidden max-w-[120px] truncate text-xs font-medium text-slate-700 dark:text-slate-200 sm:block">
                {userName}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {profileOpen ? (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200/80 bg-white py-1 shadow-card-hover dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Signed in as</p>
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {userName}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={handleSwitchRole}
                >
                  <LogOut className="h-4 w-4" />
                  Switch role / Log out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className={sidebarOpen ? 'lg:pl-60' : ''}>
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
