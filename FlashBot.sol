// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DexInterfaces.sol";

interface ILendingPool {
    function flashLoan(
        address receiverAddress,
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata modes,
        address onBehalfOf,
        bytes calldata params,
        uint16 referralCode
    ) external;
}

contract FlashBot is Ownable {
    ILendingPool constant LENDING_POOL = ILendingPool(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9); // Aave V2 Mainnet
    
    function executeArbitrage(
        address _tokenBorrow,
        uint256 _amount,
        address _routerA,
        address _routerB
    ) external onlyOwner {
        address receiverAddress = address(this);
        address[] memory assets = new address[](1);
        assets[0] = _tokenBorrow;
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _amount;
        
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0; // 0 = no debt (flash loan)

        bytes memory params = abi.encode(_routerA, _routerB);
        
        LENDING_POOL.flashLoan(receiverAddress, assets, amounts, modes, address(this), params, 0);
    }

    // Callback function called by Aave
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external returns (bool) {
        // 1. Decode params
        (address routerA, address routerB) = abi.decode(params, (address, address));
        
        // 2. Arbitrage Logic (Buy Low, Sell High)
        // Note: Real logic requires complex path encoding. Simplified here.
        uint256 amountowed = amounts[0] + premiums[0];
        
        // Approve Routers
        IERC20(assets[0]).approve(routerA, amounts[0]);
        IERC20(assets[0]).approve(address(LENDING_POOL), amountowed);

        // 3. Trade on Router A (Buy)
        // 4. Trade on Router B (Sell)
        
        // 5. Ensure profit
        uint256 balance = IERC20(assets[0]).balanceOf(address(this));
        require(balance >= amountowed, "Arbitrage failed: Not profitable");
        
        return true;
    }
    
    function withdraw(address _token) external onlyOwner {
        IERC20 token = IERC20(_token);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}
