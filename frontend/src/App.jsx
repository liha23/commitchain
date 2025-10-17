import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWeb3 } from './contexts/Web3Context'
import { useSidebar } from './contexts/SidebarContext'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import LoadingSpinner from './components/ui/LoadingSpinner'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import CreateGroup from './pages/CreateGroup'
import GroupDetail from './pages/GroupDetail'
import Profile from './pages/Profile'
import Achievements from './pages/Achievements'
import Leaderboard from './pages/Leaderboard'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  const { isConnected, isLoading } = useWeb3()
  const { isSidebarOpen } = useSidebar()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen gradient-bg">
        <Navbar />
        
        <div className="flex">
          {isConnected && <Sidebar />}
          
          <main className={`flex-1 transition-all duration-300 ${isConnected && isSidebarOpen ? 'md:ml-64' : ''}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/create" element={<CreateGroup />} />
                <Route path="/groups/:id" element={<GroupDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </main>
        </div>
        
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default App

