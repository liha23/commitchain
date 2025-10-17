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
import { MOCK_ACHIEVEMENTS } from '../services/mockData'

export default function Achievements() {
  const { isConnected } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [achievements, setAchievements] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      setAchievements(MOCK_ACHIEVEMENTS)
    } catch (error) {
      console.error('Error loading achievements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-700 text-gray-200'
      case 'uncommon': return 'bg-green-900/30 text-green-400'
      case 'rare': return 'bg-blue-900/30 text-blue-400'
      case 'epic': return 'bg-purple-900/30 text-purple-400'
      case 'legendary': return 'bg-yellow-900/30 text-yellow-400'
      default: return 'bg-gray-700 text-gray-200'
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
                         (filter === 'unearned' && !achievement.isEarned) ||
                         (filter === achievement.rarity)
    
    return matchesSearch && matchesFilter
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Please connect your wallet to view achievements</p>
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Achievements</h1>
          <p className="text-sm sm:text-base text-gray-300">Your collection of earned achievements and badges</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="card text-center">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">
              {achievements.filter(a => a.isEarned).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Earned</div>
          </div>
          <div className="card text-center">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">
              {achievements.filter(a => !a.isEarned).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Available</div>
          </div>
          <div className="card text-center">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">
              {achievements.filter(a => a.isEarned && a.rarity === 'legendary').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Legendary</div>
          </div>
          <div className="card text-center">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">
              {achievements.filter(a => a.isEarned && a.rarity === 'epic').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Epic</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search achievements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['all', 'earned', 'unearned', 'legendary', 'epic', 'rare', 'uncommon', 'common'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors capitalize flex-shrink-0 ${
                    filter === filterType
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`card hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300 ${
                achievement.isEarned ? 'opacity-100' : 'opacity-60'
              }`}
            >
              {/* Achievement Image */}
              <div className="relative mb-4">
                <div className="w-full h-28 sm:h-32 bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-lg flex items-center justify-center">
                  {achievement.isEarned ? (
                    <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-red-400" />
                  ) : (
                    <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" />
                  )}
                </div>
                
                {/* Rarity Badge */}
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getRarityColor(achievement.rarity)}`}>
                  {getRarityIcon(achievement.rarity)}
                  <span className="capitalize">{achievement.rarity}</span>
                </div>

                {/* Earned Badge */}
                {achievement.isEarned && (
                  <div className="absolute top-2 left-2 px-2 py-1 text-xs bg-success-900/30 text-success-400 rounded-full">
                    Earned
                  </div>
                )}
              </div>

              {/* Achievement Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">{achievement.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-300">{achievement.description}</p>
                </div>

                {achievement.isEarned && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-400">Group:</span>
                      <span className="font-medium text-white truncate ml-2">{achievement.groupName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-400">Earned:</span>
                      <span className="font-medium text-white">{achievement.earnedAt}</span>
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

