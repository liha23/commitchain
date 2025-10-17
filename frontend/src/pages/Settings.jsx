import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload
} from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'

export default function Settings() {
  const { account, formatAddress } = useWeb3()
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Passionate about achieving goals and helping others succeed.',
      notifications: true,
      publicProfile: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      groupUpdates: true,
      achievementAlerts: true,
      deadlineReminders: true
    },
    privacy: {
      showProfile: true,
      showAchievements: true,
      showGroups: true,
      allowMessages: true
    },
    appearance: {
      theme: 'light',
      language: 'en',
      currency: 'AVAX'
    }
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ]

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings)
  }

  const handleExportData = () => {
    // Export user data logic here
    console.log('Exporting user data...')
  }

  const handleDeleteAccount = () => {
    // Delete account logic here
    console.log('Deleting account...')
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar - Horizontal on mobile, vertical on desktop */}
          <div className="lg:col-span-1">
            <div className="card">
              {/* Mobile: Horizontal scroll tabs */}
              <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                        activeTab === tab.id
                          ? 'bg-avalanche-50 text-avalanche-700 border border-avalanche-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Desktop: Vertical nav */}
              <nav className="hidden lg:block space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-avalanche-50 text-avalanche-700 border border-avalanche-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="card"
            >
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Profile Settings
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="label">Display Name</label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Email Address</label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Bio</label>
                      <textarea
                        value={settings.profile.bio}
                        onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
                        className="textarea"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.profile.publicProfile}
                        onChange={(e) => handleSettingChange('profile', 'publicProfile', e.target.checked)}
                        className="rounded border-gray-300 text-avalanche-600 focus:ring-avalanche-500"
                      />
                      <label className="text-sm text-gray-700">Make profile public</label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                        className="rounded border-gray-300 text-avalanche-600 focus:ring-avalanche-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                        className="rounded border-gray-300 text-avalanche-600 focus:ring-avalanche-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Group Updates</h3>
                        <p className="text-sm text-gray-600">Notifications about group activities</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.groupUpdates}
                        onChange={(e) => handleSettingChange('notifications', 'groupUpdates', e.target.checked)}
                        className="rounded border-gray-300 text-avalanche-600 focus:ring-avalanche-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Achievement Alerts</h3>
                        <p className="text-sm text-gray-600">Notifications when you earn achievements</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.achievementAlerts}
                        onChange={(e) => handleSettingChange('notifications', 'achievementAlerts', e.target.checked)}
                        className="rounded border-gray-300 text-avalanche-600 focus:ring-avalanche-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Deadline Reminders</h3>
                        <p className="text-sm text-gray-600">Reminders before group deadlines</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.deadlineReminders}
                        onChange={(e) => handleSettingChange('notifications', 'deadlineReminders', e.target.checked)}
                        className="rounded border-gray-300 text-avalanche-600 focus:ring-avalanche-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Privacy Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Show Profile</h3>
                        <p className="text-sm text-gray-600">Allow others to view your profile</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showProfile}
                        onChange={(e) => handleSettingChange('privacy', 'showProfile', e.target.checked)}
                        className="rounded border-gray-300 text-avalanche-600 focus:ring-avalanche-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Show Achievements</h3>
                        <p className="text-sm text-gray-600">Display your achievements publicly</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showAchievements}
                        onChange={(e) => handleSettingChange('privacy', 'showAchievements', e.target.checked)}
                        className="rounded border-gray-300 text-avalanche-600 focus:ring-avalanche-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Show Groups</h3>
                        <p className="text-sm text-gray-600">Display groups you're part of</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showGroups}
                        onChange={(e) => handleSettingChange('privacy', 'showGroups', e.target.checked)}
                        className="rounded border-gray-300 text-avalanche-600 focus:ring-avalanche-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Allow Messages</h3>
                        <p className="text-sm text-gray-600">Let other users send you messages</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.allowMessages}
                        onChange={(e) => handleSettingChange('privacy', 'allowMessages', e.target.checked)}
                        className="rounded border-gray-300 text-avalanche-600 focus:ring-avalanche-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Appearance Settings
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="label">Theme</label>
                      <select
                        value={settings.appearance.theme}
                        onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                        className="select"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Language</label>
                      <select
                        value={settings.appearance.language}
                        onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                        className="select"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Currency</label>
                      <select
                        value={settings.appearance.currency}
                        onChange={(e) => handleSettingChange('appearance', 'currency', e.target.value)}
                        className="select"
                      >
                        <option value="AVAX">AVAX</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button onClick={handleSave} className="btn btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <div className="card mt-8 border-error-200">
              <h2 className="text-xl font-semibold text-error-700 mb-4">Danger Zone</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-error-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-error-700">Export Data</h3>
                    <p className="text-sm text-error-600">Download all your data</p>
                  </div>
                  <button onClick={handleExportData} className="btn btn-outline btn-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-error-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-error-700">Delete Account</h3>
                    <p className="text-sm text-error-600">Permanently delete your account and all data</p>
                  </div>
                  <button onClick={handleDeleteAccount} className="btn btn-error btn-sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

