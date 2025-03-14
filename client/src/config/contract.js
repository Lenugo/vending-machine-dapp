// Etherscan address: https://sepolia.etherscan.io/tx/0x4b4d14a9ad3629b16d547e2bc207507d99afeccda7b0533e58f35b8e85e6b047
export const imageGateway = 'https://thundering-black-zebra.myfilebase.com/ipfs/';
export const CONTRACT_ADDRESS = '0x38b7A06C783bDd1cD3d88FFd91EbB5019E8f773b';

export const CONTRACT_ABI = [
	{
		"inputs": [],
		"name": "addFunds",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_purchaseIndex",
				"type": "uint256"
			}
		],
		"name": "consumePurchase",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_productId",
				"type": "string"
			}
		],
		"name": "purchaseProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllProducts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "code",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imageCID",
						"type": "string"
					}
				],
				"internalType": "struct ProductLibrary.Product[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_buyer",
				"type": "address"
			},
			{
				"internalType": "enum ProductLibrary.PurchaseStatus",
				"name": "_status",
				"type": "uint8"
			}
		],
		"name": "getPurchasesByStatus",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "image",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "purchaseDate",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "consumed",
						"type": "bool"
					}
				],
				"internalType": "struct ProductLibrary.PurchaseInfo[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]