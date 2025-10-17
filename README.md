# CommitChain

A decentralized commitment platform built on the Avalanche network. Users can form groups, stake AVAX, and commit to verifiable goals with automated reward distribution.

## Features

- **Core Smart Contracts**: Staking, verification, and distribution on Avalanche Fuji Testnet
- **Group Formation**: Public/private groups with multi-sig governance
- **Goal Tracking**: Automated verification via Chainlink oracles and manual proof submission
- **Peer Verification**: On-chain voting system for proof validation
- **Reward Distribution**: Proportional AVAX distribution with penalty mechanisms
- **Gamification**: NFT achievements and XP system
- **Social Features**: Wallet-based chat and social sharing
- **Tokenomics**: COMMIT token with governance and DeFi integration

## Tech Stack

- **Backend**: Solidity smart contracts on Avalanche
- **Frontend**: React.js with Web3.js/Ethers.js
- **Oracles**: Chainlink for external data verification
- **Storage**: IPFS for proof storage
- **DeFi**: Aave/Benqi integration for yield farming

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Avalanche wallet (Core or MetaMask)
- Fuji Testnet AVAX

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start development servers:
   ```bash
   npm run dev:test
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Avalanche Network Configuration
AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc

# Chainlink Oracle Configuration
CHAINLINK_FUJI_VRF_COORDINATOR=0x2eD832Ba664535e5886b75D64C46EB9a228C2610
CHAINLINK_FUJI_LINK_TOKEN=0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846

# IPFS Configuration
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Private Keys (for deployment - use testnet keys only)
PRIVATE_KEY=your_private_key_here

# Frontend Configuration
VITE_AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
VITE_AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc
VITE_CHAIN_ID=43113
VITE_NETWORK_NAME=Fuji Testnet
```

## Project Structure

```
avalanche-commitment-platform/
├── contracts/                 # Solidity smart contracts
│   ├── contracts/            # Contract source files
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Contract tests
│   └── hardhat.config.js     # Hardhat configuration
├── frontend/                 # React frontend application
│   ├── src/                  # Source code
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
├── docs/                     # Documentation
└── README.md                 # This file
```

## Smart Contracts

### Core Contracts

- **CommitmentPot.sol**: Main contract for staking and distribution
- **VerificationVoter.sol**: Peer voting mechanism for proof verification
- **MilestoneChecker.sol**: Partial reward distribution at milestones
- **CommitToken.sol**: ERC20 governance token
- **AchievementNFT.sol**: ERC721 for goal completion achievements

### Deployment

Deploy to Fuji Testnet:
```bash
npm run deploy:fuji
```

Deploy to Mainnet:
```bash
npm run deploy:mainnet
```

## Frontend Development

The frontend is built with React and includes:

- Wallet connection (Core, MetaMask)
- Group creation and management
- Goal tracking and proof submission
- Voting interface for verification
- Reward distribution dashboard
- NFT gallery for achievements

## Testing

Run contract tests:
```bash
npm run test:contracts
```

Run frontend tests:
```bash
npm run test:frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Discord: [Avalanche Discord](https://discord.gg/avalancheavax)
- Documentation: [Avalanche Docs](https://docs.avax.network/)
- Issues: GitHub Issues

## Roadmap

- [x] Project setup and structure
- [ ] Core smart contracts
- [ ] Frontend implementation
- [ ] Oracle integration
- [ ] Testing and deployment
- [ ] Mainnet launch
- [ ] Community features
- [ ] Mobile app

