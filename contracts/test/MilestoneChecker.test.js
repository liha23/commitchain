const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MilestoneChecker", function () {
  let milestoneChecker;
  let owner;
  let user1;
  let user2;
  let authorizedOracle;

  beforeEach(async function () {
    [owner, user1, user2, authorizedOracle] = await ethers.getSigners();

    const MilestoneChecker = await ethers.getContractFactory("MilestoneChecker");
    milestoneChecker = await MilestoneChecker.deploy();
    await milestoneChecker.deployed();

    // Add authorized oracle
    await milestoneChecker.addAuthorizedOracle(authorizedOracle.address);
  });

  describe("Milestone Management", function () {
    it("Should set milestone for user", async function () {
      const groupId = 1;
      const member = user1.address;
      const milestoneIndex = 0;
      const target = 100;
      const milestoneType = 0; // MANUAL
      const dataSource = "manual";

      await expect(
        milestoneChecker.setMilestone(groupId, member, milestoneIndex, target, milestoneType, dataSource)
      ).to.emit(milestoneChecker, "MilestoneSet")
        .withArgs(groupId, member, milestoneIndex, target);

      const milestone = await milestoneChecker.getMilestoneDetails(groupId, member, milestoneIndex);
      expect(milestone.target).to.equal(target);
      expect(milestone.milestoneType).to.equal(milestoneType);
      expect(milestone.dataSource).to.equal(dataSource);
    });

    it("Should submit manual proof for milestone", async function () {
      const groupId = 1;
      const member = user1.address;
      const milestoneIndex = 0;
      const target = 100;
      const proofHash = "QmMilestoneProof123";

      // Set milestone
      await milestoneChecker.setMilestone(groupId, member, milestoneIndex, target, 0, "manual");

      // Submit proof
      await expect(
        milestoneChecker.submitMilestoneProof(groupId, member, milestoneIndex, proofHash)
      ).to.emit(milestoneChecker, "MilestoneReached")
        .withArgs(groupId, member, milestoneIndex, target);

      const milestone = await milestoneChecker.getMilestoneDetails(groupId, member, milestoneIndex);
      expect(milestone.isReached).to.be.true;
      expect(milestone.proofHash).to.equal(proofHash);
    });

    it("Should update milestone progress via oracle", async function () {
      const groupId = 1;
      const member = user1.address;
      const milestoneIndex = 0;
      const target = 100;
      const actual = 75;

      // Set milestone
      await milestoneChecker.setMilestone(groupId, member, milestoneIndex, target, 1, "oracle"); // ORACLE

      // Update progress
      await milestoneChecker.connect(authorizedOracle).updateMilestoneProgress(groupId, member, milestoneIndex, actual);

      const milestone = await milestoneChecker.getMilestoneDetails(groupId, member, milestoneIndex);
      expect(milestone.actual).to.equal(actual);
      expect(milestone.isReached).to.be.false; // Not reached yet
    });

    it("Should mark milestone as reached when target is achieved", async function () {
      const groupId = 1;
      const member = user1.address;
      const milestoneIndex = 0;
      const target = 100;
      const actual = 100;

      // Set milestone
      await milestoneChecker.setMilestone(groupId, member, milestoneIndex, target, 1, "oracle");

      // Update progress to reach target
      await expect(
        milestoneChecker.connect(authorizedOracle).updateMilestoneProgress(groupId, member, milestoneIndex, actual)
      ).to.emit(milestoneChecker, "MilestoneReached")
        .withArgs(groupId, member, milestoneIndex, actual);

      const milestone = await milestoneChecker.getMilestoneDetails(groupId, member, milestoneIndex);
      expect(milestone.isReached).to.be.true;
      expect(milestone.actual).to.equal(actual);
    });
  });

  describe("Progress Tracking", function () {
    it("Should calculate progress percentage correctly", async function () {
      const groupId = 1;
      const member = user1.address;
      const milestoneIndex = 0;
      const target = 100;
      const actual = 75;

      // Set milestone
      await milestoneChecker.setMilestone(groupId, member, milestoneIndex, target, 1, "oracle");

      // Update progress
      await milestoneChecker.connect(authorizedOracle).updateMilestoneProgress(groupId, member, milestoneIndex, actual);

      const progress = await milestoneChecker.getMilestoneProgress(groupId, member, milestoneIndex);
      expect(progress).to.equal(75); // 75%
    });

    it("Should return 0 progress for unset milestone", async function () {
      const groupId = 1;
      const member = user1.address;
      const milestoneIndex = 0;

      const progress = await milestoneChecker.getMilestoneProgress(groupId, member, milestoneIndex);
      expect(progress).to.equal(0);
    });
  });

  describe("Batch Operations", function () {
    it("Should batch update milestones for multiple users", async function () {
      const groupId = 1;
      const members = [user1.address, user2.address];
      const milestoneIndex = 0;
      const actuals = [50, 75];

      // Set milestones for both users
      await milestoneChecker.setMilestone(groupId, user1.address, milestoneIndex, 100, 1, "oracle");
      await milestoneChecker.setMilestone(groupId, user2.address, milestoneIndex, 100, 1, "oracle");

      // Batch update
      await milestoneChecker.connect(authorizedOracle).batchUpdateMilestones(groupId, members, milestoneIndex, actuals);

      const milestone1 = await milestoneChecker.getMilestoneDetails(groupId, user1.address, milestoneIndex);
      const milestone2 = await milestoneChecker.getMilestoneDetails(groupId, user2.address, milestoneIndex);

      expect(milestone1.actual).to.equal(50);
      expect(milestone2.actual).to.equal(75);
    });
  });

  describe("Access Control", function () {
    it("Should only allow authorized oracles to update progress", async function () {
      const groupId = 1;
      const member = user1.address;
      const milestoneIndex = 0;
      const target = 100;
      const actual = 75;

      // Set milestone
      await milestoneChecker.setMilestone(groupId, member, milestoneIndex, target, 1, "oracle");

      // Try to update with unauthorized account
      await expect(
        milestoneChecker.connect(user1).updateMilestoneProgress(groupId, member, milestoneIndex, actual)
      ).to.be.revertedWith("Not authorized oracle");

      // Update with authorized oracle should work
      await milestoneChecker.connect(authorizedOracle).updateMilestoneProgress(groupId, member, milestoneIndex, actual);
    });

    it("Should only allow owner to add/remove authorized oracles", async function () {
      await expect(
        milestoneChecker.connect(user1).addAuthorizedOracle(user2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await milestoneChecker.addAuthorizedOracle(user2.address);
      // Oracle should be added
    });

    it("Should only allow owner to set oracle addresses", async function () {
      await expect(
        milestoneChecker.connect(user1).setOracleAddress("test", user2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await milestoneChecker.setOracleAddress("test", user2.address);
      // Oracle address should be set
    });
  });

  describe("Edge Cases", function () {
    it("Should prevent setting milestone with zero target", async function () {
      const groupId = 1;
      const member = user1.address;
      const milestoneIndex = 0;
      const target = 0;

      await expect(
        milestoneChecker.setMilestone(groupId, member, milestoneIndex, target, 0, "manual")
      ).to.be.revertedWith("Target must be greater than 0");
    });

    it("Should prevent submitting proof for unset milestone", async function () {
      const groupId = 1;
      const member = user1.address;
      const milestoneIndex = 0;
      const proofHash = "QmProof123";

      await expect(
        milestoneChecker.submitMilestoneProof(groupId, member, milestoneIndex, proofHash)
      ).to.be.revertedWith("Milestone not set");
    });

    it("Should prevent submitting proof for already reached milestone", async function () {
      const groupId = 1;
      const member = user1.address;
      const milestoneIndex = 0;
      const target = 100;
      const proofHash = "QmProof123";

      // Set and reach milestone
      await milestoneChecker.setMilestone(groupId, member, milestoneIndex, target, 0, "manual");
      await milestoneChecker.submitMilestoneProof(groupId, member, milestoneIndex, proofHash);

      // Try to submit proof again
      await expect(
        milestoneChecker.submitMilestoneProof(groupId, member, milestoneIndex, "QmProof456")
      ).to.be.revertedWith("Milestone already reached");
    });
  });
});

