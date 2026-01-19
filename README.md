# Flash Loan Arbitrage Bot

![Solidity](https://img.shields.io/badge/solidity-^0.8.10-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Strategy](https://img.shields.io/badge/strategy-arbitrage-orange)

## Overview

This repository contains a full-stack arbitrage solution. It leverages **Flash Loans** (uncollateralized borrowing) to exploit price discrepancies between Decentralized Exchanges (DEXs) without requiring the operator to own significant capital.

## How It Works

1.  **Scan**: The `arbitrage_scanner.js` script monitors prices on Uniswap V2 and Sushiswap.
2.  **Calculate**: It computes the potential profit spread.
3.  **Execute**: If profitable, it calls the `FlashBot` smart contract.
4.  **Flash Loan**: The contract borrows funds from Aave.
5.  **Trade**: It buys low on Exchange A and sells high on Exchange B.
6.  **Repay**: It repays the loan + premium to Aave and keeps the profit.

## Prerequisites

-   Ethereum Mainnet or Forked Goerli/Sepolia RPC (Infura/Alchemy)
-   Node.js v16+
-   `ETH` for gas fees (the loan principal is borrowed, but gas is paid).

## Setup & Run

```bash
# 1. Install Dependencies
npm install

# 2. Configure Environment
# Rename .env.example to .env and add RPC/Private Key

# 3. Deploy Contract
npx hardhat run deploy.js --network localhost

# 4. Start Scanner
node arbitrage_scanner.js
