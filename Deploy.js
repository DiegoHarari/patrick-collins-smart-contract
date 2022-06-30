const ethers = require("ethers")
const fs = require("fs-extra")
const env = require("dotenv").config()

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const encryptedJson = fs.readFileSync("./.encryptedJsonKey.json")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    )
    console.log(wallet)
    wallet = await wallet.connect(provider)
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "uctf8"
    )
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    const contract = await contractFactory.deploy()
    await contract.deployTransaction.wait(1)
    const currentFavNumber = await contract.retrieve()
    const transactionResponse = await contract.store("7")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
