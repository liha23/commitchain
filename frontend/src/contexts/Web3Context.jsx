import React, { createContext, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

const Web3Context = createContext()

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
  const [isLoading, setIsLoading] = useState(true)
  const [contracts, setContracts] = useState({})

  // Check if wallet is connected on mount
  useEffect(() => {
    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('disconnect', handleDisconnect)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
        window.ethereum.removeListener('disconnect', handleDisconnect)
      }
    }
  }, [])

  const checkConnection = async () => {
    try {
      if (!window.ethereum) {
        setIsLoading(false)
        return
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        await connectWallet()
      }
    } catch (error) {
      console.error('Error checking connection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask or Core wallet')
        return false
      }

      setIsLoading(true)

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const network = await provider.getNetwork()

      // Check if we're on the correct network
      const targetNetwork = import.meta.env.VITE_CHAIN_ID === '43114' ? 'mainnet' : 'fuji'
      if (network.chainId.toString() !== AVALANCHE_NETWORKS[targetNetwork].chainId) {
        await switchNetwork(targetNetwork)
      }

      setAccount(accounts[0])
      setProvider(provider)
      setSigner(signer)
      setNetwork(network)
      setIsConnected(true)

      // Load contracts
      await loadContracts(provider, signer, targetNetwork)

      toast.success('Wallet connected successfully!')
      return true
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error(error.message || 'Failed to connect wallet')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setNetwork(null)
    setIsConnected(false)
    setContracts({})
    toast.success('Wallet disconnected')
  }

  const switchNetwork = async (targetNetwork) => {
    try {
      const networkConfig = AVALANCHE_NETWORKS[targetNetwork]
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainId }],
      })
    } catch (error) {
      // If the network doesn't exist, add it
      if (error.code === 4902) {
        try {
          const networkConfig = AVALANCHE_NETWORKS[targetNetwork]
          
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
          })
        } catch (addError) {
          console.error('Error adding network:', addError)
          throw new Error('Failed to add Avalanche network')
        }
      } else {
        throw error
      }
    }
  }

  const loadContracts = async (provider, signer, network) => {
    try {
      const contractAddresses = CONTRACT_ADDRESSES[network]
      
      // Import contract ABIs (these would be generated from the contracts)
      const contractABIs = await import('../contracts/abis')
      
      const contracts = {}
      
      // Load each contract
      for (const [name, address] of Object.entries(contractAddresses)) {
        if (address && contractABIs[name]) {
          contracts[name] = new ethers.Contract(address, contractABIs[name], signer)
        }
      }
      
      setContracts(contracts)
    } catch (error) {
      console.error('Error loading contracts:', error)
      toast.error('Failed to load smart contracts')
    }
  }

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAccount(accounts[0])
    }
  }

  const handleChainChanged = (chainId) => {
    window.location.reload()
  }

  const handleDisconnect = () => {
    disconnectWallet()
  }

  const getContract = (contractName) => {
    return contracts[contractName] || null
  }

  const getNetworkName = () => {
    if (!network) return 'Unknown'
    return network.chainId.toString() === '0xa86a' ? 'Avalanche Mainnet' : 'Avalanche Fuji'
  }

  const getExplorerUrl = (type, value) => {
    const baseUrl = network?.chainId.toString() === '0xa86a' 
      ? 'https://snowtrace.io' 
      : 'https://testnet.snowtrace.io'
    
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
    return ethers.formatUnits(balance, decimals)
  }

  const parseBalance = (amount, decimals = 18) => {
    return ethers.parseUnits(amount.toString(), decimals)
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
