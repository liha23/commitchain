import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Target, 
  Users, 
  Trophy, 
  Zap, 
  Shield, 
  Clock,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  TrendingUp,
  Award
} from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'

export default function Home() {
  const { isConnected, connectWallet } = useWeb3()

  const features = [
    {
      icon: Target,
      title: 'Set Clear Goals',
      description: 'Define specific, measurable commitments with your community'
    },
    {
      icon: Users,
      title: 'Join Groups',
      description: 'Connect with like-minded people working towards similar goals'
    },
    {
      icon: Shield,
      title: 'Stake AVAX',
      description: 'Put your money where your mouth is with secure staking'
    },
    {
      icon: Trophy,
      title: 'Earn Rewards',
      description: 'Get rewarded for completing your commitments and helping others'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Groups Created', value: '2,500+', icon: Target },
    { label: 'Goals Completed', value: '50,000+', icon: CheckCircle },
    { label: 'AVAX Staked', value: '1,000+', icon: TrendingUp }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      content: 'CommitAvalanche helped me finally complete my LeetCode challenge. The community support and financial incentive made all the difference.',
      avatar: 'SC',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Fitness Enthusiast',
      content: 'I lost 30 pounds in 3 months thanks to my fitness group. The accountability and rewards kept me motivated throughout.',
      avatar: 'MR',
      rating: 5
    },
    {
      name: 'Emily Johnson',
      role: 'Student',
      content: 'The study groups on this platform are amazing. I aced my exams and earned some AVAX in the process!',
      avatar: 'EJ',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Commit to Your
                <span className="avalanche-gradient bg-clip-text text-transparent"> Dreams</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Join the decentralized commitment platform on Avalanche. Set goals, stake AVAX, 
                and achieve your dreams with community support and automated rewards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {isConnected ? (
                <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-3">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <button
                  onClick={connectWallet}
                  className="btn btn-primary text-lg px-8 py-3"
                >
                  Connect Wallet
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              )}
              <button className="btn btn-outline text-lg px-8 py-3 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <Icon className="w-8 h-8 text-avalanche-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to achieve your goals with community support and financial incentives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 avalanche-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of users who have achieved their goals with CommitAvalanche
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-avalanche-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-avalanche-600 font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 avalanche-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Achieve Your Goals?
            </h2>
            <p className="text-xl text-avalanche-100 mb-8 max-w-2xl mx-auto">
              Join the community of goal-achievers and start your commitment journey today
            </p>
            {isConnected ? (
              <Link to="/groups/create" className="btn bg-white text-avalanche-600 hover:bg-gray-100 text-lg px-8 py-3">
                Create Your First Group
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            ) : (
              <button
                onClick={connectWallet}
                className="btn bg-white text-avalanche-600 hover:bg-gray-100 text-lg px-8 py-3"
              >
                Connect Wallet to Start
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

