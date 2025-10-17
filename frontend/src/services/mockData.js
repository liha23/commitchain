// Mock Data Service - For frontend demo/showcase
// All data is fake and for demonstration purposes only

export const MOCK_GROUPS = [
  {
    id: 1,
    name: 'LeetCode Masters',
    description: 'Complete 100 LeetCode problems in 30 days. Perfect for software engineers preparing for interviews.',
    creator: '0x1234...5678',
    creatorName: 'Alice Developer',
    stakeAmount: 1.0,
    totalStaked: 12.0,
    deadline: '2024-02-15',
    isPrivate: false,
    memberCount: 12,
    maxMembers: 20,
    category: 'coding',
    tags: ['programming', 'algorithms', 'interviews'],
    progress: 75,
    status: 'active',
    createdAt: '2024-01-15',
    members: [
      { name: 'Alice Developer', avatar: 'AD', progress: 95 },
      { name: 'Bob Coder', avatar: 'BC', progress: 85 },
      { name: 'Charlie Dev', avatar: 'CD', progress: 70 },
    ],
    milestones: [
      { id: 1, title: 'First 25 problems', target: '2024-01-22', progress: 100 },
      { id: 2, title: 'Next 25 problems', target: '2024-01-30', progress: 80 },
      { id: 3, title: 'Final 50 problems', target: '2024-02-15', progress: 60 },
    ]
  },
  {
    id: 2,
    name: 'Fitness Warriors',
    description: '30-day fitness challenge with daily workouts and nutrition tracking.',
    creator: '0x2345...6789',
    creatorName: 'Bob Fitness',
    stakeAmount: 0.5,
    totalStaked: 4.0,
    deadline: '2024-02-20',
    isPrivate: false,
    memberCount: 8,
    maxMembers: 15,
    category: 'fitness',
    tags: ['workout', 'health', 'nutrition'],
    progress: 60,
    status: 'active',
    createdAt: '2024-01-20',
    members: [
      { name: 'Bob Fitness', avatar: 'BF', progress: 100 },
      { name: 'Diana Sport', avatar: 'DS', progress: 75 },
      { name: 'Eve Healthy', avatar: 'EH', progress: 55 },
    ],
    milestones: [
      { id: 1, title: 'First week complete', target: '2024-01-27', progress: 100 },
      { id: 2, title: 'Two weeks complete', target: '2024-02-03', progress: 50 },
    ]
  },
  {
    id: 3,
    name: 'Study Squad',
    description: 'Complete the React Developer course on Udemy within 6 weeks.',
    creator: '0x3456...7890',
    creatorName: 'Charlie Student',
    stakeAmount: 2.0,
    totalStaked: 30.0,
    deadline: '2024-01-30',
    isPrivate: false,
    memberCount: 15,
    maxMembers: 20,
    category: 'education',
    tags: ['react', 'javascript', 'web-development'],
    progress: 100,
    status: 'completed',
    createdAt: '2024-01-01',
    members: [
      { name: 'Charlie Student', avatar: 'CS', progress: 100 },
      { name: 'Frank Learn', avatar: 'FL', progress: 100 },
      { name: 'Grace Tech', avatar: 'GT', progress: 100 },
    ],
    milestones: [
      { id: 1, title: 'Basics & Setup', target: '2024-01-10', progress: 100 },
      { id: 2, title: 'Components & Props', target: '2024-01-17', progress: 100 },
      { id: 3, title: 'State & Hooks', target: '2024-01-24', progress: 100 },
      { id: 4, title: 'Final Project', target: '2024-01-30', progress: 100 },
    ]
  },
  {
    id: 4,
    name: 'Crypto Traders',
    description: 'Learn and practice cryptocurrency trading strategies for 2 months.',
    creator: '0x4567...8901',
    creatorName: 'Eve Trader',
    stakeAmount: 5.0,
    totalStaked: 50.0,
    deadline: '2024-03-15',
    isPrivate: true,
    memberCount: 10,
    maxMembers: 12,
    category: 'finance',
    tags: ['crypto', 'trading', 'defi'],
    progress: 30,
    status: 'active',
    createdAt: '2024-01-10',
    members: [
      { name: 'Eve Trader', avatar: 'ET', progress: 45 },
      { name: 'Henry Finance', avatar: 'HF', progress: 30 },
      { name: 'Iris Invest', avatar: 'II', progress: 25 },
    ],
    milestones: [
      { id: 1, title: 'Trading 101', target: '2024-01-31', progress: 70 },
      { id: 2, title: 'Technical Analysis', target: '2024-02-14', progress: 20 },
    ]
  },
  {
    id: 5,
    name: 'Language Learners - Spanish',
    description: 'Master Spanish language in 90 days with daily lessons and conversation practice.',
    creator: '0x5678...9012',
    creatorName: 'Jack Languages',
    stakeAmount: 0.75,
    totalStaked: 9.0,
    deadline: '2024-04-15',
    isPrivate: false,
    memberCount: 12,
    maxMembers: 25,
    category: 'education',
    tags: ['spanish', 'language', 'learning'],
    progress: 45,
    status: 'active',
    createdAt: '2024-01-05',
    members: [
      { name: 'Jack Languages', avatar: 'JL', progress: 60 },
      { name: 'Karen Learn', avatar: 'KL', progress: 45 },
      { name: 'Liam Spanish', avatar: 'LS', progress: 40 },
    ],
    milestones: [
      { id: 1, title: 'Basics Week 1-2', target: '2024-01-19', progress: 100 },
      { id: 2, title: 'Conversational Week 3-4', target: '2024-02-02', progress: 50 },
    ]
  },
  {
    id: 6,
    name: 'Writing Bootcamp',
    description: 'Write and publish a short book or collection of stories in 60 days.',
    creator: '0x6789...0123',
    creatorName: 'Monica Writer',
    stakeAmount: 1.5,
    totalStaked: 18.0,
    deadline: '2024-03-20',
    isPrivate: true,
    memberCount: 12,
    maxMembers: 15,
    category: 'creative',
    tags: ['writing', 'books', 'creative'],
    progress: 85,
    status: 'active',
    createdAt: '2024-01-02',
    members: [
      { name: 'Monica Writer', avatar: 'MW', progress: 95 },
      { name: 'Noah Author', avatar: 'NA', progress: 85 },
      { name: 'Olivia Scribe', avatar: 'OS', progress: 75 },
    ],
    milestones: [
      { id: 1, title: 'Outline & Brainstorm', target: '2024-01-16', progress: 100 },
      { id: 2, title: 'First Draft', target: '2024-02-13', progress: 90 },
      { id: 3, title: 'Editing & Publishing', target: '2024-03-20', progress: 70 },
    ]
  },
]

