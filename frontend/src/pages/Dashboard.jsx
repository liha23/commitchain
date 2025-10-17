import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Target, 
  Users, 
  Trophy, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Calendar,
  Award,
  Zap
} from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { 
  MOCK_DASHBOARD_STATS, 
  MOCK_GROUPS, 
  MOCK_RECENT_ACTIVITY 
} from '../services/mockData'

export default function Dashboard() {
  const { isConnected, account } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    activeGroups: 0,
    completedGoals: 0,
    totalRewards: 0,
    achievements: 0
  })
  const [recentGroups, setRecentGroups] = useState([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])

  useEffect(() => {
    if (isConnected) {
      loadDashboardData()
    }
  }, [isConnected])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Simulate API calls - in real app, these would be actual contract calls
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setStats({
        activeGroups: MOCK_DASHBOARD_STATS.activeGroups,
        completedGoals: MOCK_DASHBOARD_STATS.completedGoals,
        totalRewards: MOCK_DASHBOARD_STATS.totalRewards,
        achievements: MOCK_DASHBOARD_STATS.achievements
      })

      // Get first 3 groups as "recent"
      setRecentGroups(MOCK_GROUPS.slice(0, 3).map(g => ({
        id: g.id,
        name: g.name,
        description: g.description,
        stakeAmount: g.stakeAmount,
        deadline: g.deadline,
        progress: g.progress,
        members: g.memberCount,
        status: g.status
      })))

      // Get upcoming deadlines
      setUpcomingDeadlines([
        {
          id: 1,
          groupName: 'LeetCode Masters',
          deadline: '2024-02-15',
          daysLeft: 5,
          status: 'urgent'
        },
        {
          id: 2,
          groupName: 'Fitness Warriors',
          deadline: '2024-02-20',
          daysLeft: 10,
          status: 'warning'
        }
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <Target className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Please connect your wallet to view your dashboard</p>
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Active Groups',
      value: stats.activeGroups,
      icon: Users,
      color: 'avalanche',
      change: '+2 this week'
    },
    {
      title: 'Completed Goals',
      value: stats.completedGoals,
      icon: CheckCircle,
      color: 'success',
      change: '+3 this month'
    },
    {
      title: 'Total Rewards',
      value: `${stats.totalRewards} AVAX`,
      icon: Trophy,
      color: 'warning',
      change: '+0.5 AVAX earned'
    },
    {
      title: 'Achievements',
      value: stats.achievements,
      icon: Award,
      color: 'error',
      change: '+2 new badges'
    }
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-300">Welcome back! Here's your commitment overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-300 truncate">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-white truncate">{stat.value}</p>
                    <p className="text-xs text-gray-400 truncate">{stat.change}</p>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${stat.color}-900/30 rounded-lg flex items-center justify-center flex-shrink-0 ml-2`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-400`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Groups */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Your Groups</h2>
                <Link to="/groups/create" className="btn btn-primary btn-sm w-full sm:w-auto justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Link>
              </div>

              <div className="space-y-4">
                {recentGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border border-gray-800 rounded-lg p-3 sm:p-4 hover:shadow-md hover:shadow-red-900/20 transition-all bg-gray-950/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate">{group.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                            group.status === 'active' 
                              ? 'bg-success-900/30 text-success-400' 
                              : 'bg-gray-800 text-gray-400'
                          }`}>
                            {group.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300 mb-3 line-clamp-2">{group.description}</p>
                        
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div className="flex flex-col items-center p-2 bg-gray-900/50 rounded">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mb-1" />
                            <span className="text-gray-200 font-semibold text-xs sm:text-sm">{group.members}</span>
                            <span className="text-gray-400 text-xs">Members</span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-gray-900/50 rounded">
                            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mb-1" />
                            <span className="text-gray-200 font-semibold text-xs sm:text-sm">{group.stakeAmount}</span>
                            <span className="text-gray-400 text-xs">AVAX</span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-gray-900/50 rounded">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mb-1" />
                            <span className="text-gray-200 font-semibold text-xs sm:text-sm">{group.deadline.split('-')[1]}/{group.deadline.split('-')[2]}</span>
                            <span className="text-gray-400 text-xs">Deadline</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-start sm:flex-col sm:items-end gap-2 sm:ml-4">
                        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                          <div className="text-xs sm:text-sm font-medium text-white">{group.progress}%</div>
                          <div className="w-20 sm:w-20 bg-gray-800 rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${group.progress}%` }}
                            />
                          </div>
                        </div>
                        <Link 
                          to={`/groups/${group.id}`}
                          className="btn btn-ghost btn-sm flex-shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 text-center">
                <Link to="/groups" className="btn btn-outline w-full sm:w-auto">
                  View All Groups
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines & Quick Actions */}
          <div className="space-y-4 sm:space-y-6">
            {/* Upcoming Deadlines */}
            <div className="card">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Upcoming Deadlines</h2>
              <div className="space-y-2 sm:space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <motion.div
                    key={deadline.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-3 rounded-lg border ${
                      deadline.status === 'urgent' 
                        ? 'border-error-800 bg-error-900/20' 
                        : 'border-warning-800 bg-warning-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm sm:text-base truncate">{deadline.groupName}</h4>
                        <p className="text-xs sm:text-sm text-gray-300">{deadline.deadline}</p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                        deadline.status === 'urgent' 
                          ? 'bg-error-900/30 text-error-400' 
                          : 'bg-warning-900/30 text-warning-400'
                      }`}>
                        {deadline.daysLeft}d
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Quick Actions</h2>
              <div className="space-y-2 sm:space-y-3">
                <Link to="/groups/create" className="btn btn-primary w-full justify-start text-sm sm:text-base">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Group
                </Link>
                <Link to="/groups" className="btn btn-outline w-full justify-start text-sm sm:text-base">
                  <Users className="w-4 h-4 mr-2" />
                  Browse Groups
                </Link>
                <Link to="/achievements" className="btn btn-outline w-full justify-start text-sm sm:text-base">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Achievements
                </Link>
                <Link to="/leaderboard" className="btn btn-outline w-full justify-start text-sm sm:text-base">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Leaderboard
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-200">Completed LeetCode problem #87</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-200">Joined "Fitness Warriors" group</p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-200">Milestone reached: 50% progress</p>
                    <p className="text-xs text-gray-400">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

