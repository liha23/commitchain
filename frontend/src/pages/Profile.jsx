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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-outline"
            >
              {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="w-32 h-32 bg-avalanche-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-16 h-16 text-avalanche-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                <p className="text-gray-600 mb-4">{formatAddress(account)}</p>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
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
                    <p className="text-gray-900">{profile.name}</p>
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
                    <p className="text-gray-900">{profile.email}</p>
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
                    <p className="text-gray-900">{profile.bio}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex space-x-4">
                    <button onClick={handleSave} className="btn btn-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-outline">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="card text-center">
            <Target className="w-8 h-8 text-avalanche-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{profile.totalGroups}</div>
            <div className="text-sm text-gray-600">Groups Joined</div>
          </div>
          <div className="card text-center">
            <Trophy className="w-8 h-8 text-success-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{profile.completedGoals}</div>
            <div className="text-sm text-gray-600">Goals Completed</div>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-8 h-8 text-warning-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{profile.totalRewards} AVAX</div>
            <div className="text-sm text-gray-600">Total Rewards</div>
          </div>
          <div className="card text-center">
            <Award className="w-8 h-8 text-error-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{profile.achievements}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
        </div>
      </div>
    </div>
  )
}

