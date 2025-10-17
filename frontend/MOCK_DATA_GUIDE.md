# Mock Data & Demo Setup Guide

## Overview

CommitChain frontend is fully configured to run with mock/fake data for demonstration purposes. No backend deployment is required.

## Features

### 1. **Fake Wallet Connection** ✅
- Click "Connect Wallet" to connect with a demo account
- Three mock user profiles available:
  - Alice Developer (0x1234...5678)
  - Bob Fitness (0x0987...6543)
  - Charlie Student (0xabcd...efab)
- Randomly selected on each connection
- Session persisted in localStorage
- "Disconnect" button removes the demo connection

### 2. **Mock Data Coverage** ✅
- **6 Demo Groups** with realistic data:
  - LeetCode Masters (Coding)
  - Fitness Warriors (Fitness)
  - Study Squad (Education)
  - Crypto Traders (Finance)
  - Language Learners - Spanish (Education)
  - Writing Bootcamp (Creative)
  
- **8 Achievement NFTs** with rarity levels (common to legendary)
- **8 Leaderboard Entries** with points and statistics
- **Dashboard Stats** and quick metrics
- **Recent Activity Feed** with mock events

### 3. **Responsive Pages** ✅
All pages work with mock data:
- ✅ Home - Hero section with features
- ✅ Groups - Browse, search, filter mock groups
- ✅ Dashboard - Personal stats and group overview
- ✅ Achievements - View unlocked NFT achievements
- ✅ Leaderboard - Global user rankings
- ✅ Profile - User profile (ready for implementation)
- ✅ Settings - Settings page (ready for implementation)

## Mock Data Structure

### Groups (`MOCK_GROUPS`)
```javascript
{
  id: 1,
  name: 'Group Name',
  description: 'Description',
  creator: '0x...',
  creatorName: 'Name',
  stakeAmount: 1.0,           // Individual stake in AVAX
  totalStaked: 12.0,          // Total pool
  deadline: '2024-02-15',
  isPrivate: false,
  memberCount: 12,
  maxMembers: 20,
  category: 'coding',
  tags: ['tag1', 'tag2'],
  progress: 75,               // 0-100%
  status: 'active' | 'completed',
  createdAt: '2024-01-15',
  members: [...],             // Array of member objects
  milestones: [...]           // Array of milestone objects
}
```

### User Profile (`MOCK_USER_PROFILE`)
```javascript
{
  address: '0x...',
  name: 'User Name',
  avatar: 'AB',
  bio: 'Bio text',
  email: 'email@example.com',
  balance: 10.5,              // AVAX balance
  totalStaked: 25.0,
  reputation: 850,
  achievements: 12,
  completedGoals: 18,
  activeGroups: 3,
  joinedDate: '2023-06-15',
  skills: ['React', 'Web3'],
  recentActivity: [...],
  statistics: {...}
}
```

### Achievements (`MOCK_ACHIEVEMENTS`)
```javascript
{
  id: 1,
  name: 'Achievement Name',
  description: 'Description',
  icon: '🎯',
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
  unlockedAt: '2024-01-05',   // null if not unlocked
  progress: 100               // 0-100% (for locked achievements)
}
```

### Leaderboard (`MOCK_LEADERBOARD`)
```javascript
{
  rank: 1,
  name: 'User Name',
  avatar: 'AB',
  points: 2500,
  achievements: 18,
  completedGoals: 25,
  avaxEarned: 12.5
}
```

### Dashboard Stats (`MOCK_DASHBOARD_STATS`)
```javascript
{
  activeGroups: 3,
  completedGoals: 18,
  totalRewards: 8.5,
  achievements: 5,
  totalStaked: 25.0,
  avaxEarned: 8.5,
  reputation: 850,
  currentStreak: 12
}
```

## Web3Context Changes

The `Web3Context.jsx` has been updated to use mock wallet connection:

### Key Changes:
```javascript
// Fake wallet connection - no real blockchain interaction
connectWallet() {
  // Simulates 1.5s network delay
  // Randomly selects from MOCK_USERS
  // Stores connection in localStorage
  // Returns success/failure toast
}

// Disconnect works normally
disconnectWallet() {
  // Clears localStorage
  // Resets all state
}

// All helper functions work with mock data
formatAddress()     // Formats wallet address
getNetworkName()    // Returns "Avalanche Fuji Testnet"
getExplorerUrl()    // Generates mock explorer URLs
```

