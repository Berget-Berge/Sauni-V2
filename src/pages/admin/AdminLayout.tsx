import { useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { sx } from '../../lib/style'
import { useAdminAuthContext } from '../../context/AdminAuthContext'
import { useIsMobile } from '../../hooks/useIsMobile'

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
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

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

  // Mobile: the sidebar was a fixed 240px column, which on a phone left
  // only ~130px for the actual content and clipped every card (see the
  // "Kommande stadfe…" cut-off text). It's now a slide-out drawer opened
  // from a compact top bar instead of a permanent column.
  if (isMobile) {
    return (
      <div style={sx('min-height:100vh;background:#F6F3EC;')}>
        <div
          style={sx(
            'position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;background:#12201D;color:#F6F3EC;'
          )}
        >
          <div style={sx('min-width:0;')}>
            <div style={sx('font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;')}>Fjordbu Sauna</div>
            <div style={sx('font-size:11px;color:rgba(246,243,236,0.5);')}>Administrasjon</div>
          </div>
          <button
            aria-label="Opne meny"
            onClick={() => setMenuOpen(true)}
            style={sx('width:38px;height:38px;flex-shrink:0;background:rgba(246,243,236,0.08);border:1px solid rgba(246,243,236,0.25);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;')}
          >
            <span style={sx('display:block;width:16px;height:2px;background:#F6F3EC;border-radius:2px;')} />
            <span style={sx('display:block;width:16px;height:2px;background:#F6F3EC;border-radius:2px;')} />
            <span style={sx('display:block;width:16px;height:2px;background:#F6F3EC;border-radius:2px;')} />
          </button>
        </div>

        {menuOpen && (
          <>
            <div
              onClick={() => setMenuOpen(false)}
              style={sx('position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:60;')}
            />
            <aside
              style={sx(
                'position:fixed;top:0;left:0;bottom:0;width:260px;max-width:82vw;z-index:70;background:#12201D;color:#F6F3EC;padding:22px 16px;display:flex;flex-direction:column;gap:4px;box-sizing:border-box;overflow-y:auto;animation:fadein .2s ease;'
              )}
            >
              <div style={sx('display:flex;justify-content:space-between;align-items:flex-start;padding:0 8px 20px;')}>
                <div>
                  <div style={sx('font-size:16px;font-weight:600;')}>Fjordbu Sauna</div>
                  <div style={sx('font-size:12px;color:rgba(246,243,236,0.5);margin-top:2px;')}>Administrasjon</div>
                </div>
                <button
                  aria-label="Lukk meny"
                  onClick={() => setMenuOpen(false)}
                  style={sx('width:30px;height:30px;background:rgba(246,243,236,0.08);border-radius:8px;color:#F6F3EC;font-size:15px;flex-shrink:0;')}
                >
                  ✕
                </button>
              </div>
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) =>
                    sx(
                      `display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;text-align:left;padding:13px 12px;border-radius:10px;font-size:15px;font-weight:500;background:${isActive ? 'rgba(246,243,236,0.12)' : 'transparent'};color:${isActive ? '#F6F3EC' : 'rgba(246,243,236,0.7)'};box-sizing:border-box;`
                    )
                  }
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <div style={sx('margin-top:auto;padding:16px 8px 0;border-top:1px solid rgba(246,243,236,0.1);display:flex;justify-content:space-between;align-items:center;gap:8px;')}>
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
          </>
        )}

        <main style={sx('padding:20px 16px 48px;min-width:0;box-sizing:border-box;')}>
          <Outlet />
        </main>
      </div>
    )
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
