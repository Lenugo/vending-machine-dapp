// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract VendingMachine {
    address owner;

    function sayHello() external pure returns (string memory) {
        return "hello, world";
    }
}