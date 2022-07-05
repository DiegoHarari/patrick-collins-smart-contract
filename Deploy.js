const ethers = require("ethers")

// This package is required in order to read from the BIN and ABI files
const fs = require("fs-extra")

// This is what protects your PRIVATE KEY
require("dotenv").config()

async function main() {
    //http://127.0.0.1:7545
    // For our script to connect to the blockchain. In this case the Ganache local blockchain
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

    const encryptedJson = fs.readFileSync("./.encryptedJsonKey.json", "utf8")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    )
    wallet = await wallet.connect(provider)

    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    )
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )

    // To deploy the contract
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying Contract")
    const contract = await contractFactory.deploy({ gasLimit: 6721975 })
    await contract.deployTransaction.wait(1)

    console.log(`Contract Address: ${contract.address}`)

    // ## Retrieve Button .. Just like in Remix .. to see data ##
    const currentFavoriteNumber = await contract.retrieve()
    console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`)

    // ## 'Update Number' ... Just like in Remix ... to update the data ##
    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`Updated Favorite Number is: ${updatedFavoriteNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
