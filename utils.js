const { ethers } = require("ethers");

function calculateGasCost(gasPrice, gasLimit) {
    return ethers.formatEther(gasPrice * gasLimit);
}

function toBigInt(amount) {
    return ethers.parseEther(amount.toString());
}

module.exports = { calculateGasCost, toBigInt };