export const MOCK_USER_PROFILE = {
  address: '0x1234567890123456789012345678901234567890',
  name: 'Alice Developer',
  avatar: 'AD',
  bio: 'Passionate coder and commitment enthusiast. Love learning new technologies and helping others achieve their goals.',
  email: 'alice@commitchain.dev',
  balance: 10.5,
  totalStaked: 25.0,
  reputation: 850,
  achievements: 12,
  completedGoals: 18,
  activeGroups: 3,
  joinedDate: '2023-06-15',
  skills: ['React', 'JavaScript', 'Solidity', 'Web3'],
  recentActivity: [
    { type: 'completed_goal', title: 'Finished JavaScript Fundamentals', date: '2024-01-10' },
    { type: 'joined_group', title: 'Joined LeetCode Masters', date: '2024-01-08' },
    { type: 'earned_achievement', title: 'First 100 Problems', date: '2024-01-05' },
    { type: 'staked', title: 'Staked 1.0 AVAX to Fitness Group', date: '2024-01-03' },
  ],
  statistics: {
    totalCommitments: 25,
    completedCommitments: 18,
    successRate: 72,
    totalAVAXStaked: 25.0,
    totalAVAXEarned: 8.5,
    currentStreak: 12,
  }
}

export const MOCK_LEADERBOARD = [
  {
    rank: 1,
    name: 'Charlie Student',
    avatar: 'CS',
    points: 2500,
    achievements: 18,
    completedGoals: 25,
    avaxEarned: 12.5,
  },
  {
    rank: 2,
    name: 'Monica Writer',
    avatar: 'MW',
    points: 2300,
    achievements: 16,
    completedGoals: 22,
    avaxEarned: 11.0,
  },
  {
    rank: 3,
    name: 'Alice Developer',
    avatar: 'AD',
    points: 2100,
    achievements: 12,
    completedGoals: 18,
    avaxEarned: 8.5,
  },
  {
    rank: 4,
    name: 'Bob Fitness',
    avatar: 'BF',
    points: 1900,
    achievements: 14,
    completedGoals: 16,
    avaxEarned: 7.2,
  },
  {
    rank: 5,
    name: 'Jack Languages',
    avatar: 'JL',
    points: 1800,
    achievements: 11,
    completedGoals: 14,
    avaxEarned: 6.8,
  },
  {
    rank: 6,
    name: 'Diana Sport',
    avatar: 'DS',
    points: 1650,
    achievements: 10,
    completedGoals: 12,
    avaxEarned: 5.5,
  },
  {
    rank: 7,
    name: 'Eve Trader',
    avatar: 'ET',
    points: 1500,
    achievements: 9,
    completedGoals: 11,
    avaxEarned: 5.0,
  },
  {
    rank: 8,
    name: 'Frank Learn',
    avatar: 'FL',
    points: 1350,
    achievements: 8,
    completedGoals: 10,
    avaxEarned: 4.2,
  },
]

