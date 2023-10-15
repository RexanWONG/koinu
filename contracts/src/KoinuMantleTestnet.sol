// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {AxelarExecutable} from '@axelar-network-axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';
import {IAxelarGateway} from '@axelar-network-axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import {IERC20} from '@axelar-network-axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol';
import {IAxelarGasService} from '@axelar-network-axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';

contract KoinuMantleTestnet is AxelarExecutable {
    IAxelarGasService public immutable gasService;

    constructor(address gateway_, address gasReceiver_) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
    }

    function sendToDifferentChain(
        string memory destinationChain,
        string memory destinationContractAddress,
        string memory symbol, 
        uint256 amount
    ) external payable {
        // Require a gas payment for the transaction
        require(msg.value > 0, 'Gas payment is required');

        // Get the token address associated with the provided symbol
        address tokenAddress = gateway.tokenAddresses(symbol);

        // Transfer tokens from sender to this contract
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);

        // Approve the gateway to spend tokens on behalf of this contract
        IERC20(tokenAddress).approve(address(gateway), amount);

        // Encode the recipient addresses into a payload
        bytes memory payload = abi.encode(msg.sender);

        // Pay for native gas using the gas service contract
        gasService.payNativeGasForContractCallWithToken{value: msg.value}(
            address(this),
            destinationChain,
            destinationContractAddress,
            payload,
            symbol,
            amount,
            msg.sender
        );

        // Initiate a contract call on the gateway
        gateway.callContractWithToken(
            destinationChain,
            destinationContractAddress,
            payload,
            symbol,
            amount
        );
    }

    function _executeWithToken(
        string calldata,
        string calldata,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal override {
        // Decode the payload to get the recipient addresses
        address recipient = abi.decode(payload, (address));

        // Get the token address associated with the provided symbol
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);

        // Transfer tokens to recipient
        IERC20(tokenAddress).transfer(recipient, amount);
    }
}
