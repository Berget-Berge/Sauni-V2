import { useState } from 'react'
import { sx } from '../../lib/style'
import { useAdminAuthContext } from '../../context/AdminAuthContext'

export function AdminLogin() {
  const { signIn, error } = useAdminAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await signIn(email, password)
    setSubmitting(false)
  }

  return (
    <div style={sx('min-height:100vh;display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));')}>
      <div style={sx('position:relative;min-height:320px;overflow:hidden;background:#12201D;')}>
        <img src="/images/kveld.jpg" alt="" style={sx('position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.7;')} />
        <div style={sx('position:absolute;inset:0;background:linear-gradient(180deg, rgba(18,32,29,0.2), rgba(18,32,29,0.85));')} />
        <div style={sx('position:absolute;left:40px;bottom:40px;color:#F6F3EC;')}>
          <div style={sx('font-size:13px;color:rgba(246,243,236,0.6);margin-bottom:8px;')}>Fjordbu Sauna</div>
          <div style={sx('font-size:28px;font-weight:600;letter-spacing:-0.01em;')}>Administrasjon</div>
        </div>
      </div>
      <div style={sx('display:flex;align-items:center;justify-content:center;padding:40px;')}>
        <form onSubmit={handleSubmit} style={sx('width:100%;max-width:380px;animation:fadein .35s ease;')}>
          <h1 style={sx('margin:0 0 6px;font-size:26px;font-weight:600;letter-spacing:-0.01em;')}>Logg inn</h1>
          <p style={sx('margin:0 0 28px;color:#8A8073;font-size:15px;font-weight:300;')}>Berre for administratorar av Fjordbu Sauna.</p>
          <label style={sx('display:block;font-size:13px;color:#8A8073;margin-bottom:6px;')}>E-post</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="post@fjordbusauna.no"
            style={sx('width:100%;box-sizing:border-box;background:#FFFFFF;border:1px solid rgba(18,32,29,0.15);border-radius:10px;padding:12px 14px;font-size:15px;margin-bottom:16px;')}
          />
          <label style={sx('display:block;font-size:13px;color:#8A8073;margin-bottom:6px;')}>Passord</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={sx('width:100%;box-sizing:border-box;background:#FFFFFF;border:1px solid rgba(18,32,29,0.15);border-radius:10px;padding:12px 14px;font-size:15px;margin-bottom:16px;')}
          />
          {error && <div style={sx('color:#B5602A;font-size:13px;margin-bottom:16px;')}>{error}</div>}
          <button
            type="submit"
            disabled={submitting}
            style={sx(`width:100%;background:#B5602A;color:#FFFFFF;padding:13px;border-radius:22px;font-size:15px;font-weight:500;opacity:${submitting ? 0.7 : 1};`)}
          >
            {submitting ? '…' : 'Logg inn'}
          </button>
          <a href="/" style={sx('display:block;text-align:center;margin-top:20px;font-size:13px;color:#8A8073;')}>
            ← Tilbake til nettsida
          </a>
        </form>
      </div>
    </div>
  )
}
