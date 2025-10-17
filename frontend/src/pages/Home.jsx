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
      content: 'CommitChain helped me finally complete my LeetCode challenge. The community support and financial incentive made all the difference.',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
                Commit to Your
                <span className="avalanche-gradient bg-clip-text text-transparent"> Dreams</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Join the decentralized commitment platform on Avalanche. Set goals, stake AVAX, 
                and achieve your dreams with community support and automated rewards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
            >
              {isConnected ? (
                <Link to="/dashboard" className="btn btn-primary text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              ) : (
                <button
                  onClick={connectWallet}
                  className="btn btn-primary text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto"
                >
                  Connect Wallet
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </button>
              )}
              <button className="btn btn-outline text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-center w-full sm:w-auto">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16 px-4"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-1 sm:mb-2">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
              How It Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Simple steps to achieve your goals with community support and financial incentives
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center px-4"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 avalanche-gradient rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
              What Our Users Say
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Join thousands of users who have achieved their goals with CommitChain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-900/30 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <span className="text-red-400 font-semibold text-sm sm:text-base">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white text-sm sm:text-base truncate">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-200 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 avalanche-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
              Ready to Achieve Your Goals?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-red-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join the community of goal-achievers and start your commitment journey today
            </p>
            {isConnected ? (
              <Link to="/groups/create" className="btn bg-white text-red-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 inline-flex items-center justify-center">
                Create Your First Group
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
            ) : (
              <button
                onClick={connectWallet}
                className="btn bg-white text-red-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 inline-flex items-center justify-center"
              >
                Connect Wallet to Start
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

