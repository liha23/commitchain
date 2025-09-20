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

export default function Dashboard() {
  const { isConnected, account } = useWeb3()
  const [isLoading, setIsLoading] = useState(true)
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        activeGroups: 3,
        completedGoals: 12,
        totalRewards: 2.5,
        achievements: 8
      })

      setRecentGroups([
        {
          id: 1,
          name: 'LeetCode Masters',
          description: 'Complete 100 LeetCode problems in 30 days',
          stakeAmount: 1.0,
          deadline: '2024-02-15',
          progress: 75,
          members: 12,
          status: 'active'
        },
        {
          id: 2,
          name: 'Fitness Warriors',
          description: '30-day fitness challenge',
          stakeAmount: 0.5,
          deadline: '2024-02-20',
          progress: 60,
          members: 8,
          status: 'active'
        },
        {
          id: 3,
          name: 'Study Squad',
          description: 'Complete online course',
          stakeAmount: 2.0,
          deadline: '2024-01-30',
          progress: 100,
          members: 15,
          status: 'completed'
        }
      ])

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
          <Target className="w-16 h-16 text-avalanche-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to view your dashboard</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your commitment overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Groups */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Groups</h2>
                <Link to="/groups/create" className="btn btn-primary btn-sm">
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
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{group.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            group.status === 'active' 
                              ? 'bg-success-100 text-success-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {group.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{group.members} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Trophy className="w-4 h-4" />
                            <span>{group.stakeAmount} AVAX</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{group.deadline}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{group.progress}%</div>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-avalanche-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${group.progress}%` }}
                            />
                          </div>
                        </div>
                        <Link 
                          to={`/groups/${group.id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link to="/groups" className="btn btn-outline">
                  View All Groups
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines & Quick Actions */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <motion.div
                    key={deadline.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-3 rounded-lg border ${
                      deadline.status === 'urgent' 
                        ? 'border-error-200 bg-error-50' 
                        : 'border-warning-200 bg-warning-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{deadline.groupName}</h4>
                        <p className="text-sm text-gray-600">{deadline.deadline}</p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        deadline.status === 'urgent' 
                          ? 'bg-error-100 text-error-700' 
                          : 'bg-warning-100 text-warning-700'
                      }`}>
                        {deadline.daysLeft} days left
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/groups/create" className="btn btn-primary w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Group
                </Link>
                <Link to="/groups" className="btn btn-outline w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Browse Groups
                </Link>
                <Link to="/achievements" className="btn btn-outline w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Achievements
                </Link>
                <Link to="/leaderboard" className="btn btn-outline w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Leaderboard
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Completed LeetCode problem #87</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-avalanche-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Joined "Fitness Warriors" group</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Milestone reached: 50% progress</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
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

