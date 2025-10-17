import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  Trophy, 
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Upload,
  Vote,
  MessageCircle
} from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function GroupDetail() {
  const { id } = useParams()
  const { isConnected, account } = useWeb3()
  const [isLoading, setIsLoading] = useState(true)
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    if (id) {
      loadGroupDetails()
    }
  }, [id])

  const loadGroupDetails = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setGroup({
        id: parseInt(id),
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
        createdAt: '2024-01-15',
        milestones: [
          { percentage: 25, reached: true, reachedAt: '2024-01-20' },
          { percentage: 50, reached: true, reachedAt: '2024-01-25' },
          { percentage: 75, reached: false, reachedAt: null }
        ]
      })

      setMembers([
        { address: '0x1234...5678', name: 'Alice', progress: 100, status: 'completed' },
        { address: '0x2345...6789', name: 'Bob', progress: 80, status: 'active' },
        { address: '0x3456...7890', name: 'Charlie', progress: 60, status: 'active' },
        { address: '0x4567...8901', name: 'Diana', progress: 40, status: 'active' }
      ])

      setIsMember(true) // Simulate user is a member
    } catch (error) {
      console.error('Error loading group details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <Users className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Please connect your wallet to view group details</p>
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

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-error-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Group Not Found</h2>
          <p className="text-gray-300 mb-6">The group you're looking for doesn't exist or has been removed</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  group.status === 'active' 
                    ? 'bg-success-100 text-success-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {group.status}
                </span>
                {group.isPrivate && (
                  <span className="px-3 py-1 text-sm bg-warning-100 text-warning-700 rounded-full">
                    Private
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-6">{group.description}</p>
              
              {/* Group Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{group.memberCount}</div>
                  <div className="text-sm text-gray-600">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{group.stakeAmount} AVAX</div>
                  <div className="text-sm text-gray-600">Stake Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{group.totalStaked} AVAX</div>
                  <div className="text-sm text-gray-600">Total Staked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{group.progress}%</div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 md:ml-6">
              {isMember ? (
                <div className="space-y-3">
                  <button className="btn btn-primary w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Proof
                  </button>
                  <button className="btn btn-outline w-full">
                    <Vote className="w-4 h-4 mr-2" />
                    Vote on Proofs
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary">
                  Join Group
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Progress Overview
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-medium text-gray-900">{group.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-avalanche-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${group.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Milestones</h3>
                  {group.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.reached ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {milestone.reached ? <CheckCircle className="w-4 h-4" /> : index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{milestone.percentage}% Milestone</div>
                          {milestone.reached && (
                            <div className="text-sm text-gray-600">
                              Reached on {milestone.reachedAt}
                            </div>
                          )}
                        </div>
                      </div>
                      {milestone.reached && (
                        <span className="text-sm text-success-600 font-medium">Completed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Members ({group.memberCount})
              </h2>
              
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-avalanche-100 rounded-full flex items-center justify-center">
                        <span className="text-avalanche-600 font-semibold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.address}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{member.progress}%</div>
                      <div className={`text-xs ${
                        member.status === 'completed' ? 'text-success-600' : 'text-gray-600'
                      }`}>
                        {member.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Group Info */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created by</span>
                  <span className="font-medium text-gray-900">{group.creator}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created on</span>
                  <span className="font-medium text-gray-900">{group.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Deadline</span>
                  <span className="font-medium text-gray-900">{group.deadline}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900 capitalize">{group.category}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="btn btn-outline w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Members
                </button>
                <button className="btn btn-outline w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View All Proofs
                </button>
                <button className="btn btn-outline w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Achievements
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