## Using Mock Data in Components

### Import mock data:
```javascript
import { 
  MOCK_GROUPS,
  MOCK_LEADERBOARD,
  MOCK_ACHIEVEMENTS,
  searchMockGroups,
  getMockGroupById
} from '../services/mockData'
```

### In components:
```javascript
const [groups, setGroups] = useState([])

useEffect(() => {
  // Simulate API call
  const timer = setTimeout(() => {
    setGroups(MOCK_GROUPS)
  }, 500)
  
  return () => clearTimeout(timer)
}, [])
```

### Search/Filter utilities:
```javascript
// Search groups by name, description, or tags
const results = searchMockGroups('leetcode')

// Get group by ID
const group = getMockGroupById(1)

// Get groups by category
const coding = getMockGroupsByCategory('coding')

// Get groups by status
const active = getMockGroupsByStatus('active')

// Get top achievements
const achievements = getTopMockAchievements(6)

// Get unlocked achievements
const unlocked = getMockUnlockedAchievements()
```

## Simulating Network Delays

All pages simulate realistic network delays:
```javascript
const loadData = async () => {
  setIsLoading(true)
  try {
    // Simulate API call delay (500-1000ms)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Load mock data
    setData(MOCK_DATA)
  } finally {
    setIsLoading(false)
  }
}
```

## Testing Scenarios

### Scenario 1: First Time User
1. Click "Connect Wallet"
2. See demo account connected
3. Navigate to Groups - view all available tasks
4. Check Dashboard for personal stats

### Scenario 2: Explore Features
1. Search/filter groups by category
2. View group details and participant info
3. Check Achievements page
4. View Leaderboard rankings

### Scenario 3: User Profile
1. Connect wallet
2. Navigate to Profile
3. View personal stats and achievements
4. See recent activity feed

## Environment Variables

For demo purposes, no environment variables are required. If backend is added later:

```env
# Real Backend (commented out for demo)
# VITE_API_URL=https://api.commitchain.dev
# VITE_COMMITMENT_POT_ADDRESS=0x...
# VITE_VERIFICATION_VOTER_ADDRESS=0x...
```

## Performance Considerations

- All mock data loads instantly (with simulated delays for realism)
- No network requests to real servers
- localStorage persists user "connection" across page refreshes
- Smooth animations and transitions maintained
- Mobile responsive design fully functional

## Transitioning to Real Backend

When backend is ready:

1. **Keep mockData.js** as fallback for demo mode
2. **Add API service layer**:
   ```javascript
   // src/services/api.js
   export const fetchGroups = async () => {
     const response = await fetch(`${API_URL}/groups`)
     return response.json()
   }
   ```

3. **Modify components to use real API**:
   ```javascript
   const loadGroups = async () => {
     try {
       const data = await fetchGroups()
       setGroups(data)
     } catch (error) {
       // Fallback to mock data
       setGroups(MOCK_GROUPS)
     }
   }
   ```

4. **Update Web3Context** for real wallet connection when contracts deployed

## Current Limitations (Demo Only)

- ❌ No actual blockchain transactions
- ❌ No real AVAX transfers
- ❌ No NFT minting
- ❌ No data persistence (except localStorage)
- ❌ No user authentication
- ❌ No proof uploads or verification
- ❌ No smart contract interactions

## Future Enhancements

When backend/contracts are deployed:
- [ ] Real wallet connection via MetaMask/Core
- [ ] Solidity contract integration
- [ ] Real database backend
- [ ] IPFS file uploads
- [ ] NFT minting on achievement unlock
- [ ] Real AVAX staking
- [ ] Chainlink oracle integration
- [ ] Multi-sig governance

## Troubleshooting

### Wallet connection not working
- Check browser console for errors
- Verify localStorage is enabled
- Try disconnecting and reconnecting

### Mock data not displaying
- Ensure mockData.js is imported correctly
- Check useWeb3() hook is within Web3Provider
- Verify isLoading state is managed

### Slow performance
- Increase simulated delay in components if needed
- Check browser DevTools for performance issues
- Verify no infinite loops in useEffect

## Support

For issues or questions about the mock setup:
1. Check this documentation
2. Review component implementation examples
3. Check browser console for error messages
4. Verify all imports are correct
