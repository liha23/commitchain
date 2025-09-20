import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Star, 
  Award, 
  Target,
  Users,
  Calendar,
  Eye,
  Share2,
  Filter,
  Search
} from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Achievements() {
  const { isConnected } = useWeb3()
  const [isLoading, setIsLoading] = useState(true)
  const [achievements, setAchievements] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAchievements([
        {
          id: 1,
          name: 'LeetCode Master',
          description: 'Completed 100 LeetCode problems',
          rarity: 'legendary',
          rarityLevel: 5,
          image: '/achievements/leetcode-master.png',
          earnedAt: '2024-01-15',
          groupName: 'LeetCode Masters',
          proofHash: 'QmProof123',
          isEarned: true
        },
        {
          id: 2,
          name: 'Fitness Warrior',
          description: 'Completed 30-day fitness challenge',
          rarity: 'epic',
          rarityLevel: 4,
          image: '/achievements/fitness-warrior.png',
          earnedAt: '2024-01-20',
          groupName: 'Fitness Warriors',
          proofHash: 'QmProof456',
          isEarned: true
        },
        {
          id: 3,
          name: 'Study Legend',
          description: 'Completed online course',
          rarity: 'rare',
          rarityLevel: 3,
          image: '/achievements/study-legend.png',
          earnedAt: '2024-01-25',
          groupName: 'Study Squad',
          proofHash: 'QmProof789',
          isEarned: true
        },
        {
          id: 4,
          name: 'Crypto Trader',
          description: 'Mastered cryptocurrency trading',
          rarity: 'epic',
          rarityLevel: 4,
          image: '/achievements/crypto-trader.png',
          earnedAt: null,
          groupName: 'Crypto Traders',
          proofHash: null,
          isEarned: false
        }
      ])
    } catch (error) {
      console.error('Error loading achievements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100'
      case 'uncommon': return 'text-green-600 bg-green-100'
      case 'rare': return 'text-blue-600 bg-blue-100'
      case 'epic': return 'text-purple-600 bg-purple-100'
      case 'legendary': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'legendary': return <Star className="w-4 h-4" />
      case 'epic': return <Award className="w-4 h-4" />
      case 'rare': return <Trophy className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'earned' && achievement.isEarned) ||
                         (filter === 'unearned' && !achievement.isEarned) ||
                         (filter === achievement.rarity)
    
    return matchesSearch && matchesFilter
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-avalanche-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to view achievements</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">Your collection of earned achievements and badges</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <Trophy className="w-8 h-8 text-avalanche-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {achievements.filter(a => a.isEarned).length}
            </div>
            <div className="text-sm text-gray-600">Earned</div>
          </div>
          <div className="card text-center">
            <Target className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {achievements.filter(a => !a.isEarned).length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="card text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {achievements.filter(a => a.isEarned && a.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-gray-600">Legendary</div>
          </div>
          <div className="card text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {achievements.filter(a => a.isEarned && a.rarity === 'epic').length}
            </div>
            <div className="text-sm text-gray-600">Epic</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search achievements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'earned', 'unearned', 'legendary', 'epic', 'rare', 'uncommon', 'common'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                    filter === filterType
                      ? 'bg-avalanche-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`card hover:shadow-lg transition-all duration-300 ${
                achievement.isEarned ? 'opacity-100' : 'opacity-60'
              }`}
            >
              {/* Achievement Image */}
              <div className="relative mb-4">
                <div className="w-full h-32 bg-gradient-to-br from-avalanche-100 to-avalanche-200 rounded-lg flex items-center justify-center">
                  {achievement.isEarned ? (
                    <Trophy className="w-16 h-16 text-avalanche-600" />
                  ) : (
                    <Target className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                
                {/* Rarity Badge */}
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getRarityColor(achievement.rarity)}`}>
                  {getRarityIcon(achievement.rarity)}
                  <span className="capitalize">{achievement.rarity}</span>
                </div>

                {/* Earned Badge */}
                {achievement.isEarned && (
                  <div className="absolute top-2 left-2 px-2 py-1 text-xs bg-success-100 text-success-700 rounded-full">
                    Earned
                  </div>
                )}
              </div>

              {/* Achievement Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>

                {achievement.isEarned && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Group:</span>
                      <span className="font-medium text-gray-900">{achievement.groupName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Earned:</span>
                      <span className="font-medium text-gray-900">{achievement.earnedAt}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  {achievement.isEarned ? (
                    <>
                      <button className="btn btn-outline btn-sm flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-primary btn-sm w-full">
                      <Target className="w-4 h-4 mr-1" />
                      Earn This
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start completing goals to earn achievements!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

