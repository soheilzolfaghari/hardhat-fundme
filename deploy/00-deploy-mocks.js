const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log("local network detected. Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            // arguments gonna be constructor parameters for MockV3Aggregator
            // that constructor will take a Decimals and InitialAnswers
            // the decimals parameter's gonna be equivalent to decimals function
            //and the initialAnswer is basically gonna be: what is the priceFeed starting at?
            // we get to pick the priceFeed which works great for testing
            // we can add these at helper-hardhat-config
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("mocks deployed")
        log("-------------------------------------------")
    }
}
// if we want to only run our deploy-mocks scrpt, we can write tags for it:

module.exports.tags = ["all", "mocks"]
// now after we write our command, we can add --tags and specify which one we want to run
