import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Calendar, 
  Trophy,
  Clock,
  Target,
  Eye,
  TrendingUp,
  Star
} from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { MOCK_GROUPS } from '../services/mockData'

export default function Groups() {
  const { isConnected } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [groups, setGroups] = useState([])

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    setIsLoading(true)
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500))
      setGroups(MOCK_GROUPS)
    } catch (error) {
      console.error('Error loading groups:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'active' && group.status === 'active') ||
                         (filterType === 'completed' && group.status === 'completed') ||
                         (filterType === 'private' && group.isPrivate) ||
                         (filterType === 'public' && !group.isPrivate)
    
    return matchesSearch && matchesFilter
  })

  const categories = [
    { value: 'all', label: 'All Groups', count: groups.length },
    { value: 'active', label: 'Active', count: groups.filter(g => g.status === 'active').length },
    { value: 'completed', label: 'Completed', count: groups.filter(g => g.status === 'completed').length },
    { value: 'public', label: 'Public', count: groups.filter(g => !g.isPrivate).length },
    { value: 'private', label: 'Private', count: groups.filter(g => g.isPrivate).length }
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <Users className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to view groups</p>
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

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">Commitment Groups</h1>
            <p className="text-sm sm:text-base text-gray-400">Join commitment groups and achieve your goals together</p>
          </div>
          <Link to="/groups/create" className="btn btn-primary w-full md:w-auto justify-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilterType(category.value)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    filterType === category.value
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card hover:shadow-lg hover:shadow-red-900/20 transition-all border-gray-700"
            >
              {/* Group Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-gray-100 text-sm sm:text-base truncate">{group.name}</h3>
                    {group.isPrivate && (
                      <span className="px-2 py-1 text-xs bg-warning-900/30 text-warning-400 rounded-full flex-shrink-0">
                        Private
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                      group.status === 'active' 
                        ? 'bg-success-900/30 text-success-400' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {group.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{group.description}</p>
                </div>
              </div>

              {/* Prominent Stats - Stake & Participants */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-red-400">{group.stakeAmount}</p>
                  <p className="text-xs text-gray-500">AVAX Stake</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-red-400">{group.memberCount}/{group.maxMembers}</p>
                  <p className="text-xs text-gray-500">Members</p>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                  <div className="flex items-center space-x-1 text-gray-400 min-w-0">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">Pool: {group.totalStaked} AVAX</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400 flex-shrink-0">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs">{group.deadline}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-medium text-gray-100">{group.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${group.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                {group.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {group.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                    +{group.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Link 
                  to={`/groups/${group.id}`}
                  className="btn btn-primary flex-1 justify-center text-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
                {group.status === 'active' && (
                  <button className="btn btn-outline text-sm sm:w-auto">
                    Join
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-100 mb-2">No groups found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a group!'
              }
            </p>
            <Link to="/groups/create" className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

