const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CommitmentPot", function () {
  let commitmentPot;
  let verificationVoter;
  let milestoneChecker;
  let commitToken;
  let achievementNFT;
  let oracleIntegration;
  let owner;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy VerificationVoter
    const VerificationVoter = await ethers.getContractFactory("VerificationVoter");
    verificationVoter = await VerificationVoter.deploy();
    await verificationVoter.deployed();

    // Deploy MilestoneChecker
    const MilestoneChecker = await ethers.getContractFactory("MilestoneChecker");
    milestoneChecker = await MilestoneChecker.deploy();
    await milestoneChecker.deployed();

    // Deploy CommitToken
    const CommitToken = await ethers.getContractFactory("CommitToken");
    commitToken = await CommitToken.deploy();
    await commitToken.deployed();

    // Deploy AchievementNFT
    const AchievementNFT = await ethers.getContractFactory("AchievementNFT");
    achievementNFT = await AchievementNFT.deploy("https://api.test.com/metadata/");
    await achievementNFT.deployed();

    // Deploy OracleIntegration
    const OracleIntegration = await ethers.getContractFactory("OracleIntegration");
    oracleIntegration = await OracleIntegration.deploy();
    await oracleIntegration.deployed();

    // Deploy CommitmentPot
    const CommitmentPot = await ethers.getContractFactory("CommitmentPot");
    commitmentPot = await CommitmentPot.deploy(
      verificationVoter.address,
      milestoneChecker.address,
      owner.address
    );
    await commitmentPot.deployed();

    // Set up contract relationships
    await commitToken.setCommitmentPot(commitmentPot.address);
    await achievementNFT.setCommitmentPot(commitmentPot.address);
    await oracleIntegration.setMilestoneChecker(milestoneChecker.address);
    await oracleIntegration.addAuthorizedCaller(commitmentPot.address);
  });

  describe("Group Creation", function () {
    it("Should create a group successfully", async function () {
      const stakeAmount = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
      const milestones = [2500, 5000, 7500]; // 25%, 50%, 75%

      await expect(
        commitmentPot.connect(user1).createGroup(
          "Test Group",
          "A test commitment group",
          stakeAmount,
          deadline,
          false,
          milestones,
          { value: stakeAmount }
        )
      ).to.emit(commitmentPot, "GroupCreated")
        .withArgs(1, user1.address, "Test Group", stakeAmount);

      const groupInfo = await commitmentPot.getGroupInfo(1);
      expect(groupInfo.name).to.equal("Test Group");
      expect(groupInfo.creator).to.equal(user1.address);
      expect(groupInfo.stakeAmount).to.equal(stakeAmount);
      expect(groupInfo.isActive).to.be.true;
    });

    it("Should fail to create group with insufficient stake", async function () {
      const stakeAmount = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const milestones = [2500, 5000, 7500];

      await expect(
        commitmentPot.connect(user1).createGroup(
          "Test Group",
          "A test commitment group",
          stakeAmount,
          deadline,
          false,
          milestones,
          { value: ethers.utils.parseEther("0.5") }
        )
      ).to.be.revertedWith("Insufficient stake amount");
    });

    it("Should fail to create group with past deadline", async function () {
      const stakeAmount = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) - 86400; // 1 day ago
      const milestones = [2500, 5000, 7500];

      await expect(
        commitmentPot.connect(user1).createGroup(
          "Test Group",
          "A test commitment group",
          stakeAmount,
          deadline,
          false,
          milestones,
          { value: stakeAmount }
        )
      ).to.be.revertedWith("Deadline must be in the future");
    });
  });

  describe("Group Joining", function () {
    beforeEach(async function () {
      const stakeAmount = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const milestones = [2500, 5000, 7500];

      await commitmentPot.connect(user1).createGroup(
        "Test Group",
        "A test commitment group",
        stakeAmount,
        deadline,
        false,
        milestones,
        { value: stakeAmount }
      );
    });

    it("Should allow users to join a group", async function () {
      const stakeAmount = ethers.utils.parseEther("1");

      await expect(
        commitmentPot.connect(user2).joinGroup(1, "Complete 100 LeetCode problems", { value: stakeAmount })
      ).to.emit(commitmentPot, "MemberJoined")
        .withArgs(1, user2.address, stakeAmount);

      const isMember = await commitmentPot.isGroupMember(1, user2.address);
      expect(isMember).to.be.true;

      const userGoal = await commitmentPot.getUserGoal(1, user2.address);
      expect(userGoal).to.equal("Complete 100 LeetCode problems");
    });

    it("Should fail to join group with insufficient stake", async function () {
      await expect(
        commitmentPot.connect(user2).joinGroup(1, "Complete 100 LeetCode problems", { value: ethers.utils.parseEther("0.5") })
      ).to.be.revertedWith("Insufficient stake amount");
    });

    it("Should fail to join group twice", async function () {
      const stakeAmount = ethers.utils.parseEther("1");

      await commitmentPot.connect(user2).joinGroup(1, "Complete 100 LeetCode problems", { value: stakeAmount });

      await expect(
        commitmentPot.connect(user2).joinGroup(1, "Another goal", { value: stakeAmount })
      ).to.be.revertedWith("Already a member");
    });
  });

  describe("Proof Submission", function () {
    beforeEach(async function () {
      const stakeAmount = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const milestones = [2500, 5000, 7500];

      await commitmentPot.connect(user1).createGroup(
        "Test Group",
        "A test commitment group",
        stakeAmount,
        deadline,
        false,
        milestones,
        { value: stakeAmount }
      );

      await commitmentPot.connect(user2).joinGroup(1, "Complete 100 LeetCode problems", { value: stakeAmount });
    });

    it("Should allow users to submit proofs", async function () {
      const proofHash = "QmTestHash123";

      await expect(
        commitmentPot.connect(user2).submitProof(1, proofHash)
      ).to.emit(commitmentPot, "ProofSubmitted")
        .withArgs(1, user2.address, proofHash);

      const userProof = await commitmentPot.getUserProof(1, user2.address);
      expect(userProof).to.equal(proofHash);
    });

    it("Should fail to submit proof after deadline", async function () {
      // Fast forward time to after deadline
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine");

      const proofHash = "QmTestHash123";

      await expect(
        commitmentPot.connect(user2).submitProof(1, proofHash)
      ).to.be.revertedWith("Deadline has passed");
    });
  });

  describe("Reward Distribution", function () {
    beforeEach(async function () {
      const stakeAmount = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const milestones = [2500, 5000, 7500];

      await commitmentPot.connect(user1).createGroup(
        "Test Group",
        "A test commitment group",
        stakeAmount,
        deadline,
        false,
        milestones,
        { value: stakeAmount }
      );

      await commitmentPot.connect(user2).joinGroup(1, "Complete 100 LeetCode problems", { value: stakeAmount });
      await commitmentPot.connect(user3).joinGroup(1, "Complete 50 LeetCode problems", { value: stakeAmount });
    });

    it("Should distribute rewards to completers", async function () {
      // Submit proofs
      await commitmentPot.connect(user1).submitProof(1, "QmProof1");
      await commitmentPot.connect(user2).submitProof(1, "QmProof2");
      await commitmentPot.connect(user3).submitProof(1, "QmProof3");

      // Fast forward to after deadline
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine");

      // Mock verification results (in real scenario, this would be done by VerificationVoter)
      // For testing, we'll assume all verifications pass

      const initialBalance1 = await ethers.provider.getBalance(user1.address);
      const initialBalance2 = await ethers.provider.getBalance(user2.address);
      const initialBalance3 = await ethers.provider.getBalance(user3.address);

      await commitmentPot.completeVerification(1);

      const finalBalance1 = await ethers.provider.getBalance(user1.address);
      const finalBalance2 = await ethers.provider.getBalance(user2.address);
      const finalBalance3 = await ethers.provider.getBalance(user3.address);

      // Check that rewards were distributed (excluding gas costs)
      expect(finalBalance1).to.be.gt(initialBalance1);
      expect(finalBalance2).to.be.gt(initialBalance2);
      expect(finalBalance3).to.be.gt(initialBalance3);
    });
  });

  describe("Milestone Rewards", function () {
    beforeEach(async function () {
      const stakeAmount = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const milestones = [2500, 5000, 7500];

      await commitmentPot.connect(user1).createGroup(
        "Test Group",
        "A test commitment group",
        stakeAmount,
        deadline,
        false,
        milestones,
        { value: stakeAmount }
      );

      await commitmentPot.connect(user2).joinGroup(1, "Complete 100 LeetCode problems", { value: stakeAmount });
    });

    it("Should allow claiming milestone rewards", async function () {
      // Set up milestone in MilestoneChecker
      await milestoneChecker.setMilestone(1, user2.address, 0, 25, 0, "manual"); // 25% milestone
      await milestoneChecker.submitMilestoneProof(1, user2.address, 0, "QmMilestoneProof");

      const initialBalance = await ethers.provider.getBalance(user2.address);

      await commitmentPot.connect(user2).claimMilestoneReward(1, 0);

      const finalBalance = await ethers.provider.getBalance(user2.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to update platform fee", async function () {
      await expect(
        commitmentPot.connect(user1).updatePlatformFee(500)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await commitmentPot.updatePlatformFee(500);
      // Fee should be updated (this would need a getter function to verify)
    });

    it("Should only allow owner to pause contract", async function () {
      await expect(
        commitmentPot.connect(user1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await commitmentPot.pause();
      // Contract should be paused
    });
  });

  describe("Edge Cases", function () {
    it("Should handle empty group gracefully", async function () {
      const stakeAmount = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const milestones = [2500, 5000, 7500];

      await commitmentPot.connect(user1).createGroup(
        "Test Group",
        "A test commitment group",
        stakeAmount,
        deadline,
        false,
        milestones,
        { value: stakeAmount }
      );

      // Fast forward to after deadline
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine");

      // Should complete verification even with no completers
      await expect(
        commitmentPot.completeVerification(1)
      ).to.emit(commitmentPot, "RewardsDistributed")
        .withArgs(1, 0, 0);
    });

    it("Should handle group with no completers", async function () {
      const stakeAmount = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const milestones = [2500, 5000, 7500];

      await commitmentPot.connect(user1).createGroup(
        "Test Group",
        "A test commitment group",
        stakeAmount,
        deadline,
        false,
        milestones,
        { value: stakeAmount }
      );

      await commitmentPot.connect(user2).joinGroup(1, "Complete 100 LeetCode problems", { value: stakeAmount });

      // Fast forward to after deadline
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine");

      // Should complete verification with no completers
      await expect(
        commitmentPot.completeVerification(1)
      ).to.emit(commitmentPot, "RewardsDistributed")
        .withArgs(1, 0, 0);
    });
  });
});

