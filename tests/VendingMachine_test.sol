// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "remix_tests.sol"; 
import "../contracts/VendingMachine.sol";

contract TestVendingMachine {
    VendingMachine vendingMachine;
    address owner;
    uint constant INIT_VALUE = 5 ether;

    function beforeAll() public {
        owner = address(this);
        vendingMachine = new VendingMachine();
    }

    function testInitialState() public {
        Assert.equal(vendingMachine.owner(), owner, "Owner mismatch");
        Assert.equal(vendingMachine.getBalance(), 0, "Balance not zero");
    }

    /// #value: 5000000000000000000
    function testFundOperations() public payable {
        // Test deposit
        vendingMachine.addFunds{value: INIT_VALUE}();
        Assert.equal(vendingMachine.getBalance(), INIT_VALUE, "Deposit failed");

        // Test purchase
        ProductLibrary.Product[] memory products = vendingMachine.getAllProducts();
        uint initialBalance = vendingMachine.getBalance();
        vendingMachine.purchaseProduct(products[0].code);
        Assert.lesserThan(vendingMachine.getBalance(), initialBalance, "Purchase failed");
    }

    function testPurchaseConsumption() public {
        // Ensure purchase exists
        if (vendingMachine.getAllPurchases(owner).length == 0) {
            vendingMachine.addFunds{value: 1 ether}();
            vendingMachine.purchaseProduct("A1");
        }

        vendingMachine.consumePurchase(0);
        ProductLibrary.PurchaseInfo[] memory purchases = vendingMachine.getAllPurchases(owner);
        Assert.ok(purchases[0].consumed, "Not consumed");
    }
}