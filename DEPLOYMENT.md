# Deployment Guide

This guide will help you deploy the Avalanche Commitment Platform to the Avalanche network.

## Prerequisites

1. **Node.js 18+** installed
2. **Avalanche wallet** (Core or MetaMask) with testnet AVAX
3. **Private key** for deployment (use a test wallet, never mainnet keys)
4. **Chainlink tokens** for oracle integration (on Fuji testnet)

## Environment Setup

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your configuration:
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

## Smart Contract Deployment

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install contract dependencies
cd contracts
npm install
```

### 2. Compile Contracts

```bash
cd contracts
npm run build
```

### 3. Run Tests

```bash
cd contracts
npm test
```

### 4. Deploy to Fuji Testnet

```bash
cd contracts
npm run deploy:fuji
```

This will:
- Deploy all smart contracts
- Set up contract relationships
- Configure oracle integrations
- Add achievement types
- Save deployment information

### 5. Verify Contracts (Optional)

```bash
cd contracts
npm run verify:fuji
```

### 6. Setup Contracts

```bash
cd contracts
npx hardhat run scripts/setup.js --network fuji
```

## Frontend Deployment

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

The deployment script automatically creates `frontend/.env.local` with contract addresses. If you need to update it manually:

```env
VITE_VERIFICATION_VOTER_ADDRESS=0x...
VITE_MILESTONE_CHECKER_ADDRESS=0x...
VITE_COMMIT_TOKEN_ADDRESS=0x...
VITE_ACHIEVEMENT_NFT_ADDRESS=0x...
VITE_ORACLE_INTEGRATION_ADDRESS=0x...
VITE_COMMITMENT_POT_ADDRESS=0x...
VITE_NETWORK_NAME=Fuji Testnet
VITE_CHAIN_ID=43113
```

### 3. Build Frontend

```bash
cd frontend
npm run build
```

### 4. Deploy Frontend

You can deploy to any static hosting service:

#### Vercel
```bash
cd frontend
npx vercel --prod
```

#### Netlify
```bash
cd frontend
npm run build
# Upload dist/ folder to Netlify
```

#### IPFS
```bash
cd frontend
npm run build
# Upload dist/ folder to IPFS
```

## Mainnet Deployment

### 1. Update Environment

Change the following in `.env`:
```env
AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc
VITE_CHAIN_ID=43114
VITE_NETWORK_NAME=Avalanche Mainnet
```

### 2. Deploy Contracts

```bash
cd contracts
npm run deploy:mainnet
```

### 3. Verify Contracts

```bash
cd contracts
npm run verify:mainnet
```

### 4. Update Frontend

Update `frontend/.env.local` with mainnet contract addresses and rebuild.

## Post-Deployment Checklist

- [ ] All contracts deployed successfully
- [ ] Contract verification completed
- [ ] Frontend deployed and accessible
- [ ] Wallet connection working
- [ ] Group creation functional
- [ ] Oracle integration configured
- [ ] IPFS integration working
- [ ] Achievement system operational

## Troubleshooting

### Common Issues

1. **Insufficient Funds**: Ensure your wallet has enough AVAX for gas fees
2. **Network Issues**: Check RPC endpoint connectivity
3. **Contract Verification**: Ensure constructor arguments match deployment
4. **Frontend Issues**: Verify contract addresses in environment variables

### Getting Help

- Check the [Avalanche Documentation](https://docs.avax.network/)
- Join the [Avalanche Discord](https://discord.gg/avalancheavax)
- Review contract logs for detailed error messages

## Security Considerations

- Never use mainnet private keys in development
- Always verify contracts on block explorers
- Test thoroughly on testnet before mainnet deployment
- Keep private keys secure and never commit them to version control
- Use hardware wallets for mainnet deployments

## Monitoring

After deployment, monitor:
- Contract interactions
- Gas usage
- Error rates
- User activity
- Oracle responses

Set up alerts for:
- High gas usage
- Failed transactions
- Oracle failures
- Unusual activity patterns

