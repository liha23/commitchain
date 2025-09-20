// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
// Counters is deprecated in OpenZeppelin v5, using uint256 instead

/**
 * @title AchievementNFT
 * @dev ERC721 NFT contract for goal completion achievements
 * @notice This contract mints NFTs for users who complete their commitments
 */
contract AchievementNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, Pausable {
    // Events
    event AchievementMinted(address indexed to, uint256 indexed tokenId, string achievementType, uint256 groupId);
    event AchievementTypeAdded(string achievementType, string metadataURI);
    event AchievementTypeUpdated(string achievementType, string metadataURI);

    // Structs
    struct Achievement {
        uint256 tokenId;
        address owner;
        string achievementType;
        uint256 groupId;
        uint256 completedAt;
        string proofHash;
        bool isRare;
        uint256 rarityLevel;
    }

    // State variables
    uint256 private _tokenIdCounter;
    mapping(uint256 => Achievement) public achievements;
    mapping(string => string) public achievementTypeURIs;
    mapping(string => bool) public achievementTypes;
    mapping(address => uint256[]) public userAchievements;
    mapping(uint256 => uint256[]) public groupAchievements;
    
    address public commitmentPot;
    string public baseURI;
    uint256 public maxSupply = 1000000; // Maximum number of NFTs that can be minted
    uint256 public mintingFee = 0.01 ether; // Fee for minting NFTs
    
    // Rarity levels
    uint256 public constant COMMON = 1;
    uint256 public constant UNCOMMON = 2;
    uint256 public constant RARE = 3;
    uint256 public constant EPIC = 4;
    uint256 public constant LEGENDARY = 5;

    // Modifiers
    modifier onlyCommitmentPot() {
        require(msg.sender == commitmentPot, "Only CommitmentPot can call this");
        _;
    }

    modifier validAchievementType(string memory achievementType) {
        require(achievementTypes[achievementType], "Invalid achievement type");
        _;
    }

    constructor(string memory _baseURI) ERC721("Commitment Achievements", "COMMITNFT") {
        baseURI = _baseURI;
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
     * @dev Add a new achievement type
     * @param achievementType Type of achievement
     * @param metadataURI Metadata URI for the achievement type
     */
    function addAchievementType(string memory achievementType, string memory metadataURI) external onlyOwner {
        require(bytes(achievementType).length > 0, "Achievement type cannot be empty");
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");
        
        achievementTypes[achievementType] = true;
        achievementTypeURIs[achievementType] = metadataURI;
        
        emit AchievementTypeAdded(achievementType, metadataURI);
    }

    /**
     * @dev Update achievement type metadata
     * @param achievementType Type of achievement
     * @param metadataURI New metadata URI
     */
    function updateAchievementType(string memory achievementType, string memory metadataURI) external onlyOwner {
        require(achievementTypes[achievementType], "Achievement type does not exist");
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");
        
        achievementTypeURIs[achievementType] = metadataURI;
        
        emit AchievementTypeUpdated(achievementType, metadataURI);
    }

    /**
     * @dev Mint achievement NFT (only CommitmentPot)
     * @param to Recipient address
     * @param achievementType Type of achievement
     * @param groupId Group ID
     * @param proofHash Proof hash
     * @param isRare Whether the achievement is rare
     */
    function mintAchievement(
        address to,
        string memory achievementType,
        uint256 groupId,
        string memory proofHash,
        bool isRare
    ) external onlyCommitmentPot validAchievementType(achievementType) returns (uint256) {
        require(to != address(0), "Invalid recipient address");
        require(_tokenIdCounter < maxSupply, "Max supply reached");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        // Determine rarity level
        uint256 rarityLevel = isRare ? RARE : COMMON;
        if (isRare) {
            // Random rarity for rare achievements
            uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, tokenId)));
            rarityLevel = (random % 5) + 1; // 1-5 rarity levels
        }
        
        // Create achievement
        achievements[tokenId] = Achievement({
            tokenId: tokenId,
            owner: to,
            achievementType: achievementType,
            groupId: groupId,
            completedAt: block.timestamp,
            proofHash: proofHash,
            isRare: isRare,
            rarityLevel: rarityLevel
        });
        
        // Update mappings
        userAchievements[to].push(tokenId);
        groupAchievements[groupId].push(tokenId);
        
        // Mint NFT
        _safeMint(to, tokenId);
        
        // Set token URI
        string memory tokenURI = string(abi.encodePacked(
            achievementTypeURIs[achievementType],
            "/",
            _toString(tokenId)
        ));
        _setTokenURI(tokenId, tokenURI);
        
        emit AchievementMinted(to, tokenId, achievementType, groupId);
        
        return tokenId;
    }

    /**
     * @dev Mint achievement NFT with custom rarity
     * @param to Recipient address
     * @param achievementType Type of achievement
     * @param groupId Group ID
     * @param proofHash Proof hash
     * @param rarityLevel Custom rarity level
     */
    function mintAchievementWithRarity(
        address to,
        string memory achievementType,
        uint256 groupId,
        string memory proofHash,
        uint256 rarityLevel
    ) external onlyCommitmentPot validAchievementType(achievementType) returns (uint256) {
        require(to != address(0), "Invalid recipient address");
        require(_tokenIdCounter < maxSupply, "Max supply reached");
        require(rarityLevel >= 1 && rarityLevel <= 5, "Invalid rarity level");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        bool isRare = rarityLevel > COMMON;
        
        // Create achievement
        achievements[tokenId] = Achievement({
            tokenId: tokenId,
            owner: to,
            achievementType: achievementType,
            groupId: groupId,
            completedAt: block.timestamp,
            proofHash: proofHash,
            isRare: isRare,
            rarityLevel: rarityLevel
        });
        
        // Update mappings
        userAchievements[to].push(tokenId);
        groupAchievements[groupId].push(tokenId);
        
        // Mint NFT
        _safeMint(to, tokenId);
        
        // Set token URI
        string memory tokenURI = string(abi.encodePacked(
            achievementTypeURIs[achievementType],
            "/",
            _toString(tokenId)
        ));
        _setTokenURI(tokenId, tokenURI);
        
        emit AchievementMinted(to, tokenId, achievementType, groupId);
        
        return tokenId;
    }

    /**
     * @dev Get achievement details
     * @param tokenId Token ID
     * @return achievement Achievement details
     */
    function getAchievement(uint256 tokenId) external view returns (Achievement memory achievement) {
        require(_exists(tokenId), "Token does not exist");
        return achievements[tokenId];
    }

    /**
     * @dev Get user's achievements
     * @param user User address
     * @return tokenIds Array of token IDs
     */
    function getUserAchievements(address user) external view returns (uint256[] memory tokenIds) {
        return userAchievements[user];
    }

    /**
     * @dev Get group's achievements
     * @param groupId Group ID
     * @return tokenIds Array of token IDs
     */
    function getGroupAchievements(uint256 groupId) external view returns (uint256[] memory tokenIds) {
        return groupAchievements[groupId];
    }

    /**
     * @dev Get achievements by type
     * @param achievementType Achievement type
     * @param offset Starting index
     * @param limit Maximum number to return
     * @return tokenIds Array of token IDs
     */
    function getAchievementsByType(
        string memory achievementType,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory tokenIds) {
        uint256[] memory tempTokenIds = new uint256[](totalSupply());
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            if (_exists(i) && keccak256(bytes(achievements[i].achievementType)) == keccak256(bytes(achievementType))) {
                if (count >= offset && count < offset + limit) {
                    tempTokenIds[count - offset] = i;
                }
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count > offset ? (count - offset > limit ? limit : count - offset) : 0);
        for (uint256 i = 0; i < result.length; i++) {
            result[i] = tempTokenIds[i];
        }
        
        return result;
    }

    /**
     * @dev Get achievements by rarity
     * @param rarityLevel Rarity level
     * @param offset Starting index
     * @param limit Maximum number to return
     * @return tokenIds Array of token IDs
     */
    function getAchievementsByRarity(
        uint256 rarityLevel,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory tokenIds) {
        uint256[] memory tempTokenIds = new uint256[](totalSupply());
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            if (_exists(i) && achievements[i].rarityLevel == rarityLevel) {
                if (count >= offset && count < offset + limit) {
                    tempTokenIds[count - offset] = i;
                }
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count > offset ? (count - offset > limit ? limit : count - offset) : 0);
        for (uint256 i = 0; i < result.length; i++) {
            result[i] = tempTokenIds[i];
        }
        
        return result;
    }

    /**
     * @dev Get rarity name
     * @param rarityLevel Rarity level
     * @return rarityName Rarity name
     */
    function getRarityName(uint256 rarityLevel) external pure returns (string memory rarityName) {
        if (rarityLevel == COMMON) return "Common";
        if (rarityLevel == UNCOMMON) return "Uncommon";
        if (rarityLevel == RARE) return "Rare";
        if (rarityLevel == EPIC) return "Epic";
        if (rarityLevel == LEGENDARY) return "Legendary";
        return "Unknown";
    }

    /**
     * @dev Update base URI (only owner)
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }

    /**
     * @dev Update max supply (only owner)
     * @param newMaxSupply New max supply
     */
    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply >= _tokenIdCounter, "Max supply cannot be less than current supply");
        maxSupply = newMaxSupply;
    }

    /**
     * @dev Update minting fee (only owner)
     * @param newMintingFee New minting fee
     */
    function setMintingFee(uint256 newMintingFee) external onlyOwner {
        mintingFee = newMintingFee;
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
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Override required functions
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Helper function to convert uint256 to string
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

    // Receive function to accept AVAX
    receive() external payable {}
}

