// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ProductLibrary.sol";

contract VendingMachine {
    address owner;
    bool private locked;

    ProductLibrary.Product[] private products;
    mapping(address => uint) private balances;
    ProductLibrary.Purchase[] private purchases;

    string private constant IPFS_REFERENCE = "QmfRFRaboP3M48eexvnQkiwgUDPaPHJiFnDcKcuEuLBbf1/";
    uint256 private constant GWEI_MULTIPLIER = 10**8;
    uint256 private constant SMALL_GWEI_MULTIPLIER = 10**7;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier noReentrant() {
        require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        owner = msg.sender;
        initializeProducts();
    }

    function concatIPFSReference (string memory _key) pure  private returns (string memory) {
        return string.concat(IPFS_REFERENCE, _key);
    }

    function initializeProducts() private {
        products.push(ProductLibrary.Product("A1", 15 * GWEI_MULTIPLIER, "Lays", concatIPFSReference("lays.png")));
        products.push(ProductLibrary.Product("A2", 175 * SMALL_GWEI_MULTIPLIER, "Coca Cola", concatIPFSReference("coca-cola.png")));
        products.push(ProductLibrary.Product("A3", 15 * GWEI_MULTIPLIER, "Pringles", concatIPFSReference("pringles.png")));
        products.push(ProductLibrary.Product("A4", 175 * SMALL_GWEI_MULTIPLIER, "Water", concatIPFSReference("water.png")));
        products.push(ProductLibrary.Product("A5", 15 * GWEI_MULTIPLIER, "Energy Drink", concatIPFSReference("red-bull.png")));
        products.push(ProductLibrary.Product("B1", 20 * GWEI_MULTIPLIER, "Sandwich", concatIPFSReference("sandwich.png")));
        products.push(ProductLibrary.Product("B2", 175 * SMALL_GWEI_MULTIPLIER, "Oreo", concatIPFSReference("oreo.png")));
        products.push(ProductLibrary.Product("B3", 15 * GWEI_MULTIPLIER, "Sprite", concatIPFSReference("sprite.png")));
        products.push(ProductLibrary.Product("B4", 175 * SMALL_GWEI_MULTIPLIER, "Granola Bar", concatIPFSReference("granola-bar.png")));
        products.push(ProductLibrary.Product("B5", 175 * SMALL_GWEI_MULTIPLIER, "Doritos", concatIPFSReference("doritos.png")));
        products.push(ProductLibrary.Product("C1", 15 * GWEI_MULTIPLIER, "Snicker Bar", concatIPFSReference("snickers.png")));
        products.push(ProductLibrary.Product("C2", 15 * GWEI_MULTIPLIER, "M&Ms", concatIPFSReference("m&ms.png")));
        products.push(ProductLibrary.Product("C3", 125 * SMALL_GWEI_MULTIPLIER, "Bubble Tap Gum", concatIPFSReference("bubble-tap.png")));
        products.push(ProductLibrary.Product("C4", 175 * SMALL_GWEI_MULTIPLIER, "Fruit Nut Bar", concatIPFSReference("fruit-nut.png")));
        products.push(ProductLibrary.Product("C5", 175 * SMALL_GWEI_MULTIPLIER, "Beef Jerky", concatIPFSReference("beef-jerky.png")));
        products.push(ProductLibrary.Product("D1", 125 * SMALL_GWEI_MULTIPLIER, "KitKat Biscuit", concatIPFSReference("kitkat.png")));
        products.push(ProductLibrary.Product("D2", 125 * SMALL_GWEI_MULTIPLIER, "Pop Corn", concatIPFSReference("popcorn.png")));
        products.push(ProductLibrary.Product("D3", 150 * SMALL_GWEI_MULTIPLIER, "Twix Bar", concatIPFSReference("twix.png")));
        products.push(ProductLibrary.Product("D4", 125 * SMALL_GWEI_MULTIPLIER, "Donut", concatIPFSReference("donut.png")));
        products.push(ProductLibrary.Product("D5", 125 * SMALL_GWEI_MULTIPLIER, "Red Apple", concatIPFSReference("apple.png")));
    }

    function getProductByCode(string memory _productId) private view returns (ProductLibrary.Product memory) {
         for (uint i = 0; i < products.length; i++) {
            if (keccak256(abi.encodePacked(products[i].code)) == keccak256(abi.encodePacked(_productId))) {
                return products[i]; 
            }
        }
        revert("Product not found");
    }

    function getAllProducts() public view returns (ProductLibrary.Product[] memory) {
        return products;
    }

    function addFunds() public payable {
        require(msg.value > 0, "Missing required amount");
        balances[msg.sender] += msg.value;
    }

    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
    
    function purchaseProduct(string memory _productId) public {
        uint productPrice = getProductByCode(_productId).price;
        require(balances[msg.sender] >= productPrice, "Insufficient funds");

        balances[msg.sender] -= productPrice;
        purchases.push(ProductLibrary.Purchase(msg.sender, _productId, block.timestamp, ProductLibrary.PurchaseStatus.Available));
    }

    function consumePurchase(uint _purchaseIndex) public {
        require(_purchaseIndex < purchases.length, "Invalid purchase index");
        require(purchases[_purchaseIndex].buyer == msg.sender, "Not your purchase");
        require(purchases[_purchaseIndex].status == ProductLibrary.PurchaseStatus.Available, "Purchase already consumed");

        purchases[_purchaseIndex].status = ProductLibrary.PurchaseStatus.Consumed;
    }

    function getPurchasesByStatus(address _buyer, ProductLibrary.PurchaseStatus _status) public view returns (ProductLibrary.PurchaseInfo[] memory) {
        uint count = 0;
        for (uint i = 0; i < purchases.length; i++) {
            if (purchases[i].buyer == _buyer && purchases[i].status == _status) {
                count++;
            }
        }

        ProductLibrary.PurchaseInfo[] memory result = new ProductLibrary.PurchaseInfo[](count);
        uint index = 0;
        for (uint i = 0; i < purchases.length; i++) {
            if (purchases[i].buyer == _buyer && purchases[i].status == _status) {
                ProductLibrary.Product memory product = getProductByCode(purchases[i].productId);
                result[index] = ProductLibrary.PurchaseInfo({
                    id: i,
                    name: product.name,
                    image: product.imageCID,
                    price: product.price,
                    purchaseDate: purchases[i].timestamp,
                    consumed: _status == ProductLibrary.PurchaseStatus.Consumed
                });
                index++;
            }
        }
        return result;
    }

    function withdraw() public onlyOwner noReentrant {
        uint amount = balances[msg.sender];
        require(amount > 0, "You do not have any balance.");
        balances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed.");
    }
}