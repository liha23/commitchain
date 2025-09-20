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

export default function Groups() {
  const { isConnected } = useWeb3()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [groups, setGroups] = useState([])

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setGroups([
        {
          id: 1,
          name: 'LeetCode Masters',
          description: 'Complete 100 LeetCode problems in 30 days. Perfect for software engineers preparing for interviews.',
          creator: '0x1234...5678',
          stakeAmount: 1.0,
          totalStaked: 12.0,
          deadline: '2024-02-15',
          isPrivate: false,
          memberCount: 12,
          maxMembers: 20,
          category: 'coding',
          tags: ['programming', 'algorithms', 'interviews'],
          progress: 75,
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Fitness Warriors',
          description: '30-day fitness challenge with daily workouts and nutrition tracking.',
          creator: '0x2345...6789',
          stakeAmount: 0.5,
          totalStaked: 4.0,
          deadline: '2024-02-20',
          isPrivate: false,
          memberCount: 8,
          maxMembers: 15,
          category: 'fitness',
          tags: ['workout', 'health', 'nutrition'],
          progress: 60,
          status: 'active',
          createdAt: '2024-01-20'
        },
        {
          id: 3,
          name: 'Study Squad',
          description: 'Complete the React Developer course on Udemy within 6 weeks.',
          creator: '0x3456...7890',
          stakeAmount: 2.0,
          totalStaked: 30.0,
          deadline: '2024-01-30',
          isPrivate: false,
          memberCount: 15,
          maxMembers: 20,
          category: 'education',
          tags: ['react', 'javascript', 'web-development'],
          progress: 100,
          status: 'completed',
          createdAt: '2024-01-01'
        },
        {
          id: 4,
          name: 'Crypto Traders',
          description: 'Learn and practice cryptocurrency trading strategies for 2 months.',
          creator: '0x4567...8901',
          stakeAmount: 5.0,
          totalStaked: 50.0,
          deadline: '2024-03-15',
          isPrivate: true,
          memberCount: 10,
          maxMembers: 12,
          category: 'finance',
          tags: ['crypto', 'trading', 'defi'],
          progress: 30,
          status: 'active',
          createdAt: '2024-01-10'
        }
      ])
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
          <Users className="w-16 h-16 text-avalanche-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to view groups</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Groups</h1>
            <p className="text-gray-600">Join commitment groups and achieve your goals together</p>
          </div>
          <Link to="/groups/create" className="btn btn-primary mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilterType(category.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filterType === category.value
                      ? 'bg-avalanche-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              {/* Group Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    {group.isPrivate && (
                      <span className="px-2 py-1 text-xs bg-warning-100 text-warning-700 rounded-full">
                        Private
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      group.status === 'active' 
                        ? 'bg-success-100 text-success-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {group.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                </div>
              </div>

              {/* Group Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{group.memberCount}/{group.maxMembers} members</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Trophy className="w-4 h-4" />
                    <span>{group.stakeAmount} AVAX</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{group.deadline}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{group.totalStaked} AVAX staked</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{group.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-avalanche-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${group.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {group.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {group.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{group.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link 
                  to={`/groups/${group.id}`}
                  className="btn btn-primary flex-1 justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
                {group.status === 'active' && (
                  <button className="btn btn-outline">
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
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
            <p className="text-gray-600 mb-6">
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

