const hre = require("hardhat");

async function main() {
  const verifierAddress = "0xafca85162b0aBdd3CC59418b447E2cc7605Bd89f"

  const wallet = await hre.ethers.deployContract("Wallet", [verifierAddress]);

  await wallet.waitForDeployment();

  console.log(
    `wallet with deployed to ${wallet.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});