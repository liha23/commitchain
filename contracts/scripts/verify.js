const { ethers } = require("hardhat");

async function main() {
  console.log("Starting contract verification...");

  // Get contract addresses from deployment
  const deploymentInfo = require("../deployments/fuji.json");
  const contracts = deploymentInfo.contracts;

  // Verification parameters
  const verificationParams = {
    CommitmentPot: {
      constructorArguments: [
        contracts.VerificationVoter,
        contracts.MilestoneChecker,
        deploymentInfo.deployer
      ]
    },
    VerificationVoter: {
      constructorArguments: []
    },
    MilestoneChecker: {
      constructorArguments: []
    },
    CommitToken: {
      constructorArguments: []
    },
    AchievementNFT: {
      constructorArguments: ["https://api.commitment-platform.com/metadata/"]
    },
    OracleIntegration: {
      constructorArguments: []
    }
  };

  // Verify each contract
  for (const [contractName, address] of Object.entries(contracts)) {
    try {
      console.log(`\nVerifying ${contractName} at ${address}...`);
      
      const params = verificationParams[contractName];
      if (params) {
        await hre.run("verify:verify", {
          address: address,
          constructorArguments: params.constructorArguments,
        });
        console.log(`✅ ${contractName} verified successfully`);
      } else {
        console.log(`⚠️  No verification parameters found for ${contractName}`);
      }
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log(`✅ ${contractName} already verified`);
      } else {
        console.error(`❌ Failed to verify ${contractName}:`, error.message);
      }
    }
  }

  console.log("\n=== Verification Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Verification failed:", error);
    process.exit(1);
  });

