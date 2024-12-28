export default [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "bloodBankId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "licenseNumber",
				"type": "string"
			}
		],
		"name": "BloodBankRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "bloodUnitId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "enum BloodManagement.BloodStatus",
				"name": "newStatus",
				"type": "uint8"
			}
		],
		"name": "BloodStatusUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "bloodUnitId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "bloodBankId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "BloodUnitAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "bloodUnitId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "BloodUnitExpired",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "bloodUnitId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "testResultsCID",
				"type": "string"
			}
		],
		"name": "TestResultsUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_bloodUnitId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_donorId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_bloodGroup",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_rhFactor",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_bloodBankId",
				"type": "string"
			}
		],
		"name": "addBloodUnit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allBloodBanks",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allBloodUnitIds",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "authorizedInspectors",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "bloodBanks",
		"outputs": [
			{
				"internalType": "string",
				"name": "bloodBankId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "licenseNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "city",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isVerified",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "registrationTimestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "bloodUnits",
		"outputs": [
			{
				"internalType": "string",
				"name": "bloodUnitId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "donorId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "bloodGroup",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "rhFactor",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "collectedTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "bloodBankId",
				"type": "string"
			},
			{
				"internalType": "enum BloodManagement.BloodStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "testResultsCID",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "batchSize",
				"type": "uint256"
			}
		],
		"name": "checkAndUpdateExpiredUnits",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BloodManagement.BloodStatus",
				"name": "_status",
				"type": "uint8"
			}
		],
		"name": "getBloodUnitsByStatus",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_bloodGroup",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_rhFactor",
				"type": "string"
			}
		],
		"name": "getCompatibleBloodUnits",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getExpiredUnitsCount",
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
				"internalType": "string",
				"name": "_bloodUnitId",
				"type": "string"
			}
		],
		"name": "isExpired",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_bloodUnitId",
				"type": "string"
			}
		],
		"name": "markBloodAsTransfused",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_licenseNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_city",
				"type": "string"
			}
		],
		"name": "registerBloodBank",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_bloodUnitId",
				"type": "string"
			}
		],
		"name": "reserveBloodUnit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_bloodUnitId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_testResultsCID",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_isSafe",
				"type": "bool"
			}
		],
		"name": "updateTestResults",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_licenseNumber",
				"type": "string"
			}
		],
		"name": "verifyBloodBank",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]