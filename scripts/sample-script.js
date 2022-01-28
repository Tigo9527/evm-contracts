// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
    const {ethers:{provider}} = hre
    const [{address: addr}] = (await hre.ethers.getSigners())
    const b = await provider.getBalance(addr)
    console.log(` balance of ${addr} is ${b}`)
    const st = await hre.ethers.provider.getNetwork()
    console.log(`--------- name ${st.name} , chain id ${st.chainId}`)

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();
  async function call(n) {
      await (await greeter.setGreeting("1")).wait().then(() => {
          console.log(`it's ok. ${n}.`)
          process.exit(0)
      }).catch(err=>{
          console.log(`fail at ${n}.`, err)
          return new Promise(r=>setTimeout(r, 5000))
      })
  }
  await call(1)
  await call(2)

  console.log("Greeter deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
