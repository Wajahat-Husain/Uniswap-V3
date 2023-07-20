const { ethers, run, network } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with the account: ${deployer.address}`);
  console.log("deploying...");

  const singleSwap = await ethers.getContractFactory("SingleSwap");
  const singleSwapContract = await singleSwap.deploy();
  await singleSwapContract.deployed();

  console.log(`Single Swap Contract deployed: ${singleSwapContract.address}`)
  
  if ( network.config.chainId === 5 && process.env.ETHEREUM_MAINET_API ) {

    console.log("Single Swap Contract verification...");
    await singleSwapContract.deployTransaction.wait(6);
    await verify(singleSwapContract.address, [])
    
  }

}

async function verify(contractAddress, args) {
  console.log("verifying contract....")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e)
    }
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// Deployed-Single-Swap-Contract-Address: '0x8eCeB4c54F81990d58462Ea0999a080659d60a86'