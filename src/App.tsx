import { Route, Routes } from 'react-router-dom'
import { PublicSite } from './pages/PublicSite'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminLayout } from './pages/admin/AdminLayout'
import { Overview } from './pages/admin/Overview'
import { Bookings } from './pages/admin/Bookings'
import { Services } from './pages/admin/Services'
import { Hours } from './pages/admin/Hours'
import { Blocked } from './pages/admin/Blocked'
import { Content } from './pages/admin/Content'
import { Settings } from './pages/admin/Settings'
import { AdminAuthProvider } from './context/AdminAuthContext'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route
        path="/admin/*"
        element={
          <AdminAuthProvider>
            <Routes>
              <Route path="login" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route index element={<Overview />} />
                <Route path="bookingar" element={<Bookings />} />
                <Route path="pakkar" element={<Services />} />
                <Route path="opningstider" element={<Hours />} />
                <Route path="sperra-datoar" element={<Blocked />} />
                <Route path="innhald" element={<Content />} />
                <Route path="innstillingar" element={<Settings />} />
              </Route>
            </Routes>
          </AdminAuthProvider>
        }
      />
    </Routes>
  )
}

export default App
