// Contract ABIs - These would be generated from the compiled contracts
// For now, we'll create placeholder ABIs with the essential functions

export const CommitmentPotABI = [
  // Read functions
  "function getGroupInfo(uint256 groupId) external view returns (string memory name, string memory description, address creator, uint256 stakeAmount, uint256 totalStaked, uint256 deadline, bool isPrivate, bool isActive, uint256 memberCount)",
  "function getUserGroups(address user) external view returns (uint256[] memory)",
  "function getGroupMembers(uint256 groupId) external view returns (address[] memory)",
  "function isGroupMember(uint256 groupId, address user) external view returns (bool)",
  "function hasCompletedGoal(uint256 groupId, address user) external view returns (bool)",
  "function getUserGoal(uint256 groupId, address user) external view returns (string memory)",
  "function getUserProof(uint256 groupId, address user) external view returns (string memory)",
  
  // Write functions
  "function createGroup(string memory name, string memory description, uint256 stakeAmount, uint256 deadline, bool isPrivate, uint256[] memory milestones) external payable returns (uint256)",
  "function joinGroup(uint256 groupId, string memory goal) external payable",
  "function submitProof(uint256 groupId, string memory proofHash) external",
  "function completeVerification(uint256 groupId) external",
  "function claimMilestoneReward(uint256 groupId, uint256 milestoneIndex) external",
  
  // Events
  "event GroupCreated(uint256 indexed groupId, address indexed creator, string name, uint256 stakeAmount)",
  "event MemberJoined(uint256 indexed groupId, address indexed member, uint256 stakeAmount)",
  "event GoalSet(uint256 indexed groupId, address indexed member, string goal, uint256 deadline)",
  "event ProofSubmitted(uint256 indexed groupId, address indexed member, string proofHash)",
  "event VerificationCompleted(uint256 indexed groupId, address indexed member, bool approved)",
  "event RewardsDistributed(uint256 indexed groupId, uint256 totalRewards, uint256 completers)",
  "event MilestoneReached(uint256 indexed groupId, address indexed member, uint256 milestone, uint256 reward)"
]

export const VerificationVoterABI = [
  // Read functions
  "function getVerificationDetails(uint256 groupId, address member) external view returns (uint256 verificationId, string memory proofHash, uint256 votesFor, uint256 votesAgainst, uint256 totalVotes, bool isCompleted, bool isApproved, uint256 startTime, uint256 endTime)",
  "function getVerificationVoters(uint256 groupId, address member) external view returns (address[] memory voters)",
  "function getGroupDisputes(uint256 groupId) external view returns (tuple(uint256 groupId, address member, address disputer, string reason, uint256 timestamp, bool isResolved)[] memory disputes)",
  "function getVoteDetails(uint256 groupId, address member, address voter) external view returns (bool hasVoted, bool voteChoice)",
  "function isVerified(uint256 groupId, address member) external view returns (bool isVerified)",
  
  // Write functions
  "function startVerification(uint256 groupId, address member, string memory proofHash) external",
  "function castVote(uint256 groupId, address member, bool approved) external",
  "function completeVerification(uint256 verificationId) external",
  "function raiseDispute(uint256 groupId, address member, string memory reason) external",
  
  // Events
  "event VerificationStarted(uint256 indexed groupId, address indexed member, string proofHash)",
  "event VoteCast(uint256 indexed groupId, address indexed member, address indexed voter, bool approved)",
  "event VerificationCompleted(uint256 indexed groupId, address indexed member, bool approved, uint256 votesFor, uint256 votesAgainst)",
  "event DisputeRaised(uint256 indexed groupId, address indexed member, address indexed disputer, string reason)"
]

export const MilestoneCheckerABI = [
  // Read functions
  "function getMilestoneDetails(uint256 groupId, address member, uint256 milestoneIndex) external view returns (uint256 target, uint256 actual, bool isReached, uint256 reachedAt, uint8 milestoneType, string memory dataSource, string memory proofHash)",
  "function getUserMilestones(uint256 groupId, address member) external view returns (tuple(uint256 target, uint256 actual, bool isReached, uint256 reachedAt, uint8 milestoneType, string dataSource, string proofHash)[] memory milestones)",
  "function getMilestoneProgress(uint256 groupId, address member, uint256 milestoneIndex) external view returns (uint256 progress)",
  "function checkMilestone(uint256 groupId, address member, uint256 milestoneIndex) external view returns (bool isReached)",
  "function getOracleAddress(string memory dataSource) external view returns (address oracleAddress)",
  
  // Write functions
  "function setMilestone(uint256 groupId, address member, uint256 milestoneIndex, uint256 target, uint8 milestoneType, string memory dataSource) external",
  "function submitMilestoneProof(uint256 groupId, address member, uint256 milestoneIndex, string memory proofHash) external",
  "function updateMilestoneProgress(uint256 groupId, address member, uint256 milestoneIndex, uint256 actual) external",
  "function requestOracleData(uint256 groupId, address member, uint256 milestoneIndex) external",
  "function batchUpdateMilestones(uint256 groupId, address[] memory members, uint256 milestoneIndex, uint256[] memory actuals) external",
  
  // Events
  "event MilestoneSet(uint256 indexed groupId, address indexed member, uint256 milestoneIndex, uint256 target)",
  "event MilestoneReached(uint256 indexed groupId, address indexed member, uint256 milestoneIndex, uint256 actual)",
  "event OracleDataRequested(uint256 indexed groupId, address indexed member, uint256 milestoneIndex, string dataSource)"
]

