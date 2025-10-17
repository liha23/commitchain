import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Trophy,
  BarChart3,
  User,
  Settings,
  Target,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview of your commitments'
    },
    {
      name: 'My Groups',
      href: '/groups',
      icon: Users,
      description: 'Groups you\'re part of'
    },
    {
      name: 'Create Group',
      href: '/groups/create',
      icon: PlusCircle,
      description: 'Start a new commitment group'
    },
    {
      name: 'Achievements',
      href: '/achievements',
      icon: Trophy,
      description: 'Your earned achievements'
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
      icon: TrendingUp,
      description: 'Top performers'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Your profile settings'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'App preferences'
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.aside
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 bottom-0 w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto z-40"
    >
      <div className="p-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-red-900/30 text-red-400 border border-red-800/50'
                    : 'text-gray-300 hover:text-gray-100 hover:bg-gray-800'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${
                  isActive(item.href) ? 'text-red-400' : 'text-gray-400 group-hover:text-gray-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.name}</div>
                  <div className={`text-xs truncate ${
                    isActive(item.href) ? 'text-red-300/70' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-800/30 rounded-lg">
          <h3 className="text-sm font-semibold text-red-400 mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Active Groups</span>
              <span className="font-medium text-gray-100">3</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Completed Goals</span>
              <span className="font-medium text-gray-100">12</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Earned Rewards</span>
              <span className="font-medium text-gray-100">2.5 AVAX</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Achievements</span>
              <span className="font-medium text-gray-100">8</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-200 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-2 text-xs">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 truncate">Completed LeetCode challenge</p>
                <p className="text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 truncate">Joined fitness group</p>
                <p className="text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 text-xs">
              <div className="w-2 h-2 bg-warning-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 truncate">Milestone reached</p>
                <p className="text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