export const MOCK_ACHIEVEMENTS = [
  {
    id: 1,
    name: 'First Commitment',
    description: 'Join your first commitment group',
    icon: '🎯',
    rarity: 'common',
    unlockedAt: '2024-01-05',
    progress: 100,
  },
  {
    id: 2,
    name: 'Goal Crusher',
    description: 'Complete 5 commitments',
    icon: '💪',
    rarity: 'uncommon',
    unlockedAt: '2024-01-20',
    progress: 100,
  },
  {
    id: 3,
    name: 'Week Warrior',
    description: 'Maintain a 7-day activity streak',
    icon: '🔥',
    rarity: 'uncommon',
    unlockedAt: '2024-01-15',
    progress: 100,
  },
  {
    id: 4,
    name: 'Master Commitment',
    description: 'Complete 20 commitments',
    icon: '👑',
    rarity: 'rare',
    unlockedAt: '2024-02-01',
    progress: 100,
  },
  {
    id: 5,
    name: 'NFT Minter',
    description: 'Earn your first achievement NFT',
    icon: '🎨',
    rarity: 'rare',
    unlockedAt: '2024-02-05',
    progress: 100,
  },
  {
    id: 6,
    name: 'Community Helper',
    description: 'Vote on 10 commitment proofs',
    icon: '🤝',
    rarity: 'uncommon',
    progress: 65,
  },
  {
    id: 7,
    name: 'High Roller',
    description: 'Stake 100 AVAX in total',
    icon: '💰',
    rarity: 'epic',
    progress: 25,
  },
  {
    id: 8,
    name: 'Legendary Streaker',
    description: 'Maintain a 90-day activity streak',
    icon: '⭐',
    rarity: 'legendary',
    progress: 12,
  },
]

export const MOCK_DASHBOARD_STATS = {
  activeGroups: 3,
  completedGoals: 18,
  totalRewards: 8.5,
  achievements: 5,
  totalStaked: 25.0,
  avaxEarned: 8.5,
  reputation: 850,
  currentStreak: 12,
}

export const MOCK_RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'goal_completed',
    title: 'Completed milestone in LeetCode Masters',
    description: 'Solved 25 problems successfully',
    timestamp: '2 hours ago',
    icon: '✅',
  },
  {
    id: 2,
    type: 'group_joined',
    title: 'Joined Fitness Warriors',
    description: 'Staked 0.5 AVAX',
    timestamp: '1 day ago',
    icon: '🤝',
  },
  {
    id: 3,
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked: Week Warrior',
    description: '7-day activity streak',
    timestamp: '2 days ago',
    icon: '🔥',
  },
  {
    id: 4,
    type: 'reward_claimed',
    title: 'Claimed 2.5 AVAX rewards',
    description: 'From Study Squad completion',
    timestamp: '3 days ago',
    icon: '🎁',
  },
]

// Utility functions for mock data
export const getMockGroupById = (id) => {
  return MOCK_GROUPS.find(group => group.id === id)
}

export const getMockGroupsByCategory = (category) => {
  return MOCK_GROUPS.filter(group => group.category === category)
}

export const getMockGroupsByStatus = (status) => {
  return MOCK_GROUPS.filter(group => group.status === status)
}

export const searchMockGroups = (query) => {
  const lowerQuery = query.toLowerCase()
  return MOCK_GROUPS.filter(group =>
    group.name.toLowerCase().includes(lowerQuery) ||
    group.description.toLowerCase().includes(lowerQuery) ||
    group.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export const getTopMockAchievements = (limit = 6) => {
  return MOCK_ACHIEVEMENTS.slice(0, limit)
}

export const getMockUnlockedAchievements = () => {
  return MOCK_ACHIEVEMENTS.filter(a => a.unlockedAt)
}

export const getMockLeaderboardByRank = (limit = 10) => {
  return MOCK_LEADERBOARD.slice(0, limit)
}
