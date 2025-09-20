// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Counters is deprecated in OpenZeppelin v5, using uint256 instead

/**
 * @title VerificationVoter
 * @dev Handles peer verification voting for goal completion proofs
 * @notice This contract manages the voting process for verifying user-submitted proofs
 */
contract VerificationVoter is ReentrancyGuard, Ownable {
    // Events
    event VerificationStarted(uint256 indexed groupId, address indexed member, string proofHash);
    event VoteCast(uint256 indexed groupId, address indexed member, address indexed voter, bool approved);
    event VerificationCompleted(uint256 indexed groupId, address indexed member, bool approved, uint256 votesFor, uint256 votesAgainst);
    event DisputeRaised(uint256 indexed groupId, address indexed member, address indexed disputer, string reason);

    // Structs
    struct Verification {
        uint256 groupId;
        address member;
        string proofHash;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 totalVotes;
        bool isCompleted;
        bool isApproved;
        uint256 startTime;
        uint256 endTime;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteChoice; // true = approve, false = reject
        address[] voters;
    }

    struct Dispute {
        uint256 groupId;
        address member;
        address disputer;
        string reason;
        uint256 timestamp;
        bool isResolved;
    }

    // State variables
    uint256 private _verificationIdCounter;
    mapping(uint256 => Verification) public verifications;
    mapping(uint256 => mapping(address => uint256)) public memberVerifications; // groupId => member => verificationId
    mapping(uint256 => Dispute[]) public groupDisputes;
    
    uint256 public votingDuration = 7 days;
    uint256 public requiredVotes = 3; // Minimum votes required for verification
    uint256 public approvalThreshold = 66; // 66% approval required (in basis points)
    uint256 public constant BASIS_POINTS = 10000;
    
    // Modifiers
    modifier onlyGroupMember(uint256 groupId) {
        // This would need to be implemented with access to CommitmentPot contract
        _;
    }
    
    modifier verificationExists(uint256 verificationId) {
        require(verificationId > 0 && verificationId <= _verificationIdCounter, "Verification does not exist");
        _;
    }

    constructor() {}

    /**
     * @dev Start verification process for a member's proof
     * @param groupId Group ID
     * @param member Member address
     * @param proofHash IPFS hash of the proof
     */
    function startVerification(uint256 groupId, address member, string memory proofHash) external {
        require(bytes(proofHash).length > 0, "Proof hash cannot be empty");
        require(memberVerifications[groupId][member] == 0, "Verification already started");
        
        _verificationIdCounter++;
        uint256 verificationId = _verificationIdCounter;
        
        Verification storage verification = verifications[verificationId];
        verification.groupId = groupId;
        verification.member = member;
        verification.proofHash = proofHash;
        verification.startTime = block.timestamp;
        verification.endTime = block.timestamp + votingDuration;
        
        memberVerifications[groupId][member] = verificationId;
        
        emit VerificationStarted(groupId, member, proofHash);
    }

    /**
     * @dev Cast a vote on a verification
     * @param groupId Group ID
     * @param member Member address
     * @param approved Whether to approve or reject the proof
     */
    function castVote(uint256 groupId, address member, bool approved) 
        external 
        onlyGroupMember(groupId) 
        nonReentrant 
    {
        uint256 verificationId = memberVerifications[groupId][member];
        require(verificationId > 0, "Verification not found");
        
        Verification storage verification = verifications[verificationId];
        require(!verification.isCompleted, "Verification already completed");
        require(block.timestamp <= verification.endTime, "Voting period ended");
        require(!verification.hasVoted[msg.sender], "Already voted");
        require(msg.sender != member, "Cannot vote on own verification");
        
        verification.hasVoted[msg.sender] = true;
        verification.voteChoice[msg.sender] = approved;
        verification.voters.push(msg.sender);
        verification.totalVotes++;
        
        if (approved) {
            verification.votesFor++;
        } else {
            verification.votesAgainst++;
        }
        
        emit VoteCast(groupId, member, msg.sender, approved);
        
        // Check if verification can be completed
        if (verification.totalVotes >= requiredVotes) {
            _completeVerification(verificationId);
        }
    }

    /**
     * @dev Complete verification after voting period or required votes
     * @param verificationId Verification ID
     */
    function completeVerification(uint256 verificationId) 
        external 
        verificationExists(verificationId) 
    {
        Verification storage verification = verifications[verificationId];
        require(!verification.isCompleted, "Verification already completed");
        require(
            block.timestamp > verification.endTime || verification.totalVotes >= requiredVotes,
            "Verification cannot be completed yet"
        );
        
        _completeVerification(verificationId);
    }

    /**
     * @dev Internal function to complete verification
     * @param verificationId Verification ID
     */
    function _completeVerification(uint256 verificationId) internal {
        Verification storage verification = verifications[verificationId];
        
        // Calculate approval percentage
        uint256 approvalPercentage = 0;
        if (verification.totalVotes > 0) {
            approvalPercentage = (verification.votesFor * BASIS_POINTS) / verification.totalVotes;
        }
        
        verification.isCompleted = true;
        verification.isApproved = approvalPercentage >= approvalThreshold;
        
        emit VerificationCompleted(
            verification.groupId,
            verification.member,
            verification.isApproved,
            verification.votesFor,
            verification.votesAgainst
        );
    }

    /**
     * @dev Raise a dispute for a verification
     * @param groupId Group ID
     * @param member Member address
     * @param reason Reason for dispute
     */
    function raiseDispute(uint256 groupId, address member, string memory reason) 
        external 
        onlyGroupMember(groupId) 
    {
        require(bytes(reason).length > 0, "Dispute reason cannot be empty");
        require(msg.sender != member, "Cannot dispute own verification");
        
        uint256 verificationId = memberVerifications[groupId][member];
        require(verificationId > 0, "Verification not found");
        
        Verification storage verification = verifications[verificationId];
        require(verification.isCompleted, "Verification not completed");
        
        Dispute memory dispute = Dispute({
            groupId: groupId,
            member: member,
            disputer: msg.sender,
            reason: reason,
            timestamp: block.timestamp,
            isResolved: false
        });
        
        groupDisputes[groupId].push(dispute);
        
        emit DisputeRaised(groupId, member, msg.sender, reason);
    }

    /**
     * @dev Check if a member's proof is verified
     * @param groupId Group ID
     * @param member Member address
     * @return isVerified Whether the proof is verified
     */
    function isVerified(uint256 groupId, address member) external view returns (bool isVerified) {
        uint256 verificationId = memberVerifications[groupId][member];
        if (verificationId == 0) {
            return false;
        }
        
        Verification storage verification = verifications[verificationId];
        return verification.isCompleted && verification.isApproved;
    }

    /**
     * @dev Get verification details
     * @param groupId Group ID
     * @param member Member address
     * @return verificationId Verification ID
     * @return proofHash Proof hash
     * @return votesFor Votes for approval
     * @return votesAgainst Votes against
     * @return totalVotes Total votes cast
     * @return isCompleted Whether verification is completed
     * @return isApproved Whether verification is approved
     * @return startTime Verification start time
     * @return endTime Verification end time
     */
    function getVerificationDetails(uint256 groupId, address member) 
        external 
        view 
        returns (
            uint256 verificationId,
            string memory proofHash,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 totalVotes,
            bool isCompleted,
            bool isApproved,
            uint256 startTime,
            uint256 endTime
        ) 
    {
        verificationId = memberVerifications[groupId][member];
        if (verificationId == 0) {
            return (0, "", 0, 0, 0, false, false, 0, 0);
        }
        
        Verification storage verification = verifications[verificationId];
        return (
            verificationId,
            verification.proofHash,
            verification.votesFor,
            verification.votesAgainst,
            verification.totalVotes,
            verification.isCompleted,
            verification.isApproved,
            verification.startTime,
            verification.endTime
        );
    }

    /**
     * @dev Get voters for a verification
     * @param groupId Group ID
     * @param member Member address
     * @return voters Array of voter addresses
     */
    function getVerificationVoters(uint256 groupId, address member) 
        external 
        view 
        returns (address[] memory voters) 
    {
        uint256 verificationId = memberVerifications[groupId][member];
        if (verificationId == 0) {
            return new address[](0);
        }
        
        return verifications[verificationId].voters;
    }

    /**
     * @dev Get disputes for a group
     * @param groupId Group ID
     * @return disputes Array of disputes
     */
    function getGroupDisputes(uint256 groupId) 
        external 
        view 
        returns (Dispute[] memory disputes) 
    {
        return groupDisputes[groupId];
    }

    /**
     * @dev Check if user has voted on a verification
     * @param groupId Group ID
     * @param member Member address
     * @param voter Voter address
     * @return hasVoted Whether the voter has voted
     * @return voteChoice The vote choice (true = approve, false = reject)
     */
    function getVoteDetails(uint256 groupId, address member, address voter) 
        external 
        view 
        returns (bool hasVoted, bool voteChoice) 
    {
        uint256 verificationId = memberVerifications[groupId][member];
        if (verificationId == 0) {
            return (false, false);
        }
        
        Verification storage verification = verifications[verificationId];
        return (verification.hasVoted[voter], verification.voteChoice[voter]);
    }

    /**
     * @dev Update voting duration (only owner)
     * @param newDuration New voting duration in seconds
     */
    function updateVotingDuration(uint256 newDuration) external onlyOwner {
        require(newDuration >= 1 days && newDuration <= 30 days, "Invalid duration");
        votingDuration = newDuration;
    }

    /**
     * @dev Update required votes (only owner)
     * @param newRequiredVotes New required votes count
     */
    function updateRequiredVotes(uint256 newRequiredVotes) external onlyOwner {
        require(newRequiredVotes >= 2 && newRequiredVotes <= 10, "Invalid required votes");
        requiredVotes = newRequiredVotes;
    }

    /**
     * @dev Update approval threshold (only owner)
     * @param newThreshold New approval threshold in basis points
     */
    function updateApprovalThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold >= 50 && newThreshold <= 100, "Invalid threshold");
        approvalThreshold = newThreshold * 100; // Convert percentage to basis points
    }

    /**
     * @dev Resolve a dispute (only owner)
     * @param groupId Group ID
     * @param disputeIndex Dispute index
     * @param resolution Resolution decision
     */
    function resolveDispute(uint256 groupId, uint256 disputeIndex, bool resolution) external onlyOwner {
        require(disputeIndex < groupDisputes[groupId].length, "Invalid dispute index");
        
        Dispute storage dispute = groupDisputes[groupId][disputeIndex];
        require(!dispute.isResolved, "Dispute already resolved");
        
        dispute.isResolved = true;
        
        // If resolution is in favor of the disputer, reverse the verification
        if (resolution) {
            uint256 verificationId = memberVerifications[groupId][dispute.member];
            if (verificationId > 0) {
                Verification storage verification = verifications[verificationId];
                verification.isApproved = !verification.isApproved;
            }
        }
    }
}

