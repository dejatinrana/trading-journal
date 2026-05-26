import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Analytics from './pages/Analytics'
import AddTrade from './pages/AddTrade'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TradeDetail from './pages/TradeDetail'
import Trades from './pages/Trades'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/trades/new" element={<AddTrade />} />
          <Route path="/trades/:id/edit" element={<AddTrade mode="edit" />} />
          <Route path="/trades/:id" element={<TradeDetail />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
