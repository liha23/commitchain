# 🚀 CommitChain Frontend - Quick Start Guide

## Setup & Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)

### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## Demo Features (No Backend Required!)

### ✨ Fully Functional Frontend
- 🎨 **Black & Red Theme** - Modern dark mode design
- 👛 **Fake Wallet Connection** - Demo without MetaMask
- 📊 **Complete Dashboard** - Personal stats & overview
- 🎯 **6 Mock Commitment Groups** - Browse and explore tasks
- 🏆 **8 Achievements** - NFT achievement system
- 🥇 **Leaderboard** - Global user rankings
- 🔍 **Search & Filter** - Find groups by category/status
- 📱 **Fully Responsive** - Works on all devices

## Quick Test Drive

### Step 1: Connect Demo Wallet
1. Click **"Connect Wallet"** button (top right)
2. See a random demo account connect (no MetaMask needed!)
3. Success notification appears

### Step 2: Explore Groups
1. Click **"Groups"** in navigation
2. See 6 demo commitment groups:
   - **LeetCode Masters** - 12/20 members, 1.0 AVAX stake
   - **Fitness Warriors** - 8/15 members, 0.5 AVAX stake
   - **Study Squad** - 15/20 members, 2.0 AVAX stake
   - **Crypto Traders** (Private) - 10/12 members, 5.0 AVAX stake
   - **Language Learners** - 12/25 members, 0.75 AVAX stake
   - **Writing Bootcamp** (Private) - 12/15 members, 1.5 AVAX stake

3. **Search groups** - Try typing "react" or "fitness"
4. **Filter by status** - Active or Completed
5. **View details** - Click "View Details" on any group

### Step 3: Check Dashboard
1. Click **"Dashboard"** (after connecting wallet)
2. View personal statistics:
   - **Active Groups**: 3
   - **Completed Goals**: 18
   - **Total Rewards**: 8.5 AVAX
   - **Achievements**: 5 unlocked
3. See recent group activities
4. Check upcoming deadlines

### Step 4: View Achievements
1. Click **"Achievements"** in navigation
2. See 8 achievement badges:
   - Common: First Commitment
   - Uncommon: Goal Crusher, Week Warrior
   - Rare: Master Commitment, Community Helper
   - Epic: High Roller, NFT Minter
   - Legendary: Legendary Streaker
3. View locked and unlocked achievements
4. See progress on in-progress achievements

### Step 5: Browse Leaderboard
1. Click **"Leaderboard"** in navigation
2. See global rankings of top users:
   - Rank 1: Charlie Student (2500 points)
   - Rank 2: Monica Writer (2300 points)
   - Rank 3: Alice Developer (2100 points)
   - ... and more
3. View each user's stats and achievements

## Features Showcase

### 💰 Prominent Task Display
Each group card prominently shows:
```
┌─────────────────────────────────┐
│  🏆              👥             │
│  1.0 AVAX       12/20          │
│  Stake Required  Participants   │
└─────────────────────────────────┘
```

### 🎨 Black & Red Theme
- Professional dark background
- Bold red accents for CTAs
- Red progress bars
- Red icons for important stats
- High contrast for readability

### 🔐 Mock Data
All data is completely fake:
- Demo user accounts
- Realistic group information
- Fake milestone data
- Mock achievement NFTs
- Sample activity history

### 📊 Real Functionality
- Search and filter groups
- Sort by various criteria
- View user profiles
- Check personal statistics
- Browse achievements
- View leaderboard rankings

## Keyboard Shortcuts

- **Cmd/Ctrl + K** - Search (if implemented)
- **Esc** - Close dropdowns/modals
- **Tab** - Navigate between elements

## Theming

### Colors Used
- **Background**: Black (#111827)
- **Cards**: Dark Gray (#1f2937)
- **Primary**: Red (#dc2626)
- **Text**: White (#f3f4f6)
- **Borders**: Gray (#374151)

### Customize Theme
Edit `frontend/tailwind.config.js` to change colors:
```javascript
avalanche: {
  50: '#fef2f2',
  600: '#dc2626',  // Primary red
  700: '#b91c1c',  // Darker red
}
```

## Useful npm Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run tests (if configured)
npm run test
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Groups.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Achievements.jsx
│   │   ├── Leaderboard.jsx
│   │   └── ...
│   ├── components/      # Reusable components
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── ui/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorBoundary.jsx
│   ├── contexts/        # React contexts
│   │   └── Web3Context.jsx
│   ├── services/        # Services & utilities
│   │   └── mockData.js  # All mock data here!
│   ├── App.jsx          # Main app component
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## Mock Data Location

All demo data is in: `src/services/mockData.js`

To modify mock data:
1. Open `src/services/mockData.js`
2. Edit `MOCK_GROUPS`, `MOCK_ACHIEVEMENTS`, etc.
3. Changes take effect on save (with hot reload)

Example - Add a new group:
```javascript
export const MOCK_GROUPS = [
  // ... existing groups
  {
    id: 7,
    name: 'My New Group',
    description: 'New group description',
    stakeAmount: 1.0,
    // ... other properties
  }
]
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Troubleshooting

### Issue: Blank page after starting dev server
**Solution**: 
- Check browser console for errors
- Clear browser cache (Cmd/Ctrl + Shift + Delete)
- Restart dev server

### Issue: Wallet connection button not working
**Solution**:
- Verify Web3Context is wrapping App component
- Check browser console for errors
- Try disabling browser extensions

### Issue: Mock data not showing
**Solution**:
- Verify mockData.js is in correct location
- Check import statements
- Clear browser cache and reload

### Issue: Styling looks wrong
**Solution**:
- Rebuild Tailwind: `npm run dev` (automatic)
- Check that tailwind.config.js is correct
- Verify CSS is loaded in DevTools

## Next Steps

1. **Explore the code** - Understand the component structure
2. **Try modifying data** - Edit mockData.js to customize
3. **Play with styling** - Adjust tailwind.config.js
4. **Test responsiveness** - Resize browser or use DevTools
5. **Check mobile** - Use phone or mobile emulator

## Documentation Files

- 📖 **DESIGN_GUIDE.md** - Complete design system
- 📊 **MOCK_DATA_GUIDE.md** - Mock data structure & usage
- 🎨 **THEME_CHANGES.md** - Detailed theme changes
- 🚀 **TRANSFORMATION_SUMMARY.md** - Summary of all changes

## Ready for Backend?

This frontend is **100% ready** for real backend integration:

1. API calls will replace mock data loading
2. Real wallet connection replaces fake connection
3. Smart contract calls replace demo interactions
4. No major refactoring needed!

## Support

For help:
1. Check the documentation files above
2. Review the code comments in components
3. Check browser console for errors
4. Look at similar implementations in other pages

---

**Enjoy exploring CommitChain! 🎉**
