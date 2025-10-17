import { Link } from 'react-router-dom'
import { Github, Twitter, MessageCircle, ExternalLink } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Platform: [
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'FAQ', href: '/faq' },
    ],
    Community: [
      { name: 'Discord', href: 'https://discord.gg/avalancheavax', external: true },
      { name: 'Twitter', href: 'https://twitter.com/avalancheavax', external: true },
      { name: 'GitHub', href: 'https://github.com/avalanche-commitment-platform', external: true },
      { name: 'Blog', href: '/blog' },
    ],
    Resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
      { name: 'Smart Contracts', href: '/contracts' },
      { name: 'Audit Reports', href: '/audits' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  }

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1 sm:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 avalanche-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-lg sm:text-xl font-bold">
                Commit<span className="text-red-500">Chain</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              The decentralized commitment platform on Avalanche. Set goals, stake AVAX, and achieve your dreams with community support.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a
                href="https://twitter.com/avalancheavax"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://discord.gg/avalancheavax"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://github.com/avalanche-commitment-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
                {category}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm flex items-center space-x-1"
                      >
                        <span className="truncate">{link.name}</span>
                        <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm block truncate"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} CommitChain. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <span className="text-gray-400 text-xs sm:text-sm">Built on</span>
              <a
                href="https://avax.network"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded"></div>
                <span className="text-xs sm:text-sm font-medium">Avalanche</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
