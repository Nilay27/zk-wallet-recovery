const hre = require("hardhat");

async function main() {
  const verifierAddress = "0xe89ed8d166c043Cc7753Da7eAcC87a07281cb057"

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