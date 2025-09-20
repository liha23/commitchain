const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment of Avalanche Commitment Platform contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy VerificationVoter
  console.log("\nDeploying VerificationVoter...");
  const VerificationVoter = await ethers.getContractFactory("VerificationVoter");
  const verificationVoter = await VerificationVoter.deploy();
  await verificationVoter.deployed();
  console.log("VerificationVoter deployed to:", verificationVoter.address);

  // Deploy MilestoneChecker
  console.log("\nDeploying MilestoneChecker...");
  const MilestoneChecker = await ethers.getContractFactory("MilestoneChecker");
  const milestoneChecker = await MilestoneChecker.deploy();
  await milestoneChecker.deployed();
  console.log("MilestoneChecker deployed to:", milestoneChecker.address);

  // Deploy CommitToken
  console.log("\nDeploying CommitToken...");
  const CommitToken = await ethers.getContractFactory("CommitToken");
  const commitToken = await CommitToken.deploy();
  await commitToken.deployed();
  console.log("CommitToken deployed to:", commitToken.address);

  // Deploy AchievementNFT
  console.log("\nDeploying AchievementNFT...");
  const AchievementNFT = await ethers.getContractFactory("AchievementNFT");
  const achievementNFT = await AchievementNFT.deploy("https://api.commitment-platform.com/metadata/");
  await achievementNFT.deployed();
  console.log("AchievementNFT deployed to:", achievementNFT.address);

  // Deploy OracleIntegration
  console.log("\nDeploying OracleIntegration...");
  const OracleIntegration = await ethers.getContractFactory("OracleIntegration");
  const oracleIntegration = await OracleIntegration.deploy();
  await oracleIntegration.deployed();
  console.log("OracleIntegration deployed to:", oracleIntegration.address);

  // Deploy CommitmentPot
  console.log("\nDeploying CommitmentPot...");
  const CommitmentPot = await ethers.getContractFactory("CommitmentPot");
  const commitmentPot = await CommitmentPot.deploy(
    verificationVoter.address,
    milestoneChecker.address,
    deployer.address // Fee recipient
  );
  await commitmentPot.deployed();
  console.log("CommitmentPot deployed to:", commitmentPot.address);

  // Set up contract relationships
  console.log("\nSetting up contract relationships...");

  // Set CommitmentPot in CommitToken
  await commitToken.setCommitmentPot(commitmentPot.address);
  console.log("Set CommitmentPot in CommitToken");

  // Set CommitmentPot in AchievementNFT
  await achievementNFT.setCommitmentPot(commitmentPot.address);
  console.log("Set CommitmentPot in AchievementNFT");

  // Set MilestoneChecker in OracleIntegration
  await oracleIntegration.setMilestoneChecker(milestoneChecker.address);
  console.log("Set MilestoneChecker in OracleIntegration");

  // Add authorized callers
  await oracleIntegration.addAuthorizedCaller(commitmentPot.address);
  console.log("Added CommitmentPot as authorized caller in OracleIntegration");

  // Add some achievement types
  console.log("\nAdding achievement types...");
  await achievementNFT.addAchievementType(
    "leetcode_master",
    "https://api.commitment-platform.com/metadata/leetcode_master"
  );
  await achievementNFT.addAchievementType(
    "github_warrior",
    "https://api.commitment-platform.com/metadata/github_warrior"
  );
  await achievementNFT.addAchievementType(
    "fitness_champion",
    "https://api.commitment-platform.com/metadata/fitness_champion"
  );
  await achievementNFT.addAchievementType(
    "study_legend",
    "https://api.commitment-platform.com/metadata/study_legend"
  );
  console.log("Added achievement types");

  // Set up oracle data sources (example configurations)
  console.log("\nSetting up oracle data sources...");
  await oracleIntegration.setDataSourceJob("leetcode", "job_id_leetcode", ethers.utils.parseEther("0.1"));
  await oracleIntegration.setDataSourceJob("github", "job_id_github", ethers.utils.parseEther("0.1"));
  await oracleIntegration.setDataSourceJob("fitness", "job_id_fitness", ethers.utils.parseEther("0.1"));
  console.log("Set up oracle data sources");

  // Save deployment info
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    contracts: {
      VerificationVoter: verificationVoter.address,
      MilestoneChecker: milestoneChecker.address,
      CommitToken: commitToken.address,
      AchievementNFT: achievementNFT.address,
      OracleIntegration: oracleIntegration.address,
      CommitmentPot: commitmentPot.address
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n=== Deployment Summary ===");
  console.log("Network:", deploymentInfo.network.name, "(" + deploymentInfo.network.chainId + ")");
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("\nContract Addresses:");
  Object.entries(deploymentInfo.contracts).forEach(([name, address]) => {
    console.log(`${name}: ${address}`);
  });

  // Save to file for frontend use
  const fs = require('fs');
  const path = require('path');
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const networkName = deploymentInfo.network.name === 'unknown' ? 'localhost' : deploymentInfo.network.name;
  const deploymentFile = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${deploymentFile}`);

  // Create environment file for frontend
  const envContent = `# Contract Addresses for ${networkName}
VITE_VERIFICATION_VOTER_ADDRESS=${verificationVoter.address}
VITE_MILESTONE_CHECKER_ADDRESS=${milestoneChecker.address}
VITE_COMMIT_TOKEN_ADDRESS=${commitToken.address}
VITE_ACHIEVEMENT_NFT_ADDRESS=${achievementNFT.address}
VITE_ORACLE_INTEGRATION_ADDRESS=${oracleIntegration.address}
VITE_COMMITMENT_POT_ADDRESS=${commitmentPot.address}
VITE_NETWORK_NAME=${networkName}
VITE_CHAIN_ID=${deploymentInfo.network.chainId}
`;

  const envFile = path.join(__dirname, '..', '..', 'frontend', '.env.local');
  fs.writeFileSync(envFile, envContent);
  console.log(`Frontend environment file created: ${envFile}`);

  console.log("\n=== Deployment Complete ===");
  console.log("All contracts deployed successfully!");
  console.log("Next steps:");
  console.log("1. Verify contracts on Snowtrace (if on Fuji/Mainnet)");
  console.log("2. Update frontend configuration");
  console.log("3. Test contract interactions");
  console.log("4. Deploy to mainnet when ready");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

