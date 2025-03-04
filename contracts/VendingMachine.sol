// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract VendingMachine {
    address owner;
    enum PurchaseStatus { Available, Consumed }

    struct Product {
        string code;
        uint price; // Price in wei (e.g., 1.5 ether = 1500000000000000000 wei)
        string name;
    }

    struct Purchase {
        address buyer;
        string productId;
        uint timestamp;
        PurchaseStatus status;
    }

    Product[] private products;
    mapping(address => uint) private balances;
    Purchase[] private purchases;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        products.push(Product("A1", 1500000000000000000, "Lays"));
        products.push(Product("A2", 1750000000000000000, "Coca Cola"));
        products.push(Product("A3", 1500000000000000000, "Pringles"));
        products.push(Product("A4", 1750000000000000000, "Water"));
        products.push(Product("A5", 1500000000000000000, "Energy Drink"));
        products.push(Product("B1", 2000000000000000000, "Sandwich"));
        products.push(Product("B2", 1750000000000000000, "Oreo"));
        products.push(Product("B3", 1500000000000000000, "Sprite"));
        products.push(Product("B4", 1750000000000000000, "Granola Bar"));
        products.push(Product("B5", 1750000000000000000, "Doritos"));
        products.push(Product("C1", 1500000000000000000, "Snicker Bar"));
        products.push(Product("C2", 1500000000000000000, "M&Ms"));
        products.push(Product("C3", 1250000000000000000, "Bubble Tap Gum"));
        products.push(Product("C4", 1750000000000000000, "Fruit Nut Bar"));
        products.push(Product("C5", 1750000000000000000, "Beef Jerky"));
        products.push(Product("D1", 1250000000000000000, "KitKat Biscuit"));
        products.push(Product("D2", 1250000000000000000, "Pop Corn"));
        products.push(Product("D3", 1500000000000000000, "Twix Bar"));
        products.push(Product("D4", 1250000000000000000, "Donut"));
        products.push(Product("D5", 1250000000000000000, "Red Apple"));
    }

    function getProductByCode(string memory _productId) public view returns (Product memory) {
         for (uint i = 0; i < products.length; i++) {
            if (keccak256(abi.encodePacked(products[i].code)) == keccak256(abi.encodePacked(_productId))) {
                return products[i]; 
            }
        }
        revert("Product not found");
    }

    function getAllProducts() public view returns (Product[] memory) {
        return products;
    }

    function addFunds() public onlyOwner payable {
        require(msg.value > 0, "Missing required amount");
        balances[msg.sender] += msg.value;
    }

    function getBalance() public view onlyOwner returns (uint) {
        return balances[msg.sender];
    }
    
    function purchaseProduct(string memory _productId) public onlyOwner {
        uint productPrice = getProductByCode(_productId).price;
        require(balances[msg.sender] >= productPrice, "Insufficient funds");

        balances[msg.sender] -= productPrice;
        purchases.push(Purchase(msg.sender, _productId, block.timestamp, PurchaseStatus.Available));
    }

    function getPurchases(address _buyer) public view onlyOwner returns (Purchase[] memory) {
        Purchase[] memory userPurchases = new Purchase[](purchases.length);
        uint count = 0;
        for (uint i = 0; i < purchases.length; i++) {
            if (purchases[i].buyer == _buyer) {
                userPurchases[count] = purchases[i];
                count++;
            }
        }
        Purchase[] memory result = new Purchase[](count);
        for(uint i = 0; i < count; i++){
            result[i] = userPurchases[i];
        }
        return result;
    }

    function consumePurchase(uint _purchaseIndex) public onlyOwner {
        require(_purchaseIndex < purchases.length, "Invalid purchase index");
        require(purchases[_purchaseIndex].buyer == msg.sender, "Not your purchase");
        require(purchases[_purchaseIndex].status == PurchaseStatus.Available, "Purchase already consumed");

        purchases[_purchaseIndex].status = PurchaseStatus.Consumed;
    }

    function getAvailablePurchases(address _buyer) public view onlyOwner returns (Purchase[] memory) {
        Purchase[] memory availablePurchases = new Purchase[](purchases.length);
        uint count = 0;
        for (uint i = 0; i < purchases.length; i++) {
            if (purchases[i].buyer == _buyer && purchases[i].status == PurchaseStatus.Available) {
                availablePurchases[count] = purchases[i];
                count++;
            }
        }
        Purchase[] memory result = new Purchase[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = availablePurchases[i];
        }
        return result;
    }

    function getConsumedPurchases(address _buyer) public view onlyOwner returns (Purchase[] memory) {
        Purchase[] memory consumedPurchases = new Purchase[](purchases.length);
        uint count = 0;
        for (uint i = 0; i < purchases.length; i++) {
            if (purchases[i].buyer == _buyer && purchases[i].status == PurchaseStatus.Consumed) {
                consumedPurchases[count] = purchases[i];
                count++;
            }
        }
        Purchase[] memory result = new Purchase[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = consumedPurchases[i];
        }
        return result;
    }
}