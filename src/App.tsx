import { useEffect, useState, type FormEvent } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity, Bell, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Command, FolderKanban, LayoutDashboard, ListTodo, Menu, Plus,
  Search, Settings, Sparkles, Sun, X, ChartNoAxesColumnIncreasing,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Tasks', path: '/tasks', icon: ListTodo },
  { label: 'Kanban Board', path: '/board', icon: ColumnsIcon },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Calendar', path: '/calendar', icon: CalendarDays },
  { label: 'Analytics', path: '/analytics', icon: ChartNoAxesColumnIncreasing },
]

function ColumnsIcon({ size = 18 }: { size?: number }) {
  return <span className="columns-glyph" style={{ width: size, height: size }} aria-hidden="true"><i /><i /><i /></span>
}

function readPreference(key: string, fallback: string) {
  try { return window.localStorage.getItem(key) ?? fallback } catch { return fallback }
}

function savePreference(key: string, value: string) {
  try { window.localStorage.setItem(key, value) } catch { /* Storage can be unavailable in private or restricted contexts. */ }
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readPreference('taskflow-sidebar-collapsed', 'false') === 'true')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [theme, setTheme] = useState(() => readPreference('taskflow-theme', 'light'))
  const [period, setPeriod] = useState<'This week' | 'This month'>('This week')
  const location = useLocation()
  const navigate = useNavigate()
  const current = navItems.find((item) => item.path === location.pathname)
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard'

  useEffect(() => {
    savePreference('taskflow-sidebar-collapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  useEffect(() => {
    savePreference('taskflow-theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setNotificationsOpen(false)
        setProfileOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(`/tasks${searchValue.trim() ? `?q=${encodeURIComponent(searchValue.trim())}` : ''}`)
    setSearchOpen(false)
  }

  return <div className={`app-shell font-sans antialiased ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
    {mobileOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand-row"><div className="brand-mark"><Command size={18} strokeWidth={2.5} /></div><span>taskflow</span><button className="collapse-button" aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-pressed={sidebarCollapsed} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}><ChevronLeft size={16} /></button></div>
      <button className="workspace-switch" onClick={() => navigate('/settings')} aria-label="Open workspace settings"><span className="workspace-avatar">S</span><span className="workspace-copy"><b>Studio workspace</b><small>Personal workspace</small></span><ChevronDown size={15} /></button>
      <div className="side-label">WORKSPACE</div>
      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} title={sidebarCollapsed ? label : undefined} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive || (path === '/dashboard' && location.pathname === '/') ? 'active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span></NavLink>)}
      </nav>
      <div className="projects-heading"><div className="side-label">YOUR PROJECTS</div><button aria-label="Create project" title="Create project" onClick={() => navigate('/projects')}><Plus size={16} /></button></div>
      <div className="project-empty-sidebar"><span className="project-empty-dot" /><span>No projects yet</span></div>
      <div className="sidebar-bottom"><a className="nav-link" href="mailto:support@taskflow.app"><CircleHelp size={18} /><span>Help & support</span></a><NavLink to="/settings" className="nav-link"><Settings size={18} /><span>Settings</span></NavLink><div className="profile-mini"><div className="profile-avatar">JD</div><div className="profile-copy"><b>Jamie Davis</b><small>Demo workspace</small></div><button aria-label="Open profile menu" onClick={() => setProfileOpen(!profileOpen)}><ChevronDown size={15} /></button></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={19} /></button><div className="breadcrumb">Workspace <ChevronRight size={14} /> <b>{current?.label ?? (location.pathname === '/settings' ? 'Settings' : 'Dashboard')}</b></div></div><div className="topbar-actions"><button className="search-trigger" aria-label="Search tasks" onClick={() => setSearchOpen(true)}><Search size={16} /><span>Search anything...</span><kbd>⌘ K</kbd></button><button className="icon-button notification-button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} /><i /></button><span className="top-divider" /><button className="theme-button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}><Sun size={18} /></button><button className="profile-avatar top-avatar" aria-label="Open profile menu" onClick={() => setProfileOpen(!profileOpen)}>JD</button><button className="create-button" onClick={() => navigate('/tasks')}><Plus size={17} /><span>Create task</span></button></div></header>
      {searchOpen && <form className="search-popover" role="search" onSubmit={submitSearch}><Search size={17} /><input autoFocus value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search tasks, projects..." aria-label="Search tasks and projects" /><button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={16} /></button><small>Press Enter to open task search · Esc to close</small></form>}
      {notificationsOpen && <div className="header-popover notification-popover"><div className="popover-title"><b>Notifications</b><button aria-label="Close notifications" onClick={() => setNotificationsOpen(false)}><X size={15} /></button></div><div className="popover-empty"><span className="notification-check"><Check size={16} /></span><b>You’re all caught up</b><span>New updates will appear here.</span></div></div>}
      {profileOpen && <div className="header-popover profile-popover"><div className="popover-user"><div className="profile-avatar">JD</div><div><b>Jamie Davis</b><span>Demo workspace</span></div></div><NavLink to="/settings" onClick={() => setProfileOpen(false)}><Settings size={15} />Settings</NavLink></div>}
      <div className="page-content">
        {isDashboard ? <Dashboard period={period} onPeriodChange={() => setPeriod(period === 'This week' ? 'This month' : 'This week')} navigate={navigate} /> : <section className="phase-placeholder"><div className="empty-icon"><Sparkles size={22} /></div><p className="eyebrow">READY FOR THE NEXT BUILD PHASE</p><h1>{current?.label ?? 'Settings'}</h1><p>This workspace section is part of the Taskflow plan. Its full features will arrive in a later phase.</p><NavLink to="/dashboard" className="return-link">Back to dashboard <ChevronRight size={15} /></NavLink></section>}
      </div>
    </main>
  </div>
}

function Dashboard({ period, onPeriodChange, navigate }: { period: 'This week' | 'This month'; onPeriodChange: () => void; navigate: ReturnType<typeof useNavigate> }) {
  const dateLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()).toUpperCase()
  const stats = [
    { label: 'Total tasks', value: '0', note: 'All tasks in your workspace', icon: ListTodo, tone: 'lavender', path: '/tasks' },
    { label: 'Completed', value: '0', note: 'Tasks finished so far', icon: Check, tone: 'mint', path: '/tasks' },
    { label: 'In progress', value: '0', note: 'Tasks you’re working on', icon: Activity, tone: 'peach', path: '/tasks' },
    { label: 'Overdue', value: '0', note: 'Past their due date', icon: CalendarDays, tone: 'rose', path: '/tasks' },
  ]
  return <>
    <div className="welcome-row"><div><div className="eyebrow date-label">{dateLabel} <span className="date-sparkle">✳</span></div><h1>Good morning, Jamie <span className="wave">✦</span></h1><p>Here’s what’s happening with your workspace today.</p></div><button className="date-range" onClick={onPeriodChange} aria-label="Change dashboard period"><CalendarDays size={16} />{period}<ChevronDown size={15} /></button></div>
    <section className="stats-grid" aria-label="Task summary">{stats.map(({ label, value, note, icon: Icon, tone, path }) => <button className="stat-card" key={label} onClick={() => navigate(path)}><div className={`stat-icon ${tone}`}><Icon size={18} strokeWidth={2} /></div><div className="stat-name">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div><span className="stat-trend"><span className="trend-dot" /> Updated just now</span></button>)}</section>
    <div className="dashboard-grid"><section className="panel productivity-panel"><div className="panel-heading"><div><h2>Productivity</h2><p>Track your progress over time</p></div><button className="select-control" onClick={onPeriodChange}>{period}<ChevronDown size={14} /></button></div><div className="chart-empty"><div className="chart-grid"><span>12</span><span>9</span><span>6</span><span>3</span><span>0</span></div><div className="chart-lines"><i /><i /><i /><i /><i /></div><div className="chart-message"><div className="empty-icon small"><ChartNoAxesColumnIncreasing size={18} /></div><b>Your progress will show up here</b><span>Create a task to start tracking your productivity.</span><button className="text-action" onClick={() => navigate('/tasks')}>Explore my tasks <ChevronRight size={14} /></button></div><div className="chart-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></section>
      <section className="panel completion-panel"><div className="panel-heading"><div><h2>Task completion</h2><p>Your task breakdown</p></div><span className="more-label">OVERVIEW</span></div><div className="donut-wrap"><div className="donut"><div><b>0</b><span>total tasks</span></div></div></div><div className="legend"><div><i className="legend-dot todo" />To do <b>0</b></div><div><i className="legend-dot progress" />In progress <b>0</b></div><div><i className="legend-dot complete" />Completed <b>0</b></div></div></section>
      <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent tasks</h2><p>Keep an eye on what’s moving</p></div><NavLink to="/tasks" className="view-all">View all <ChevronRight size={14} /></NavLink></div><div className="panel-empty"><div className="empty-icon small"><ListTodo size={18} /></div><div><b>No tasks yet</b><span>Your tasks will appear here once you add them.</span></div><button className="subtle-create" onClick={() => navigate('/tasks')}><Plus size={14} />Create task</button></div></section>
      <section className="panel deadlines-panel"><div className="panel-heading"><div><h2>Upcoming deadlines</h2><p>Stay ahead of what’s due</p></div><NavLink to="/calendar" aria-label="Open calendar" className="view-all">Calendar <ChevronRight size={14} /></NavLink></div><div className="deadline-empty"><div className="calendar-art"><CalendarDays size={24} /><span>{new Date().getDate()}</span></div><b>Nothing due soon</b><span>You’re all caught up. Nice work!</span></div></section>
      <section className="panel projects-panel"><div className="panel-heading"><div><h2>Projects</h2><p>A quick look at your team’s work</p></div><NavLink to="/projects" className="view-all">All projects <ChevronRight size={14} /></NavLink></div><div className="project-empty-row"><div className="project-empty-icon"><FolderKanban size={18} /></div><div><b>No projects yet</b><span>Create a project to organize your tasks.</span></div><button className="subtle-create" onClick={() => navigate('/projects')}><Plus size={14} />New project</button></div></section>
      <section className="panel activity-panel"><div className="panel-heading"><div><h2>Activity</h2><p>The latest updates from your workspace</p></div><span className="activity-live"><i />LIVE</span></div><div className="activity-empty"><span className="activity-orbit"><Activity size={18} /></span><b>Your activity will show here</b><span>Updates from your workspace will appear here.</span></div></section>
    </div>
    <footer className="page-footer">Made for focused work <span>✳</span><span className="footer-right">Taskflow <b>·</b> Your workspace, in flow</span></footer>
  </>
}

export default App
