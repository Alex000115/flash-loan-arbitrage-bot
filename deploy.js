const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("Deploying FlashBot...");

    const FlashBot = await ethers.getContractFactory("FlashBot");
    const flashBot = await FlashBot.deploy();
    
    await flashBot.waitForDeployment();
    
    const address = await flashBot.getAddress();
    console.log(`FlashBot deployed to: ${address}`);

    // Update config
    let config = `module.exports = { BOT_ADDRESS: "${address}" };`;
    fs.writeFileSync("bot_config.js", config);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
