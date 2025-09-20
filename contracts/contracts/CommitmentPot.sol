// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Counters is deprecated in OpenZeppelin v5, using uint256 instead
import "./VerificationVoter.sol";
import "./MilestoneChecker.sol";

/**
 * @title CommitmentPot
 * @dev Main contract for managing commitment groups, staking, and reward distribution
 * @notice This contract handles AVAX staking, group management, and automated reward distribution
 */
contract CommitmentPot is ReentrancyGuard, Pausable, Ownable {
    // Events
    event GroupCreated(uint256 indexed groupId, address indexed creator, string name, uint256 stakeAmount);
    event MemberJoined(uint256 indexed groupId, address indexed member, uint256 stakeAmount);
    event GoalSet(uint256 indexed groupId, address indexed member, string goal, uint256 deadline);
    event ProofSubmitted(uint256 indexed groupId, address indexed member, string proofHash);
    event VerificationCompleted(uint256 indexed groupId, address indexed member, bool approved);
    event RewardsDistributed(uint256 indexed groupId, uint256 totalRewards, uint256 completers);
    event MilestoneReached(uint256 indexed groupId, address indexed member, uint256 milestone, uint256 reward);

    // Structs
    struct Group {
        uint256 id;
        string name;
        string description;
        address creator;
        uint256 stakeAmount;
        uint256 totalStaked;
        uint256 deadline;
        bool isPrivate;
        bool isActive;
        uint256 createdAt;
        mapping(address => bool) members;
        mapping(address => bool) hasStaked;
        mapping(address => string) goals;
        mapping(address => bool) hasCompleted;
        mapping(address => string) proofs;
        mapping(address => bool) hasClaimed;
        address[] memberList;
    }

    struct Milestone {
        uint256 percentage;
        uint256 timestamp;
        bool isReached;
    }

    // State variables
    uint256 private _groupIdCounter;
    mapping(uint256 => Group) public groups;
    mapping(uint256 => Milestone[]) public groupMilestones;
    mapping(address => uint256[]) public userGroups;
    
    VerificationVoter public verificationVoter;
    MilestoneChecker public milestoneChecker;
    
    uint256 public platformFeePercentage = 200; // 2% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    address public feeRecipient;
    
    // Modifiers
    modifier onlyGroupMember(uint256 groupId) {
        require(groups[groupId].members[msg.sender], "Not a group member");
        _;
    }
    
    modifier onlyGroupCreator(uint256 groupId) {
        require(groups[groupId].creator == msg.sender, "Not group creator");
        _;
    }
    
    modifier groupExists(uint256 groupId) {
        require(groups[groupId].creator != address(0), "Group does not exist");
        _;
    }
    
    modifier groupActive(uint256 groupId) {
        require(groups[groupId].isActive, "Group is not active");
        _;
    }

    constructor(address _verificationVoter, address _milestoneChecker, address _feeRecipient) {
        verificationVoter = VerificationVoter(_verificationVoter);
        milestoneChecker = MilestoneChecker(_milestoneChecker);
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Create a new commitment group
     * @param name Group name
     * @param description Group description
     * @param stakeAmount Required AVAX stake amount
     * @param deadline Group deadline timestamp
     * @param isPrivate Whether the group is private
     * @param milestones Array of milestone percentages
     */
    function createGroup(
        string memory name,
        string memory description,
        uint256 stakeAmount,
        uint256 deadline,
        bool isPrivate,
        uint256[] memory milestones
    ) external payable whenNotPaused returns (uint256) {
        require(msg.value >= stakeAmount, "Insufficient stake amount");
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(stakeAmount > 0, "Stake amount must be greater than 0");
        
        _groupIdCounter++;
        uint256 groupId = _groupIdCounter;
        
        Group storage group = groups[groupId];
        group.id = groupId;
        group.name = name;
        group.description = description;
        group.creator = msg.sender;
        group.stakeAmount = stakeAmount;
        group.totalStaked = stakeAmount;
        group.deadline = deadline;
        group.isPrivate = isPrivate;
        group.isActive = true;
        group.createdAt = block.timestamp;
        group.members[msg.sender] = true;
        group.hasStaked[msg.sender] = true;
        group.memberList.push(msg.sender);
        
        // Set up milestones
        for (uint256 i = 0; i < milestones.length; i++) {
            require(milestones[i] <= BASIS_POINTS, "Invalid milestone percentage");
            groupMilestones[groupId].push(Milestone({
                percentage: milestones[i],
                timestamp: 0,
                isReached: false
            }));
        }
        
        userGroups[msg.sender].push(groupId);
        
        emit GroupCreated(groupId, msg.sender, name, stakeAmount);
        
        return groupId;
    }

    /**
     * @dev Join an existing group
     * @param groupId Group ID to join
     * @param goal Personal goal for this commitment
     */
    function joinGroup(uint256 groupId, string memory goal) 
        external 
        payable 
        groupExists(groupId) 
        groupActive(groupId) 
        whenNotPaused 
    {
        Group storage group = groups[groupId];
        require(!group.members[msg.sender], "Already a member");
        require(msg.value >= group.stakeAmount, "Insufficient stake amount");
        require(block.timestamp < group.deadline, "Group deadline has passed");
        
        group.members[msg.sender] = true;
        group.hasStaked[msg.sender] = true;
        group.goals[msg.sender] = goal;
        group.totalStaked += group.stakeAmount;
        group.memberList.push(msg.sender);
        
        userGroups[msg.sender].push(groupId);
        
        emit MemberJoined(groupId, msg.sender, group.stakeAmount);
        emit GoalSet(groupId, msg.sender, goal, group.deadline);
    }

    /**
     * @dev Submit proof of goal completion
     * @param groupId Group ID
     * @param proofHash IPFS hash of the proof
     */
    function submitProof(uint256 groupId, string memory proofHash) 
        external 
        onlyGroupMember(groupId) 
        groupActive(groupId) 
        whenNotPaused 
    {
        Group storage group = groups[groupId];
        require(block.timestamp <= group.deadline, "Deadline has passed");
        require(bytes(proofHash).length > 0, "Proof hash cannot be empty");
        
        group.proofs[msg.sender] = proofHash;
        
        emit ProofSubmitted(groupId, msg.sender, proofHash);
        
        // Start verification process
        verificationVoter.startVerification(groupId, msg.sender, proofHash);
    }

    /**
     * @dev Complete verification and distribute rewards
     * @param groupId Group ID
     */
    function completeVerification(uint256 groupId) 
        external 
        groupExists(groupId) 
        whenNotPaused 
    {
        Group storage group = groups[groupId];
        require(block.timestamp > group.deadline, "Deadline not reached");
        
        address[] memory members = group.memberList;
        uint256 totalRewards = group.totalStaked;
        uint256 completers = 0;
        uint256 platformFee = (totalRewards * platformFeePercentage) / BASIS_POINTS;
        uint256 distributableRewards = totalRewards - platformFee;
        
        // Check completion status for each member
        for (uint256 i = 0; i < members.length; i++) {
            address member = members[i];
            bool isCompleted = verificationVoter.isVerified(groupId, member);
            
            if (isCompleted) {
                group.hasCompleted[member] = true;
                completers++;
            }
        }
        
        // Distribute rewards proportionally to completers
        if (completers > 0) {
            uint256 rewardPerCompleter = distributableRewards / completers;
            
            for (uint256 i = 0; i < members.length; i++) {
                address member = members[i];
                if (group.hasCompleted[member]) {
                    group.hasClaimed[member] = true;
                    payable(member).transfer(rewardPerCompleter);
                }
            }
        }
        
        // Transfer platform fee
        if (platformFee > 0) {
            payable(feeRecipient).transfer(platformFee);
        }
        
        group.isActive = false;
        
        emit RewardsDistributed(groupId, distributableRewards, completers);
    }

    /**
     * @dev Claim milestone rewards
     * @param groupId Group ID
     * @param milestoneIndex Milestone index
     */
    function claimMilestoneReward(uint256 groupId, uint256 milestoneIndex) 
        external 
        onlyGroupMember(groupId) 
        groupActive(groupId) 
        nonReentrant 
    {
        Group storage group = groups[groupId];
        require(milestoneIndex < groupMilestones[groupId].length, "Invalid milestone index");
        
        Milestone storage milestone = groupMilestones[groupId][milestoneIndex];
        require(!milestone.isReached, "Milestone already reached");
        
        bool canClaim = milestoneChecker.checkMilestone(groupId, msg.sender, milestoneIndex);
        require(canClaim, "Milestone not reached");
        
        uint256 rewardAmount = (group.stakeAmount * milestone.percentage) / BASIS_POINTS;
        
        milestone.isReached = true;
        milestone.timestamp = block.timestamp;
        
        payable(msg.sender).transfer(rewardAmount);
        
        emit MilestoneReached(groupId, msg.sender, milestoneIndex, rewardAmount);
    }

    /**
     * @dev Get group information
     * @param groupId Group ID
     */
    function getGroupInfo(uint256 groupId) 
        external 
        view 
        groupExists(groupId) 
        returns (
            string memory name,
            string memory description,
            address creator,
            uint256 stakeAmount,
            uint256 totalStaked,
            uint256 deadline,
            bool isPrivate,
            bool isActive,
            uint256 memberCount
        ) 
    {
        Group storage group = groups[groupId];
        return (
            group.name,
            group.description,
            group.creator,
            group.stakeAmount,
            group.totalStaked,
            group.deadline,
            group.isPrivate,
            group.isActive,
            group.memberList.length
        );
    }

    /**
     * @dev Get user's groups
     * @param user User address
     */
    function getUserGroups(address user) external view returns (uint256[] memory) {
        return userGroups[user];
    }

    /**
     * @dev Get group members
     * @param groupId Group ID
     */
    function getGroupMembers(uint256 groupId) 
        external 
        view 
        groupExists(groupId) 
        returns (address[] memory) 
    {
        return groups[groupId].memberList;
    }

    /**
     * @dev Check if user is group member
     * @param groupId Group ID
     * @param user User address
     */
    function isGroupMember(uint256 groupId, address user) 
        external 
        view 
        groupExists(groupId) 
        returns (bool) 
    {
        return groups[groupId].members[user];
    }

    /**
     * @dev Check if user has completed goal
     * @param groupId Group ID
     * @param user User address
     */
    function hasCompletedGoal(uint256 groupId, address user) 
        external 
        view 
        groupExists(groupId) 
        returns (bool) 
    {
        return groups[groupId].hasCompleted[user];
    }

    /**
     * @dev Get user's goal
     * @param groupId Group ID
     * @param user User address
     */
    function getUserGoal(uint256 groupId, address user) 
        external 
        view 
        groupExists(groupId) 
        returns (string memory) 
    {
        return groups[groupId].goals[user];
    }

    /**
     * @dev Get user's proof
     * @param groupId Group ID
     * @param user User address
     */
    function getUserProof(uint256 groupId, address user) 
        external 
        view 
        groupExists(groupId) 
        returns (string memory) 
    {
        return groups[groupId].proofs[user];
    }

    /**
     * @dev Update platform fee percentage (only owner)
     * @param newFeePercentage New fee percentage in basis points
     */
    function updatePlatformFee(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 1000, "Fee cannot exceed 10%");
        platformFeePercentage = newFeePercentage;
    }

    /**
     * @dev Update fee recipient (only owner)
     * @param newFeeRecipient New fee recipient address
     */
    function updateFeeRecipient(address newFeeRecipient) external onlyOwner {
        require(newFeeRecipient != address(0), "Invalid address");
        feeRecipient = newFeeRecipient;
    }

    /**
     * @dev Pause contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Receive function to accept AVAX
    receive() external payable {}
}


