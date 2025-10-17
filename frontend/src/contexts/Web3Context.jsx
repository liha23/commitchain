import React, { createContext, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

const Web3Context = createContext()

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    address: '0x1234567890123456789012345678901234567890',
    name: 'Alice Developer',
    avatar: 'AD',
    balance: 10.5,
    reputation: 850,
  },
  {
    address: '0x0987654321098765432109876543210987654321',
    name: 'Bob Fitness',
    avatar: 'BF',
    balance: 5.2,
    reputation: 620,
  },
  {
    address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    name: 'Charlie Student',
    avatar: 'CS',
    balance: 15.8,
    reputation: 1200,
  },
]

// Avalanche network configurations
const AVALANCHE_NETWORKS = {
  fuji: {
    chainId: '0xa869', // 43113
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io/'],
  },
  mainnet: {
    chainId: '0xa86a', // 43114
    chainName: 'Avalanche Network',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/'],
  },
}

// Contract addresses (will be loaded from environment)
const CONTRACT_ADDRESSES = {
  fuji: {
    CommitmentPot: import.meta.env.VITE_COMMITMENT_POT_ADDRESS,
    VerificationVoter: import.meta.env.VITE_VERIFICATION_VOTER_ADDRESS,
    MilestoneChecker: import.meta.env.VITE_MILESTONE_CHECKER_ADDRESS,
    CommitToken: import.meta.env.VITE_COMMIT_TOKEN_ADDRESS,
    AchievementNFT: import.meta.env.VITE_ACHIEVEMENT_NFT_ADDRESS,
    OracleIntegration: import.meta.env.VITE_ORACLE_INTEGRATION_ADDRESS,
  },
  mainnet: {
    CommitmentPot: import.meta.env.VITE_COMMITMENT_POT_ADDRESS_MAINNET,
    VerificationVoter: import.meta.env.VITE_VERIFICATION_VOTER_ADDRESS_MAINNET,
    MilestoneChecker: import.meta.env.VITE_MILESTONE_CHECKER_ADDRESS_MAINNET,
    CommitToken: import.meta.env.VITE_COMMIT_TOKEN_ADDRESS_MAINNET,
    AchievementNFT: import.meta.env.VITE_ACHIEVEMENT_NFT_ADDRESS_MAINNET,
    OracleIntegration: import.meta.env.VITE_ORACLE_INTEGRATION_ADDRESS_MAINNET,
  },
}

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [network, setNetwork] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [contracts, setContracts] = useState({})

  // Check if user was previously connected (from localStorage)
  useEffect(() => {
    const savedAccount = localStorage.getItem('commitchain_connected')
    if (savedAccount && savedAccount !== 'null') {
      // Simulate reconnection
      setAccount(savedAccount)
      setIsConnected(true)
    }
  }, [])

  const connectWallet = async () => {
    try {
      setIsLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Select a random mock user
      const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)]
      
      // Save connection state
      localStorage.setItem('commitchain_connected', randomUser.address)
      localStorage.setItem('commitchain_user', JSON.stringify(randomUser))
      
      setAccount(randomUser.address)
      setIsConnected(true)
      
      // Mock network
      setNetwork({ chainId: 43113, name: 'Avalanche Fuji Testnet' })
      
      toast.success(`Connected as ${randomUser.name}! (Demo Account)`)
      return true
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    localStorage.removeItem('commitchain_connected')
    localStorage.removeItem('commitchain_user')
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setNetwork(null)
    setIsConnected(false)
    setContracts({})
    toast.success('Wallet disconnected')
  }

  const switchNetwork = async (networkType = 'fuji') => {
    try {
      setIsLoading(true)
      
      // In a real implementation, this would switch the MetaMask network
      // For demo purposes, we'll just update the network state
      const networkConfig = AVALANCHE_NETWORKS[networkType]
      
      if (!networkConfig) {
        toast.error('Invalid network type')
        return false
      }
      
      // Simulate network switch delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setNetwork({
        chainId: parseInt(networkConfig.chainId, 16),
        name: networkConfig.chainName,
      })
      
      toast.success(`Switched to ${networkConfig.chainName}`)
      return true
    } catch (error) {
      console.error('Error switching network:', error)
      toast.error('Failed to switch network')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getContract = (contractName) => {
    return contracts[contractName] || null
  }

  const getNetworkName = () => {
    return 'Avalanche Fuji Testnet'
  }

  const getExplorerUrl = (type, value) => {
    const baseUrl = 'https://testnet.snowtrace.io'
    
    switch (type) {
      case 'address':
        return `${baseUrl}/address/${value}`
      case 'tx':
        return `${baseUrl}/tx/${value}`
      case 'token':
        return `${baseUrl}/token/${value}`
      default:
        return baseUrl
    }
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance, decimals = 18) => {
    if (!balance) return '0'
    try {
      return ethers.formatUnits(balance, decimals)
    } catch {
      return balance.toString()
    }
  }

  const parseBalance = (amount, decimals = 18) => {
    try {
      return ethers.parseUnits(amount.toString(), decimals)
    } catch {
      return amount
    }
  }

  const value = {
    // State
    account,
    provider,
    signer,
    network,
    isConnected,
    isLoading,
    contracts,
    
    // Methods
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getContract,
    getNetworkName,
    getExplorerUrl,
    formatAddress,
    formatBalance,
    parseBalance,
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}
