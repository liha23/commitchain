const { ethers } = require("hardhat");

async function main() {
  console.log("Setting up contracts after deployment...");

  // Get contract addresses from deployment
  const deploymentInfo = require("../deployments/fuji.json");
  const contracts = deploymentInfo.contracts;

  // Get contract instances
  const CommitmentPot = await ethers.getContractAt("CommitmentPot", contracts.CommitmentPot);
  const VerificationVoter = await ethers.getContractAt("VerificationVoter", contracts.VerificationVoter);
  const MilestoneChecker = await ethers.getContractAt("MilestoneChecker", contracts.MilestoneChecker);
  const CommitToken = await ethers.getContractAt("CommitToken", contracts.CommitToken);
  const AchievementNFT = await ethers.getContractAt("AchievementNFT", contracts.AchievementNFT);
  const OracleIntegration = await ethers.getContractAt("OracleIntegration", contracts.OracleIntegration);

  console.log("Setting up contract relationships...");

  try {
    // Set up CommitmentPot relationships
    console.log("Setting up CommitmentPot...");
    await CommitmentPot.setCommitmentPot(contracts.CommitmentPot);
    console.log("✅ Set CommitmentPot in CommitToken");

    await AchievementNFT.setCommitmentPot(contracts.CommitmentPot);
    console.log("✅ Set CommitmentPot in AchievementNFT");

    // Set up OracleIntegration
    console.log("Setting up OracleIntegration...");
    await OracleIntegration.setMilestoneChecker(contracts.MilestoneChecker);
    console.log("✅ Set MilestoneChecker in OracleIntegration");

    await OracleIntegration.addAuthorizedCaller(contracts.CommitmentPot);
    console.log("✅ Added CommitmentPot as authorized caller");

    // Add achievement types
    console.log("Adding achievement types...");
    const achievementTypes = [
      {
        type: "leetcode_master",
        uri: "https://api.commitment-platform.com/metadata/leetcode_master"
      },
      {
        type: "github_warrior", 
        uri: "https://api.commitment-platform.com/metadata/github_warrior"
      },
      {
        type: "fitness_champion",
        uri: "https://api.commitment-platform.com/metadata/fitness_champion"
      },
      {
        type: "study_legend",
        uri: "https://api.commitment-platform.com/metadata/study_legend"
      },
      {
        type: "crypto_trader",
        uri: "https://api.commitment-platform.com/metadata/crypto_trader"
      }
    ];

    for (const achievementType of achievementTypes) {
      await AchievementNFT.addAchievementType(achievementType.type, achievementType.uri);
      console.log(`✅ Added achievement type: ${achievementType.type}`);
    }

    // Set up oracle data sources
    console.log("Setting up oracle data sources...");
    const dataSources = [
      {
        source: "leetcode",
        jobId: "job_id_leetcode",
        fee: ethers.utils.parseEther("0.1")
      },
      {
        source: "github",
        jobId: "job_id_github", 
        fee: ethers.utils.parseEther("0.1")
      },
      {
        source: "fitness",
        jobId: "job_id_fitness",
        fee: ethers.utils.parseEther("0.1")
      }
    ];

    for (const dataSource of dataSources) {
      await OracleIntegration.setDataSourceJob(dataSource.source, dataSource.jobId, dataSource.fee);
      console.log(`✅ Set up oracle data source: ${dataSource.source}`);
    }

    // Configure verification settings
    console.log("Configuring verification settings...");
    await VerificationVoter.updateVotingDuration(7 * 24 * 60 * 60); // 7 days
    await VerificationVoter.updateRequiredVotes(3);
    await VerificationVoter.updateApprovalThreshold(66); // 66%
    console.log("✅ Configured verification settings");

    console.log("\n=== Setup Complete ===");
    console.log("All contracts have been configured and are ready to use!");

  } catch (error) {
    console.error("Setup failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Setup failed:", error);
    process.exit(1);
  });

