// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title MilestoneChecker
 * @dev Handles milestone verification and partial reward distribution
 * @notice This contract manages milestone tracking for various goal types
 */
contract MilestoneChecker is ReentrancyGuard, Ownable {
    
    // Events
    event MilestoneSet(uint256 indexed groupId, address indexed member, uint256 milestoneIndex, uint256 target);
    event MilestoneReached(uint256 indexed groupId, address indexed member, uint256 milestoneIndex, uint256 actual);
    event OracleDataRequested(uint256 indexed groupId, address indexed member, uint256 milestoneIndex, string dataSource);

    // Structs
    struct Milestone {
        uint256 target;
        uint256 actual;
        bool isReached;
        uint256 reachedAt;
        MilestoneType milestoneType;
        string dataSource; // For oracle-based milestones
        string proofHash; // For manual milestones
    }

    enum MilestoneType {
        MANUAL,      // Manual proof submission
        ORACLE,      // Oracle-based verification
        HYBRID       // Combination of both
    }

    // State variables
    mapping(uint256 => mapping(address => Milestone[])) public userMilestones;
    mapping(string => address) public oracleAddresses; // dataSource => oracle address
    mapping(address => bool) public authorizedOracles;
    
    // Modifiers
    modifier onlyAuthorizedOracle() {
        require(authorizedOracles[msg.sender], "Not authorized oracle");
        _;
    }

    constructor() {}

    /**
     * @dev Set a milestone for a user
     * @param groupId Group ID
     * @param member Member address
     * @param milestoneIndex Milestone index
     * @param target Target value for the milestone
     * @param milestoneType Type of milestone (MANUAL, ORACLE, HYBRID)
     * @param dataSource Data source for oracle-based milestones
     */
    function setMilestone(
        uint256 groupId,
        address member,
        uint256 milestoneIndex,
        uint256 target,
        MilestoneType milestoneType,
        string memory dataSource
    ) external {
        require(target > 0, "Target must be greater than 0");
        
        // Ensure milestone array is large enough
        while (userMilestones[groupId][member].length <= milestoneIndex) {
            userMilestones[groupId][member].push(Milestone({
                target: 0,
                actual: 0,
                isReached: false,
                reachedAt: 0,
                milestoneType: MilestoneType.MANUAL,
                dataSource: "",
                proofHash: ""
            }));
        }
        
        Milestone storage milestone = userMilestones[groupId][member][milestoneIndex];
        milestone.target = target;
        milestone.milestoneType = milestoneType;
        milestone.dataSource = dataSource;
        
        emit MilestoneSet(groupId, member, milestoneIndex, target);
    }

    /**
     * @dev Submit manual proof for a milestone
     * @param groupId Group ID
     * @param member Member address
     * @param milestoneIndex Milestone index
     * @param proofHash IPFS hash of the proof
     */
    function submitMilestoneProof(
        uint256 groupId,
        address member,
        uint256 milestoneIndex,
        string memory proofHash
    ) external {
        require(bytes(proofHash).length > 0, "Proof hash cannot be empty");
        
        Milestone storage milestone = userMilestones[groupId][member][milestoneIndex];
        require(milestone.target > 0, "Milestone not set");
        require(!milestone.isReached, "Milestone already reached");
        require(
            milestone.milestoneType == MilestoneType.MANUAL || 
            milestone.milestoneType == MilestoneType.HYBRID,
            "Milestone type does not support manual proof"
        );
        
        milestone.proofHash = proofHash;
        milestone.actual = milestone.target; // For manual milestones, actual equals target when proof is submitted
        milestone.isReached = true;
        milestone.reachedAt = block.timestamp;
        
        emit MilestoneReached(groupId, member, milestoneIndex, milestone.actual);
    }

    /**
     * @dev Update milestone progress via oracle
     * @param groupId Group ID
     * @param member Member address
     * @param milestoneIndex Milestone index
     * @param actual Actual value from oracle
     */
    function updateMilestoneProgress(
        uint256 groupId,
        address member,
        uint256 milestoneIndex,
        uint256 actual
    ) external onlyAuthorizedOracle {
        Milestone storage milestone = userMilestones[groupId][member][milestoneIndex];
        require(milestone.target > 0, "Milestone not set");
        require(
            milestone.milestoneType == MilestoneType.ORACLE || 
            milestone.milestoneType == MilestoneType.HYBRID,
            "Milestone type does not support oracle updates"
        );
        
        milestone.actual = actual;
        
        if (!milestone.isReached && actual >= milestone.target) {
            milestone.isReached = true;
            milestone.reachedAt = block.timestamp;
            emit MilestoneReached(groupId, member, milestoneIndex, actual);
        }
    }

    /**
     * @dev Check if a milestone is reached
     * @param groupId Group ID
     * @param member Member address
     * @param milestoneIndex Milestone index
     * @return isReached Whether the milestone is reached
     */
    function checkMilestone(
        uint256 groupId,
        address member,
        uint256 milestoneIndex
    ) external view returns (bool isReached) {
        Milestone storage milestone = userMilestones[groupId][member][milestoneIndex];
        return milestone.isReached;
    }

    /**
     * @dev Get milestone details
     * @param groupId Group ID
     * @param member Member address
     * @param milestoneIndex Milestone index
     * @return target Target value
     * @return actual Actual value
     * @return isReached Whether milestone is reached
     * @return reachedAt Timestamp when reached
     * @return milestoneType Type of milestone
     * @return dataSource Data source
     * @return proofHash Proof hash
     */
    function getMilestoneDetails(
        uint256 groupId,
        address member,
        uint256 milestoneIndex
    ) external view returns (
        uint256 target,
        uint256 actual,
        bool isReached,
        uint256 reachedAt,
        MilestoneType milestoneType,
        string memory dataSource,
        string memory proofHash
    ) {
        Milestone storage milestone = userMilestones[groupId][member][milestoneIndex];
        return (
            milestone.target,
            milestone.actual,
            milestone.isReached,
            milestone.reachedAt,
            milestone.milestoneType,
            milestone.dataSource,
            milestone.proofHash
        );
    }

    /**
     * @dev Get all milestones for a user
     * @param groupId Group ID
     * @param member Member address
     * @return milestones Array of milestones
     */
    function getUserMilestones(uint256 groupId, address member) 
        external 
        view 
        returns (Milestone[] memory milestones) 
    {
        return userMilestones[groupId][member];
    }

    /**
     * @dev Request oracle data for a milestone
     * @param groupId Group ID
     * @param member Member address
     * @param milestoneIndex Milestone index
     */
    function requestOracleData(
        uint256 groupId,
        address member,
        uint256 milestoneIndex
    ) external {
        Milestone storage milestone = userMilestones[groupId][member][milestoneIndex];
        require(milestone.target > 0, "Milestone not set");
        require(
            milestone.milestoneType == MilestoneType.ORACLE || 
            milestone.milestoneType == MilestoneType.HYBRID,
            "Milestone type does not support oracle data"
        );
        require(bytes(milestone.dataSource).length > 0, "Data source not set");
        
        emit OracleDataRequested(groupId, member, milestoneIndex, milestone.dataSource);
    }

    /**
     * @dev Get progress percentage for a milestone
     * @param groupId Group ID
     * @param member Member address
     * @param milestoneIndex Milestone index
     * @return progress Progress percentage (0-100)
     */
    function getMilestoneProgress(
        uint256 groupId,
        address member,
        uint256 milestoneIndex
    ) external view returns (uint256 progress) {
        Milestone storage milestone = userMilestones[groupId][member][milestoneIndex];
        if (milestone.target == 0) {
            return 0;
        }
        
        uint256 progressBasisPoints = (milestone.actual * 10000) / milestone.target;
        return progressBasisPoints / 100; // Convert to percentage
    }

    /**
     * @dev Add authorized oracle (only owner)
     * @param oracle Oracle address
     */
    function addAuthorizedOracle(address oracle) external onlyOwner {
        require(oracle != address(0), "Invalid oracle address");
        authorizedOracles[oracle] = true;
    }

    /**
     * @dev Remove authorized oracle (only owner)
     * @param oracle Oracle address
     */
    function removeAuthorizedOracle(address oracle) external onlyOwner {
        authorizedOracles[oracle] = false;
    }

    /**
     * @dev Set oracle address for a data source (only owner)
     * @param dataSource Data source identifier
     * @param oracleAddress Oracle contract address
     */
    function setOracleAddress(string memory dataSource, address oracleAddress) external onlyOwner {
        require(oracleAddress != address(0), "Invalid oracle address");
        oracleAddresses[dataSource] = oracleAddress;
    }

    /**
     * @dev Get oracle address for a data source
     * @param dataSource Data source identifier
     * @return oracleAddress Oracle contract address
     */
    function getOracleAddress(string memory dataSource) external view returns (address oracleAddress) {
        return oracleAddresses[dataSource];
    }

    /**
     * @dev Batch update milestones for multiple users
     * @param groupId Group ID
     * @param members Array of member addresses
     * @param milestoneIndex Milestone index
     * @param actuals Array of actual values
     */
    function batchUpdateMilestones(
        uint256 groupId,
        address[] memory members,
        uint256 milestoneIndex,
        uint256[] memory actuals
    ) external onlyAuthorizedOracle {
        require(members.length == actuals.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < members.length; i++) {
            Milestone storage milestone = userMilestones[groupId][members[i]][milestoneIndex];
            if (milestone.target > 0) {
                milestone.actual = actuals[i];
                
                if (!milestone.isReached && actuals[i] >= milestone.target) {
                    milestone.isReached = true;
                    milestone.reachedAt = block.timestamp;
                    emit MilestoneReached(groupId, members[i], milestoneIndex, actuals[i]);
                }
            }
        }
    }

    /**
     * @dev Emergency function to manually set milestone as reached (only owner)
     * @param groupId Group ID
     * @param member Member address
     * @param milestoneIndex Milestone index
     */
    function emergencySetMilestoneReached(
        uint256 groupId,
        address member,
        uint256 milestoneIndex
    ) external onlyOwner {
        Milestone storage milestone = userMilestones[groupId][member][milestoneIndex];
        require(milestone.target > 0, "Milestone not set");
        
        milestone.isReached = true;
        milestone.reachedAt = block.timestamp;
        milestone.actual = milestone.target;
        
        emit MilestoneReached(groupId, member, milestoneIndex, milestone.actual);
    }
}

