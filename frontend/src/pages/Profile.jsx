import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Target,
  TrendingUp,
  Award,
  Settings,
  Edit,
  Save,
  X
} from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'

export default function Profile() {
  const { account, formatAddress } = useWeb3()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Passionate about achieving goals and helping others succeed.',
    joinDate: '2024-01-01',
    totalGroups: 5,
    completedGoals: 12,
    totalRewards: 2.5,
    achievements: 8
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save profile logic here
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-outline w-full sm:w-auto justify-center"
            >
              {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-red-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{profile.name}</h2>
                <p className="text-sm sm:text-base text-gray-300 mb-4">{formatAddress(account)}</p>
                <p className="text-sm sm:text-base text-gray-300">{profile.bio}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="label">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="input"
                    />
                  ) : (
                    <p className="text-white text-sm sm:text-base">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="label">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="input"
                    />
                  ) : (
                    <p className="text-white text-sm sm:text-base">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="label">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="textarea"
                      rows={3}
                    />
                  ) : (
                    <p className="text-white text-sm sm:text-base">{profile.bio}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <button onClick={handleSave} className="btn btn-primary w-full sm:w-auto justify-center">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-outline w-full sm:w-auto justify-center">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="card text-center">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">{profile.totalGroups}</div>
            <div className="text-xs sm:text-sm text-gray-300">Groups Joined</div>
          </div>
          <div className="card text-center">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-success-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">{profile.completedGoals}</div>
            <div className="text-xs sm:text-sm text-gray-300">Goals Completed</div>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-warning-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">{profile.totalRewards} AVAX</div>
            <div className="text-xs sm:text-sm text-gray-300">Total Rewards</div>
          </div>
          <div className="card text-center">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-error-400 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">{profile.achievements}</div>
            <div className="text-xs sm:text-sm text-gray-300">Achievements</div>
          </div>
        </div>
      </div>
    </div>
  )
}

