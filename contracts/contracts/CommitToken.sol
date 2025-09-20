// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CommitToken
 * @dev ERC20 governance token for the Avalanche Commitment Platform
 * @notice This token provides governance rights, fee discounts, and staking rewards
 */
contract CommitToken is ERC20, ERC20Permit, ERC20Votes, Ownable, Pausable, ReentrancyGuard {
    
    // Events
    event StakingStarted(address indexed user, uint256 amount, uint256 duration);
    event StakingEnded(address indexed user, uint256 amount, uint256 reward);
    event FeeDiscountUpdated(address indexed user, uint256 discountPercentage);
    event YieldFarmStarted(address indexed user, uint256 amount);
    event YieldFarmEnded(address indexed user, uint256 amount, uint256 yield);

    // Structs
    struct StakingInfo {
        uint256 amount;
        uint256 startTime;
        uint256 duration;
        uint256 rewardRate;
        bool isActive;
    }

    struct YieldFarmInfo {
        uint256 amount;
        uint256 startTime;
        uint256 apy;
        bool isActive;
    }

    // State variables
    mapping(address => StakingInfo) public stakingInfo;
    mapping(address => YieldFarmInfo) public yieldFarmInfo;
    mapping(address => uint256) public feeDiscounts; // Discount percentage in basis points
    
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    uint256 public constant STAKING_REWARD_RATE = 1000; // 10% APY in basis points
    uint256 public constant YIELD_FARM_APY = 1500; // 15% APY in basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    address public commitmentPot;
    address public yieldFarmContract;
    bool public stakingEnabled = true;
    bool public yieldFarmingEnabled = true;

    // Modifiers
    modifier onlyCommitmentPot() {
        require(msg.sender == commitmentPot, "Only CommitmentPot can call this");
        _;
    }

    constructor() ERC20("Commit Token", "COMMIT") ERC20Permit("Commit Token") {
        // Mint initial supply to contract owner
        _mint(msg.sender, MAX_SUPPLY);
    }

    /**
     * @dev Set CommitmentPot contract address (only owner)
     * @param _commitmentPot CommitmentPot contract address
     */
    function setCommitmentPot(address _commitmentPot) external onlyOwner {
        require(_commitmentPot != address(0), "Invalid address");
        commitmentPot = _commitmentPot;
    }

    /**
     * @dev Set yield farm contract address (only owner)
     * @param _yieldFarmContract Yield farm contract address
     */
    function setYieldFarmContract(address _yieldFarmContract) external onlyOwner {
        require(_yieldFarmContract != address(0), "Invalid address");
        yieldFarmContract = _yieldFarmContract;
    }

    /**
     * @dev Start staking tokens
     * @param amount Amount to stake
     * @param duration Staking duration in seconds
     */
    function startStaking(uint256 amount, uint256 duration) external whenNotPaused nonReentrant {
        require(stakingEnabled, "Staking is disabled");
        require(amount > 0, "Amount must be greater than 0");
        require(duration >= 30 days, "Minimum staking duration is 30 days");
        require(duration <= 365 days, "Maximum staking duration is 365 days");
        require(!stakingInfo[msg.sender].isActive, "Already staking");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _transfer(msg.sender, address(this), amount);
        
        stakingInfo[msg.sender] = StakingInfo({
            amount: amount,
            startTime: block.timestamp,
            duration: duration,
            rewardRate: STAKING_REWARD_RATE,
            isActive: true
        });
        
        emit StakingStarted(msg.sender, amount, duration);
    }

    /**
     * @dev End staking and claim rewards
     */
    function endStaking() external nonReentrant {
        StakingInfo storage staking = stakingInfo[msg.sender];
        require(staking.isActive, "Not staking");
        require(block.timestamp >= staking.startTime + staking.duration, "Staking period not ended");
        
        uint256 stakedAmount = staking.amount;
        uint256 reward = calculateStakingReward(msg.sender);
        
        staking.isActive = false;
        
        // Transfer staked amount back
        _transfer(address(this), msg.sender, stakedAmount);
        
        // Mint reward tokens
        if (reward > 0) {
            _mint(msg.sender, reward);
        }
        
        emit StakingEnded(msg.sender, stakedAmount, reward);
    }

    /**
     * @dev Calculate staking reward for a user
     * @param user User address
     * @return reward Calculated reward amount
     */
    function calculateStakingReward(address user) public view returns (uint256 reward) {
        StakingInfo storage staking = stakingInfo[user];
        if (!staking.isActive) {
            return 0;
        }
        
        uint256 stakingDuration = block.timestamp - staking.startTime;
        uint256 annualReward = (staking.amount * staking.rewardRate) / BASIS_POINTS;
        reward = (annualReward * stakingDuration) / 365 days;
        
        return reward;
    }

    /**
     * @dev Start yield farming
     * @param amount Amount to farm
     */
    function startYieldFarming(uint256 amount) external whenNotPaused nonReentrant {
        require(yieldFarmingEnabled, "Yield farming is disabled");
        require(amount > 0, "Amount must be greater than 0");
        require(!yieldFarmInfo[msg.sender].isActive, "Already yield farming");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _transfer(msg.sender, address(this), amount);
        
        yieldFarmInfo[msg.sender] = YieldFarmInfo({
            amount: amount,
            startTime: block.timestamp,
            apy: YIELD_FARM_APY,
            isActive: true
        });
        
        emit YieldFarmStarted(msg.sender, amount);
    }

    /**
     * @dev End yield farming and claim yield
     */
    function endYieldFarming() external nonReentrant {
        YieldFarmInfo storage farming = yieldFarmInfo[msg.sender];
        require(farming.isActive, "Not yield farming");
        
        uint256 farmedAmount = farming.amount;
        uint256 yield = calculateYieldFarmingReward(msg.sender);
        
        farming.isActive = false;
        
        // Transfer farmed amount back
        _transfer(address(this), msg.sender, farmedAmount);
        
        // Mint yield tokens
        if (yield > 0) {
            _mint(msg.sender, yield);
        }
        
        emit YieldFarmEnded(msg.sender, farmedAmount, yield);
    }

    /**
     * @dev Calculate yield farming reward for a user
     * @param user User address
     * @return yield Calculated yield amount
     */
    function calculateYieldFarmingReward(address user) public view returns (uint256 yield) {
        YieldFarmInfo storage farming = yieldFarmInfo[user];
        if (!farming.isActive) {
            return 0;
        }
        
        uint256 farmingDuration = block.timestamp - farming.startTime;
        uint256 annualYield = (farming.amount * farming.apy) / BASIS_POINTS;
        yield = (annualYield * farmingDuration) / 365 days;
        
        return yield;
    }

    /**
     * @dev Set fee discount for a user (only CommitmentPot)
     * @param user User address
     * @param discountPercentage Discount percentage in basis points
     */
    function setFeeDiscount(address user, uint256 discountPercentage) external onlyCommitmentPot {
        require(discountPercentage <= 5000, "Discount cannot exceed 50%");
        feeDiscounts[user] = discountPercentage;
        emit FeeDiscountUpdated(user, discountPercentage);
    }

    /**
     * @dev Get fee discount for a user
     * @param user User address
     * @return discount Discount percentage in basis points
     */
    function getFeeDiscount(address user) external view returns (uint256 discount) {
        return feeDiscounts[user];
    }

    /**
     * @dev Mint tokens for goal completion rewards (only CommitmentPot)
     * @param user User address
     * @param amount Amount to mint
     */
    function mintCompletionReward(address user, uint256 amount) external onlyCommitmentPot {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(user, amount);
    }

    /**
     * @dev Burn tokens (only owner)
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Enable/disable staking (only owner)
     * @param enabled Whether staking is enabled
     */
    function setStakingEnabled(bool enabled) external onlyOwner {
        stakingEnabled = enabled;
    }

    /**
     * @dev Enable/disable yield farming (only owner)
     * @param enabled Whether yield farming is enabled
     */
    function setYieldFarmingEnabled(bool enabled) external onlyOwner {
        yieldFarmingEnabled = enabled;
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
     * @dev Get user's staking information
     * @param user User address
     * @return amount Staked amount
     * @return startTime Staking start time
     * @return duration Staking duration
     * @return rewardRate Reward rate
     * @return isActive Whether staking is active
     * @return reward Calculated reward
     */
    function getStakingInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 duration,
        uint256 rewardRate,
        bool isActive,
        uint256 reward
    ) {
        StakingInfo storage staking = stakingInfo[user];
        return (
            staking.amount,
            staking.startTime,
            staking.duration,
            staking.rewardRate,
            staking.isActive,
            calculateStakingReward(user)
        );
    }

    /**
     * @dev Get user's yield farming information
     * @param user User address
     * @return amount Farmed amount
     * @return startTime Farming start time
     * @return apy APY rate
     * @return isActive Whether farming is active
     * @return yield Calculated yield
     */
    function getYieldFarmingInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 apy,
        bool isActive,
        uint256 yield
    ) {
        YieldFarmInfo storage farming = yieldFarmInfo[user];
        return (
            farming.amount,
            farming.startTime,
            farming.apy,
            farming.isActive,
            calculateYieldFarmingReward(user)
        );
    }

    // Override required functions for ERC20Votes
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}

