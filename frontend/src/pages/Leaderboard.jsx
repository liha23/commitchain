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

export default function Leaderboard() {
  const { isConnected } = useWeb3()
  const [isLoading, setIsLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState([])
  const [timeframe, setTimeframe] = useState('all')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    loadLeaderboard()
  }, [timeframe, category])

  const loadLeaderboard = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setLeaderboard([
        {
          rank: 1,
          address: '0x1234...5678',
          name: 'Alice Johnson',
          avatar: 'AJ',
          totalRewards: 15.5,
          completedGoals: 25,
          groupsJoined: 8,
          achievements: 12,
          winRate: 95,
          streak: 12,
          category: 'coding'
        },
        {
          rank: 2,
          address: '0x2345...6789',
          name: 'Bob Smith',
          avatar: 'BS',
          totalRewards: 12.3,
          completedGoals: 20,
          groupsJoined: 6,
          achievements: 10,
          winRate: 90,
          streak: 8,
          category: 'fitness'
        },
        {
          rank: 3,
          address: '0x3456...7890',
          name: 'Charlie Brown',
          avatar: 'CB',
          totalRewards: 10.8,
          completedGoals: 18,
          groupsJoined: 5,
          achievements: 9,
          winRate: 85,
          streak: 6,
          category: 'education'
        },
        {
          rank: 4,
          address: '0x4567...8901',
          name: 'Diana Prince',
          avatar: 'DP',
          totalRewards: 9.2,
          completedGoals: 15,
          groupsJoined: 4,
          achievements: 8,
          winRate: 80,
          streak: 5,
          category: 'coding'
        },
        {
          rank: 5,
          address: '0x5678...9012',
          name: 'Eve Wilson',
          avatar: 'EW',
          totalRewards: 8.7,
          completedGoals: 14,
          groupsJoined: 4,
          achievements: 7,
          winRate: 78,
          streak: 4,
          category: 'fitness'
        }
      ])
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
          <Trophy className="w-16 h-16 text-avalanche-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to view the leaderboard</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top performers and goal achievers in the community</p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="select"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
                <option value="day">Today</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaderboard.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`card text-center relative ${
                user.rank === 1 ? 'md:order-2' : user.rank === 2 ? 'md:order-1' : 'md:order-3'
              }`}
            >
              {/* Rank Badge */}
              <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white ${getRankColor(user.rank)}`}>
                {getRankIcon(user.rank)}
              </div>

              {/* User Info */}
              <div className="pt-4">
                <div className="w-20 h-20 bg-avalanche-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-avalanche-600 font-bold text-xl">{user.avatar}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{user.address}</p>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Rewards:</span>
                    <span className="font-medium text-gray-900">{user.totalRewards} AVAX</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Goals:</span>
                    <span className="font-medium text-gray-900">{user.completedGoals}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Win Rate:</span>
                    <span className="font-medium text-gray-900">{user.winRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Streak:</span>
                    <span className="font-medium text-gray-900">{user.streak} days</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Full Leaderboard
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rank</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rewards</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Goals</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Groups</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Achievements</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Win Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Streak</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <motion.tr
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(user.rank)}
                        <span className="font-medium text-gray-900">#{user.rank}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-avalanche-100 rounded-full flex items-center justify-center">
                          <span className="text-avalanche-600 font-semibold text-sm">{user.avatar}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-warning-600" />
                        <span className="font-medium text-gray-900">{user.totalRewards} AVAX</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4 text-success-600" />
                        <span className="font-medium text-gray-900">{user.completedGoals}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-avalanche-600" />
                        <span className="font-medium text-gray-900">{user.groupsJoined}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-900">{user.achievements}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{user.winRate}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-gray-900">{user.streak} days</span>
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

