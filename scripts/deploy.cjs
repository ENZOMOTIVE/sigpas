const { ethers } = require("hardhat");

async function main() {
  // Get contract factory for MultiSigEducationalNFT
  const MultiSigEducationalNFT = await ethers.getContractFactory("MultiSigEducationalNFT");
  
  // Deploy contract
  const nft = await MultiSigEducationalNFT.deploy();
  
  // Wait for the contract to be deployed
  await nft.deploymentTransaction().wait(1);

  console.log("MultiSigEducationalNFT deployed to:", await nft.getAddress());

  // Grant roles to the appropriate addresses
  const issuerRole = await nft.ISSUER_ROLE();
  const validatorRole = await nft.VALIDATOR_ROLE();
  
  // Replace with actual addresses
  const issuerAddress = "0xe3F292F78B90127Ec3c90850c30388B13EfCFEbb";
  const validatorAddresses = [
    "0xe60C5088A04597869c243A4307957a2D2cbB9fcc",
    "0xaF9C1e58cb70c129ed7bB5dBF976Ee6a0F4dB213",
  ];

  // Grant roles
  await nft.grantRole(issuerRole, issuerAddress);
  for (const validator of validatorAddresses) {
    await nft.grantRole(validatorRole, validator);
  }

  console.log("Roles granted successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});