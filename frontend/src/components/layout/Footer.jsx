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
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 avalanche-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="text-xl font-bold">
                Commit<span className="text-avalanche-400">Avalanche</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              The decentralized commitment platform on Avalanche. Set goals, stake AVAX, and achieve your dreams with community support.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/avalancheavax"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-avalanche-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://discord.gg/avalancheavax"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-avalanche-400 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/avalanche-commitment-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-avalanche-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-1"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
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
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} CommitAvalanche. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Built on</span>
              <a
                href="https://avax.network"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-avalanche-400 hover:text-avalanche-300 transition-colors"
              >
                <div className="w-5 h-5 bg-avalanche-500 rounded"></div>
                <span className="text-sm font-medium">Avalanche</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
