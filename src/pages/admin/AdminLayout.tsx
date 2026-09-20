import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { sx } from '../../lib/style'
import { useAdminAuthContext } from '../../context/AdminAuthContext'

const NAV = [
  { to: '/admin', label: 'Oversikt', end: true },
  { to: '/admin/bookingar', label: 'Bookingar' },
  { to: '/admin/pakkar', label: 'Pakkar' },
  { to: '/admin/opningstider', label: 'Opningstider' },
  { to: '/admin/sperra-datoar', label: 'Sperra datoar' },
  { to: '/admin/innhald', label: 'FAQ og reglar' },
  { to: '/admin/innstillingar', label: 'Innstillingar' },
]

export function AdminLayout() {
  const { session, isAdmin, loading, signOut } = useAdminAuthContext()
  const navigate = useNavigate()

  if (loading) {
    return <div style={sx('min-height:100vh;display:flex;align-items:center;justify-content:center;color:#8A8073;')}>…</div>
  }
  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div style={sx('display:grid;grid-template-columns:240px minmax(0,1fr);min-height:100vh;')}>
      <aside style={sx('background:#12201D;color:#F6F3EC;padding:28px 18px;display:flex;flex-direction:column;gap:6px;position:sticky;top:0;height:100vh;box-sizing:border-box;')}>
        <div style={sx('padding:0 12px 24px;')}>
          <div style={sx('font-size:17px;font-weight:600;')}>Fjordbu Sauna</div>
          <div style={sx('font-size:12px;color:rgba(246,243,236,0.5);margin-top:2px;')}>Administrasjon</div>
        </div>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) =>
              sx(
                `display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;text-align:left;padding:11px 12px;border-radius:10px;font-size:14px;font-weight:500;background:${isActive ? 'rgba(246,243,236,0.12)' : 'transparent'};color:${isActive ? '#F6F3EC' : 'rgba(246,243,236,0.7)'};transition:background .15s;`
              )
            }
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
        <div style={sx('margin-top:auto;padding:16px 12px 0;border-top:1px solid rgba(246,243,236,0.1);display:flex;justify-content:space-between;align-items:center;gap:8px;')}>
          <div style={sx('min-width:0;')}>
            <div style={sx('font-size:13px;font-weight:500;')}>Admin</div>
            <div style={sx('font-size:12px;color:rgba(246,243,236,0.5);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;')}>
              {session.user.email}
            </div>
          </div>
          <button onClick={handleLogout} style={sx('background:none;color:rgba(246,243,236,0.6);font-size:12px;white-space:nowrap;flex-shrink:0;')}>
            Logg ut
          </button>
        </div>
      </aside>
      <main style={sx('padding:36px 40px 60px;min-width:0;')}>
        <Outlet />
      </main>
    </div>
  )
}
