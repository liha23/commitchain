import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="max-w-md w-full mx-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-avalanche-600 mb-4">404</div>
            <div className="w-24 h-1 bg-avalanche-600 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-primary">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="btn btn-outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Popular Pages
            </h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/groups" className="text-avalanche-600 hover:text-avalanche-700">
                Browse Groups
              </Link>
              <Link to="/achievements" className="text-avalanche-600 hover:text-avalanche-700">
                Achievements
              </Link>
              <Link to="/leaderboard" className="text-avalanche-600 hover:text-avalanche-700">
                Leaderboard
              </Link>
              <Link to="/dashboard" className="text-avalanche-600 hover:text-avalanche-700">
                Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

