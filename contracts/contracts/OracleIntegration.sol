// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title OracleIntegration
 * @dev Handles oracle integrations for automated goal verification
 * @notice This contract integrates with Chainlink oracles for external data verification
 */
contract OracleIntegration is ChainlinkClient, ConfirmedOwner, ReentrancyGuard {
    
    // Events
    event OracleRequestCreated(bytes32 indexed requestId, uint256 indexed groupId, address indexed member, string dataSource);
    event OracleResponseReceived(bytes32 indexed requestId, uint256 indexed groupId, address indexed member, uint256 result);
    event OracleRequestFailed(bytes32 indexed requestId, uint256 indexed groupId, address indexed member, string reason);

    // Structs
    struct OracleRequest {
        bytes32 requestId;
        uint256 groupId;
        address member;
        string dataSource;
        uint256 targetValue;
        uint256 actualValue;
        bool isCompleted;
        bool isSuccessful;
        uint256 timestamp;
    }

    // State variables
    mapping(bytes32 => OracleRequest) public oracleRequests;
    mapping(string => string) public dataSourceJobs; // dataSource => jobId
    mapping(string => uint256) public dataSourceFees; // dataSource => fee in LINK
    mapping(address => bool) public authorizedCallers;
    
    address public milestoneChecker;
    uint256 public constant ORACLE_PAYMENT = 0.1 * 10**18; // 0.1 LINK
    uint256 public constant REQUEST_TIMEOUT = 5 minutes;
    
    // Modifiers
    modifier onlyAuthorizedCaller() {
        require(authorizedCallers[msg.sender], "Not authorized caller");
        _;
    }

    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846); // LINK token on Fuji
        setChainlinkOracle(0x2eD832Ba664535e5886b75D64C46EB9a228C2610); // VRF Coordinator on Fuji
    }

    /**
     * @dev Set MilestoneChecker contract address (only owner)
     * @param _milestoneChecker MilestoneChecker contract address
     */
    function setMilestoneChecker(address _milestoneChecker) external onlyOwner {
        require(_milestoneChecker != address(0), "Invalid address");
        milestoneChecker = _milestoneChecker;
    }

    /**
     * @dev Add authorized caller (only owner)
     * @param caller Caller address
     */
    function addAuthorizedCaller(address caller) external onlyOwner {
        require(caller != address(0), "Invalid address");
        authorizedCallers[caller] = true;
    }

    /**
     * @dev Remove authorized caller (only owner)
     * @param caller Caller address
     */
    function removeAuthorizedCaller(address caller) external onlyOwner {
        authorizedCallers[caller] = false;
    }

    /**
     * @dev Set data source job mapping (only owner)
     * @param dataSource Data source identifier
     * @param jobId Chainlink job ID
     * @param fee Fee in LINK
     */
    function setDataSourceJob(string memory dataSource, string memory jobId, uint256 fee) external onlyOwner {
        require(bytes(dataSource).length > 0, "Data source cannot be empty");
        require(bytes(jobId).length > 0, "Job ID cannot be empty");
        require(fee > 0, "Fee must be greater than 0");
        
        dataSourceJobs[dataSource] = jobId;
        dataSourceFees[dataSource] = fee;
    }

    /**
     * @dev Request LeetCode progress verification
     * @param groupId Group ID
     * @param member Member address
     * @param username LeetCode username
     * @param targetProblems Target number of problems
     */
    function requestLeetCodeVerification(
        uint256 groupId,
        address member,
        string memory username,
        uint256 targetProblems
    ) external onlyAuthorizedCaller returns (bytes32) {
        require(bytes(username).length > 0, "Username cannot be empty");
        require(targetProblems > 0, "Target problems must be greater than 0");
        
        string memory jobId = dataSourceJobs["leetcode"];
        require(bytes(jobId).length > 0, "LeetCode job not configured");
        
        Chainlink.Request memory req = buildChainlinkRequest(
            stringToBytes32(jobId),
            address(this),
            this.fulfillLeetCodeRequest.selector
        );
        
        req.add("username", username);
        req.add("target", _toString(targetProblems));
        req.add("path", "problems_solved");
        
        bytes32 requestId = sendChainlinkRequest(req, dataSourceFees["leetcode"]);
        
        oracleRequests[requestId] = OracleRequest({
            requestId: requestId,
            groupId: groupId,
            member: member,
            dataSource: "leetcode",
            targetValue: targetProblems,
            actualValue: 0,
            isCompleted: false,
            isSuccessful: false,
            timestamp: block.timestamp
        });
        
        emit OracleRequestCreated(requestId, groupId, member, "leetcode");
        
        return requestId;
    }

    /**
     * @dev Request GitHub commit verification
     * @param groupId Group ID
     * @param member Member address
     * @param username GitHub username
     * @param repository Repository name
     * @param targetCommits Target number of commits
     */
    function requestGitHubVerification(
        uint256 groupId,
        address member,
        string memory username,
        string memory repository,
        uint256 targetCommits
    ) external onlyAuthorizedCaller returns (bytes32) {
        require(bytes(username).length > 0, "Username cannot be empty");
        require(bytes(repository).length > 0, "Repository cannot be empty");
        require(targetCommits > 0, "Target commits must be greater than 0");
        
        string memory jobId = dataSourceJobs["github"];
        require(bytes(jobId).length > 0, "GitHub job not configured");
        
        Chainlink.Request memory req = buildChainlinkRequest(
            stringToBytes32(jobId),
            address(this),
            this.fulfillGitHubRequest.selector
        );
        
        req.add("username", username);
        req.add("repository", repository);
        req.add("target", _toString(targetCommits));
        req.add("path", "commits_count");
        
        bytes32 requestId = sendChainlinkRequest(req, dataSourceFees["github"]);
        
        oracleRequests[requestId] = OracleRequest({
            requestId: requestId,
            groupId: groupId,
            member: member,
            dataSource: "github",
            targetValue: targetCommits,
            actualValue: 0,
            isCompleted: false,
            isSuccessful: false,
            timestamp: block.timestamp
        });
        
        emit OracleRequestCreated(requestId, groupId, member, "github");
        
        return requestId;
    }

    /**
     * @dev Request custom API verification
     * @param groupId Group ID
     * @param member Member address
     * @param dataSource Data source identifier
     * @param apiEndpoint API endpoint
     * @param targetValue Target value
     * @param dataPath JSON path to extract data
     */
    function requestCustomVerification(
        uint256 groupId,
        address member,
        string memory dataSource,
        string memory apiEndpoint,
        uint256 targetValue,
        string memory dataPath
    ) external onlyAuthorizedCaller returns (bytes32) {
        require(bytes(dataSource).length > 0, "Data source cannot be empty");
        require(bytes(apiEndpoint).length > 0, "API endpoint cannot be empty");
        require(targetValue > 0, "Target value must be greater than 0");
        require(bytes(dataPath).length > 0, "Data path cannot be empty");
        
        string memory jobId = dataSourceJobs[dataSource];
        require(bytes(jobId).length > 0, "Data source job not configured");
        
        Chainlink.Request memory req = buildChainlinkRequest(
            stringToBytes32(jobId),
            address(this),
            this.fulfillCustomRequest.selector
        );
        
        req.add("endpoint", apiEndpoint);
        req.add("target", _toString(targetValue));
        req.add("path", dataPath);
        
        bytes32 requestId = sendChainlinkRequest(req, dataSourceFees[dataSource]);
        
        oracleRequests[requestId] = OracleRequest({
            requestId: requestId,
            groupId: groupId,
            member: member,
            dataSource: dataSource,
            targetValue: targetValue,
            actualValue: 0,
            isCompleted: false,
            isSuccessful: false,
            timestamp: block.timestamp
        });
        
        emit OracleRequestCreated(requestId, groupId, member, dataSource);
        
        return requestId;
    }

    /**
     * @dev Fulfill LeetCode request
     * @param requestId Request ID
     * @param result Result from oracle
     */
    function fulfillLeetCodeRequest(bytes32 requestId, uint256 result) external recordChainlinkFulfillment(requestId) {
        _fulfillRequest(requestId, result);
    }

    /**
     * @dev Fulfill GitHub request
     * @param requestId Request ID
     * @param result Result from oracle
     */
    function fulfillGitHubRequest(bytes32 requestId, uint256 result) external recordChainlinkFulfillment(requestId) {
        _fulfillRequest(requestId, result);
    }

    /**
     * @dev Fulfill custom request
     * @param requestId Request ID
     * @param result Result from oracle
     */
    function fulfillCustomRequest(bytes32 requestId, uint256 result) external recordChainlinkFulfillment(requestId) {
        _fulfillRequest(requestId, result);
    }

    /**
     * @dev Internal function to fulfill request
     * @param requestId Request ID
     * @param result Result from oracle
     */
    function _fulfillRequest(bytes32 requestId, uint256 result) internal {
        OracleRequest storage request = oracleRequests[requestId];
        require(!request.isCompleted, "Request already completed");
        
        request.actualValue = result;
        request.isCompleted = true;
        request.isSuccessful = true;
        
        // Update milestone checker if target is reached
        if (result >= request.targetValue && milestoneChecker != address(0)) {
            // This would need to be implemented based on the MilestoneChecker interface
            // milestoneChecker.updateMilestoneProgress(request.groupId, request.member, milestoneIndex, result);
        }
        
        emit OracleResponseReceived(requestId, request.groupId, request.member, result);
    }

    /**
     * @dev Handle failed oracle request
     * @param requestId Request ID
     * @param reason Failure reason
     */
    function handleFailedRequest(bytes32 requestId, string memory reason) external onlyOwner {
        OracleRequest storage request = oracleRequests[requestId];
        require(!request.isCompleted, "Request already completed");
        
        request.isCompleted = true;
        request.isSuccessful = false;
        
        emit OracleRequestFailed(requestId, request.groupId, request.member, reason);
    }

    /**
     * @dev Get oracle request details
     * @param requestId Request ID
     * @return request Oracle request details
     */
    function getOracleRequest(bytes32 requestId) external view returns (OracleRequest memory request) {
        return oracleRequests[requestId];
    }

    /**
     * @dev Check if request is completed
     * @param requestId Request ID
     * @return isCompleted Whether request is completed
     */
    function isRequestCompleted(bytes32 requestId) external view returns (bool isCompleted) {
        return oracleRequests[requestId].isCompleted;
    }

    /**
     * @dev Check if request is successful
     * @param requestId Request ID
     * @return isSuccessful Whether request is successful
     */
    function isRequestSuccessful(bytes32 requestId) external view returns (bool isSuccessful) {
        return oracleRequests[requestId].isSuccessful;
    }

    /**
     * @dev Get request result
     * @param requestId Request ID
     * @return result Request result
     */
    function getRequestResult(bytes32 requestId) external view returns (uint256 result) {
        return oracleRequests[requestId].actualValue;
    }

    /**
     * @dev Withdraw LINK tokens (only owner)
     * @param amount Amount to withdraw
     */
    function withdrawLink(uint256 amount) external onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, amount), "Unable to transfer");
    }

    /**
     * @dev Emergency withdraw LINK tokens (only owner)
     */
    function emergencyWithdrawLink() external onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    // Helper functions
    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory tempBytes = bytes(source);
        if (tempBytes.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

