const hre = require("hardhat");

async function main() {
  const Groth16Verifier = await hre.ethers.deployContract("Groth16Verifier");

  await Groth16Verifier.waitForDeployment();

  console.log(
    `Groth16Verifier with deployed to ${Groth16Verifier.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});