export const CommitTokenABI = [
  // Standard ERC20 functions
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)",
  "function decimals() external view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  
  // Custom functions
  "function getStakingInfo(address user) external view returns (uint256 amount, uint256 startTime, uint256 duration, uint256 rewardRate, bool isActive, uint256 reward)",
  "function getYieldFarmingInfo(address user) external view returns (uint256 amount, uint256 startTime, uint256 apy, bool isActive, uint256 yield)",
  "function getFeeDiscount(address user) external view returns (uint256 discount)",
  "function calculateStakingReward(address user) external view returns (uint256 reward)",
  "function calculateYieldFarmingReward(address user) external view returns (uint256 yield)",
  
  // Write functions
  "function startStaking(uint256 amount, uint256 duration) external",
  "function endStaking() external",
  "function startYieldFarming(uint256 amount) external",
  "function endYieldFarming() external",
  "function setFeeDiscount(address user, uint256 discountPercentage) external",
  "function mintCompletionReward(address user, uint256 amount) external",
  
  // Events
  "event StakingStarted(address indexed user, uint256 amount, uint256 duration)",
  "event StakingEnded(address indexed user, uint256 amount, uint256 reward)",
  "event FeeDiscountUpdated(address indexed user, uint256 discountPercentage)",
  "event YieldFarmStarted(address indexed user, uint256 amount)",
  "event YieldFarmEnded(address indexed user, uint256 amount, uint256 yield)"
]

export const AchievementNFTABI = [
  // Standard ERC721 functions
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function approve(address to, uint256 tokenId) external",
  "function getApproved(uint256 tokenId) external view returns (address)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address owner, address operator) external view returns (bool)",
  "function transferFrom(address from, address to, uint256 tokenId) external",
  "function safeTransferFrom(address from, address to, uint256 tokenId) external",
  
  // Custom functions
  "function getAchievement(uint256 tokenId) external view returns (tuple(uint256 tokenId, address owner, string achievementType, uint256 groupId, uint256 completedAt, string proofHash, bool isRare, uint256 rarityLevel) memory achievement)",
  "function getUserAchievements(address user) external view returns (uint256[] memory tokenIds)",
  "function getGroupAchievements(uint256 groupId) external view returns (uint256[] memory tokenIds)",
  "function getAchievementsByType(string memory achievementType, uint256 offset, uint256 limit) external view returns (uint256[] memory tokenIds)",
  "function getAchievementsByRarity(uint256 rarityLevel, uint256 offset, uint256 limit) external view returns (uint256[] memory tokenIds)",
  "function getRarityName(uint256 rarityLevel) external pure returns (string memory rarityName)",
  "function totalSupply() external view returns (uint256)",
  "function maxSupply() external view returns (uint256)",
  
  // Write functions
  "function mintAchievement(address to, string memory achievementType, uint256 groupId, string memory proofHash, bool isRare) external returns (uint256)",
  "function mintAchievementWithRarity(address to, string memory achievementType, uint256 groupId, string memory proofHash, uint256 rarityLevel) external returns (uint256)",
  "function addAchievementType(string memory achievementType, string memory metadataURI) external",
  "function updateAchievementType(string memory achievementType, string memory metadataURI) external",
  
  // Events
  "event AchievementMinted(address indexed to, uint256 indexed tokenId, string achievementType, uint256 groupId)",
  "event AchievementTypeAdded(string achievementType, string metadataURI)",
  "event AchievementTypeUpdated(string achievementType, string metadataURI)"
]

export const OracleIntegrationABI = [
  // Read functions
  "function getOracleRequest(bytes32 requestId) external view returns (tuple(bytes32 requestId, uint256 groupId, address member, string dataSource, uint256 targetValue, uint256 actualValue, bool isCompleted, bool isSuccessful, uint256 timestamp) memory request)",
  "function isRequestCompleted(bytes32 requestId) external view returns (bool isCompleted)",
  "function isRequestSuccessful(bytes32 requestId) external view returns (bool isSuccessful)",
  "function getRequestResult(bytes32 requestId) external view returns (uint256 result)",
  "function getOracleAddress(string memory dataSource) external view returns (address oracleAddress)",
  
  // Write functions
  "function requestLeetCodeVerification(uint256 groupId, address member, string memory username, uint256 targetProblems) external returns (bytes32)",
  "function requestGitHubVerification(uint256 groupId, address member, string memory username, string memory repository, uint256 targetCommits) external returns (bytes32)",
  "function requestCustomVerification(uint256 groupId, address member, string memory dataSource, string memory apiEndpoint, uint256 targetValue, string memory dataPath) external returns (bytes32)",
  "function fulfillLeetCodeRequest(bytes32 requestId, uint256 result) external",
  "function fulfillGitHubRequest(bytes32 requestId, uint256 result) external",
  "function fulfillCustomRequest(bytes32 requestId, uint256 result) external",
  "function handleFailedRequest(bytes32 requestId, string memory reason) external",
  "function setDataSourceJob(string memory dataSource, string memory jobId, uint256 fee) external",
  "function addAuthorizedCaller(address caller) external",
  "function removeAuthorizedCaller(address caller) external",
  
  // Events
  "event OracleRequestCreated(bytes32 indexed requestId, uint256 indexed groupId, address indexed member, string dataSource)",
  "event OracleResponseReceived(bytes32 indexed requestId, uint256 indexed groupId, address indexed member, uint256 result)",
  "event OracleRequestFailed(bytes32 indexed requestId, uint256 indexed groupId, address indexed member, string reason)"
]

