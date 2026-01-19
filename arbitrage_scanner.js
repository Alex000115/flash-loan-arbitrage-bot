const { ethers } = require("ethers");
const config = require("./bot_config");
require("dotenv").config();

// Provider & Wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Addresses
const UNISWAP_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const SUSHISWAP_ROUTER = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

async function checkPrice(amountIn) {
    // Logic to check rates on both DEXs
    console.log(`Scanning block ${await provider.getBlockNumber()}...`);
    
    // In a real scenario, we call getAmountsOut on both routers
    // For this demo, we simulate a finding
    const randomSpread = Math.random();
    
    if (randomSpread > 0.95) {
        console.log("!!! PROFITABLE SPREAD FOUND !!!");
        console.log("Executing Flash Loan...");
        await executeTrade(amountIn);
    } else {
        console.log("No spread found. Waiting...");
    }
}

async function executeTrade(amount) {
    const contract = new ethers.Contract(
        config.BOT_ADDRESS, 
        require("./artifacts/FlashBot.sol/FlashBot.json").abi, 
        wallet
    );
    
    try {
        const tx = await contract.executeArbitrage(
            WETH, 
            ethers.parseEther("10"), // Borrow 10 ETH
            UNISWAP_ROUTER, 
            SUSHISWAP_ROUTER
        );
        console.log(`Transaction submitted: ${tx.hash}`);
    } catch (e) {
        console.error("Execution Reverted:", e.message);
    }
}

// Run loop
setInterval(() => {
    checkPrice(ethers.parseEther("1"));
}, 12000); // Check every block (approx 12s)
