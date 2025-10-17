import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Target, 
  Users, 
  Calendar, 
  Lock, 
  Unlock,
  Plus,
  Minus,
  Save,
  ArrowLeft
} from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import toast from 'react-hot-toast'

export default function CreateGroup() {
  const navigate = useNavigate()
  const { isConnected, getContract } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stakeAmount: '',
    deadline: '',
    isPrivate: false,
    milestones: [25, 50, 75] // Default milestones in percentage
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, 0]
    }))
  }

  const removeMilestone = (index) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  const updateMilestone = (index, value) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? parseInt(value) || 0 : milestone
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    try {
      const commitmentPot = getContract('CommitmentPot')
      if (!commitmentPot) {
        throw new Error('Contract not available')
      }

      const stakeAmount = parseFloat(formData.stakeAmount)
      const deadline = Math.floor(new Date(formData.deadline).getTime() / 1000)
      const milestones = formData.milestones.map(m => m * 100) // Convert to basis points

      const tx = await commitmentPot.createGroup(
        formData.name,
        formData.description,
        ethers.utils.parseEther(stakeAmount.toString()),
        deadline,
        formData.isPrivate,
        milestones,
        { value: ethers.utils.parseEther(stakeAmount.toString()) }
      )

      await tx.wait()
      toast.success('Group created successfully!')
      navigate('/groups')
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error(error.message || 'Failed to create group')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <Target className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Please connect your wallet to create a group</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/groups')}
            className="btn btn-ghost mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Group</h1>
          <p className="text-gray-600">Set up a commitment group and start achieving goals together</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
              
              <div>
                <label className="label">Group Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., LeetCode Masters"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the group's purpose and goals..."
                  className="textarea"
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Group Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Group Settings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Stake Amount (AVAX)</label>
                  <input
                    type="number"
                    name="stakeAmount"
                    value={formData.stakeAmount}
                    onChange={handleInputChange}
                    placeholder="1.0"
                    step="0.1"
                    min="0.1"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Deadline</label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-avalanche-600 focus:ring-avalanche-500"
                />
                <label className="text-sm text-gray-700 flex items-center">
                  {formData.isPrivate ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
                  Private Group (invite only)
                </label>
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Milestones
                </h2>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="btn btn-outline btn-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Milestone
                </button>
              </div>
              
              <p className="text-sm text-gray-600">
                Set milestone percentages for partial reward distribution
              </p>

              <div className="space-y-3">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label className="label">Milestone {index + 1} (%)</label>
                      <input
                        type="number"
                        value={milestone}
                        onChange={(e) => updateMilestone(index, e.target.value)}
                        placeholder="25"
                        min="0"
                        max="100"
                        className="input"
                      />
                    </div>
                    {formData.milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="btn btn-error btn-sm mt-6"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/groups')}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? (
                  <>
                    <div className="spinner w-4 h-4 mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Group
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

