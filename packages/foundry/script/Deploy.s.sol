//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {HelloWorldServiceManager, IServiceManager} from "../contracts/HelloWorldServiceManager.sol";
import "../contracts/ERC20Mock.sol";
import "./DeployHelpers.s.sol";

contract DeployScript is ScaffoldETHDeploy {
    error InvalidPrivateKey(string);

    function run() external {
        uint256 deployerPrivateKey = setupLocalhostEnv();
        if (deployerPrivateKey == 0) {
            revert InvalidPrivateKey(
                "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
            );
        }
        vm.startBroadcast(deployerPrivateKey);
        // ERC20Mock erc0Mock = new ERC20Mock(vm.addr(deployerPrivateKey)); // TODO: Wrong argument count for function call: 1 arguments given but expected 0.
        ERC20Mock erc0Mock = new ERC20Mock();
        console.logString(
            string.concat(
                "ERC20Mock deployed at: ",
                vm.toString(address(erc0Mock))
            )
        );
        vm.stopBroadcast();

        /**
         * This function generates the file containing the contracts Abi definitions.
         * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
         * This function should be called last.
         */
        exportDeployments();
    }

    function test() public {}
}
