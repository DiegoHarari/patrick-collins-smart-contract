const ethers = require("ethers");
const fs = require("fs-extra");
const env = require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);
  const currentFavNumber = await contract.retrieve();
  console.log(currentFavNumber.toString());
  const transactionResponse = await contract.store("7");
  console.log(transactionResponse.toString());
}

main().then(() => process.exit(0));
