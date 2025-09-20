const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VerificationVoter", function () {
  let verificationVoter;
  let owner;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    const VerificationVoter = await ethers.getContractFactory("VerificationVoter");
    verificationVoter = await VerificationVoter.deploy();
    await verificationVoter.deployed();
  });

  describe("Verification Process", function () {
    it("Should start verification process", async function () {
      const groupId = 1;
      const member = user1.address;
      const proofHash = "QmTestHash123";

      await expect(
        verificationVoter.startVerification(groupId, member, proofHash)
      ).to.emit(verificationVoter, "VerificationStarted")
        .withArgs(groupId, member, proofHash);

      const verification = await verificationVoter.getVerificationDetails(groupId, member);
      expect(verification.proofHash).to.equal(proofHash);
      expect(verification.isCompleted).to.be.false;
    });

    it("Should allow voting on verification", async function () {
      const groupId = 1;
      const member = user1.address;
      const proofHash = "QmTestHash123";

      // Start verification
      await verificationVoter.startVerification(groupId, member, proofHash);

      // Cast votes
      await verificationVoter.connect(user2).castVote(groupId, member, true);
      await verificationVoter.connect(user3).castVote(groupId, member, true);

      const verification = await verificationVoter.getVerificationDetails(groupId, member);
      expect(verification.votesFor).to.equal(2);
      expect(verification.votesAgainst).to.equal(0);
      expect(verification.totalVotes).to.equal(2);
    });

    it("Should complete verification when required votes are reached", async function () {
      const groupId = 1;
      const member = user1.address;
      const proofHash = "QmTestHash123";

      // Start verification
      await verificationVoter.startVerification(groupId, member, proofHash);

      // Cast required votes (3 votes for approval)
      await verificationVoter.connect(user2).castVote(groupId, member, true);
      await verificationVoter.connect(user3).castVote(groupId, member, true);
      await verificationVoter.connect(owner).castVote(groupId, member, true);

      const verification = await verificationVoter.getVerificationDetails(groupId, member);
      expect(verification.isCompleted).to.be.true;
      expect(verification.isApproved).to.be.true;
    });

    it("Should reject verification when majority votes against", async function () {
      const groupId = 1;
      const member = user1.address;
      const proofHash = "QmTestHash123";

      // Start verification
      await verificationVoter.startVerification(groupId, member, proofHash);

      // Cast votes (2 against, 1 for)
      await verificationVoter.connect(user2).castVote(groupId, member, false);
      await verificationVoter.connect(user3).castVote(groupId, member, false);
      await verificationVoter.connect(owner).castVote(groupId, member, true);

      const verification = await verificationVoter.getVerificationDetails(groupId, member);
      expect(verification.isCompleted).to.be.true;
      expect(verification.isApproved).to.be.false;
    });
  });

  describe("Dispute System", function () {
    it("Should allow raising disputes", async function () {
      const groupId = 1;
      const member = user1.address;
      const proofHash = "QmTestHash123";
      const reason = "Proof is not valid";

      // Start and complete verification
      await verificationVoter.startVerification(groupId, member, proofHash);
      await verificationVoter.connect(user2).castVote(groupId, member, true);
      await verificationVoter.connect(user3).castVote(groupId, member, true);
      await verificationVoter.connect(owner).castVote(groupId, member, true);

      // Raise dispute
      await expect(
        verificationVoter.connect(user2).raiseDispute(groupId, member, reason)
      ).to.emit(verificationVoter, "DisputeRaised")
        .withArgs(groupId, member, user2.address, reason);

      const disputes = await verificationVoter.getGroupDisputes(groupId);
      expect(disputes.length).to.equal(1);
      expect(disputes[0].reason).to.equal(reason);
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to update settings", async function () {
      await expect(
        verificationVoter.connect(user1).updateVotingDuration(86400)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await verificationVoter.updateVotingDuration(86400);
      // Settings should be updated
    });

    it("Should only allow owner to resolve disputes", async function () {
      const groupId = 1;
      const member = user1.address;
      const proofHash = "QmTestHash123";

      // Start verification and raise dispute
      await verificationVoter.startVerification(groupId, member, proofHash);
      await verificationVoter.connect(user2).raiseDispute(groupId, member, "Invalid proof");

      await expect(
        verificationVoter.connect(user1).resolveDispute(groupId, 0, true)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await verificationVoter.resolveDispute(groupId, 0, true);
      // Dispute should be resolved
    });
  });

  describe("Edge Cases", function () {
    it("Should prevent voting on own verification", async function () {
      const groupId = 1;
      const member = user1.address;
      const proofHash = "QmTestHash123";

      await verificationVoter.startVerification(groupId, member, proofHash);

      await expect(
        verificationVoter.connect(user1).castVote(groupId, member, true)
      ).to.be.revertedWith("Cannot vote on own verification");
    });

    it("Should prevent duplicate voting", async function () {
      const groupId = 1;
      const member = user1.address;
      const proofHash = "QmTestHash123";

      await verificationVoter.startVerification(groupId, member, proofHash);
      await verificationVoter.connect(user2).castVote(groupId, member, true);

      await expect(
        verificationVoter.connect(user2).castVote(groupId, member, false)
      ).to.be.revertedWith("Already voted");
    });

    it("Should prevent voting after deadline", async function () {
      const groupId = 1;
      const member = user1.address;
      const proofHash = "QmTestHash123";

      await verificationVoter.startVerification(groupId, member, proofHash);

      // Fast forward past voting deadline
      await ethers.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]); // 8 days
      await ethers.provider.send("evm_mine");

      await expect(
        verificationVoter.connect(user2).castVote(groupId, member, true)
      ).to.be.revertedWith("Voting period ended");
    });
  });
});

