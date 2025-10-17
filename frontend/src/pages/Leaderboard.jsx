import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Crown,
  TrendingUp,
  Users,
  Target,
  Award,
  Calendar,
  Filter
} from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { MOCK_LEADERBOARD } from '../services/mockData'

export default function Leaderboard() {
  const { isConnected } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [timeframe, setTimeframe] = useState('all')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    loadLeaderboard()
  }, [timeframe, category])

  const loadLeaderboard = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      setLeaderboard(MOCK_LEADERBOARD)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />
      case 2: return <Medal className="w-6 h-6 text-gray-400" />
      case 3: return <Medal className="w-6 h-6 text-amber-600" />
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">{rank}</span>
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3: return 'bg-gradient-to-r from-amber-500 to-amber-700'
      default: return 'bg-gray-100'
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Please connect your wallet to view the leaderboard</p>
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

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-sm sm:text-base text-gray-300">Top performers and goal achievers in the community</p>
        </div>

        {/* Filters */}
        <div className="card mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="label text-sm">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="select text-sm sm:text-base"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
                <option value="day">Today</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="label text-sm">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select text-sm sm:text-base"
              >
                <option value="all">All Categories</option>
                <option value="coding">Coding</option>
                <option value="fitness">Fitness</option>
                <option value="education">Education</option>
                <option value="finance">Finance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {leaderboard.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`card text-center relative ${
                user.rank === 1 ? 'sm:order-2 border-2 border-yellow-500' : user.rank === 2 ? 'sm:order-1' : 'sm:order-3'
              }`}
            >
              {/* Rank Badge */}
              <div className={`absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white ${getRankColor(user.rank)}`}>
                {getRankIcon(user.rank)}
              </div>

              {/* User Info */}
              <div className="pt-3 sm:pt-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-red-400 font-bold text-lg sm:text-xl">{user.avatar}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate px-2">{user.name}</h3>
                <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 truncate px-2">{user.address}</p>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm px-2">
                    <span className="text-gray-400">Rewards:</span>
                    <span className="font-medium text-white">{user.totalRewards} AVAX</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm px-2">
                    <span className="text-gray-400">Goals:</span>
                    <span className="font-medium text-white">{user.completedGoals}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm px-2">
                    <span className="text-gray-400">Win Rate:</span>
                    <span className="font-medium text-white">{user.winRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm px-2">
                    <span className="text-gray-400">Streak:</span>
                    <span className="font-medium text-white">{user.streak} days</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="card">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Full Leaderboard
          </h2>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3">
            {leaderboard.map((user, index) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="p-3 sm:p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {getRankIcon(user.rank)}
                    <span className="font-medium text-white text-sm">#{user.rank}</span>
                  </div>
                  <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 font-semibold text-sm">{user.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{user.name}</div>
                    <div className="text-xs text-gray-400 truncate">{user.address}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3 text-warning-400" />
                    <span className="text-gray-400">Rewards:</span>
                    <span className="font-medium text-white">{user.totalRewards}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-success-400" />
                    <span className="text-gray-400">Goals:</span>
                    <span className="font-medium text-white">{user.completedGoals}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-blue-400" />
                    <span className="text-gray-400">Win:</span>
                    <span className="font-medium text-white">{user.winRate}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-orange-400" />
                    <span className="text-gray-400">Streak:</span>
                    <span className="font-medium text-white">{user.streak}d</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-300 text-sm">Rank</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300 text-sm">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300 text-sm">Rewards</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300 text-sm">Goals</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300 text-sm">Groups</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300 text-sm">Achievements</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300 text-sm">Win Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300 text-sm">Streak</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <motion.tr
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(user.rank)}
                        <span className="font-medium text-white">#{user.rank}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center">
                          <span className="text-red-400 font-semibold text-sm">{user.avatar}</span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-warning-400" />
                        <span className="font-medium text-white">{user.totalRewards} AVAX</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4 text-success-400" />
                        <span className="font-medium text-white">{user.completedGoals}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-red-400" />
                        <span className="font-medium text-white">{user.groupsJoined}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span className="font-medium text-white">{user.achievements}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-white">{user.winRate}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="font-medium text-white">{user.streak} days</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

