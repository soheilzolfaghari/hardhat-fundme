const { networkConfig, developmentChains } = require("../helper-hardhat-config")
//above can also be writen like this:
// const helperConfig = require("../helper-hardhat-config")
//const networkConfig = helperConfig.networkConfig
const { network } = require("hardhat")
//we can write our function like this:

// function deployFunc() {
//     console.log("hi")
// }
// module.exports.default = deployFunc

// but we can also write an anonymous async function and wrap it around module exports:

// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre
//     // this is how you can ALSO write it:
//     //hre.getNamedAccounts
//     //hre.deployments
// }

// But instead of doing it in 2 lines, we can do the whole thing in 1 line:

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("-----------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
