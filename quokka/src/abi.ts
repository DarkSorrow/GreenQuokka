

export const abi = JSON.stringify(
    [
        {
            "inputs": [],
            "name": "CallbackNotAuthorized",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "InsufficentFunds",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "requestId",
                    "type": "uint256"
                },
                {
                    "components": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "x",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "y",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct G1Point",
                            "name": "random",
                            "type": "tuple"
                        },
                        {
                            "internalType": "uint256",
                            "name": "cipher",
                            "type": "uint256"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "x",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "y",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct G1Point",
                            "name": "random2",
                            "type": "tuple"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "f",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "e",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct DleqProof",
                            "name": "dleq",
                            "type": "tuple"
                        }
                    ],
                    "indexed": false,
                    "internalType": "struct Ciphertext",
                    "name": "ciphertext",
                    "type": "tuple"
                }
            ],
            "name": "EntryDecryption",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "cipherId",
                    "type": "uint256"
                },
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "x",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "y",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct G1Point",
                    "name": "buyerPublicKey",
                    "type": "tuple"
                }
            ],
            "name": "buyEntry",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "payable",
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
            "name": "itemToPrice",
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
            "inputs": [],
            "name": "oracle",
            "outputs": [
                {
                    "internalType": "contract IEncryptionOracle",
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
                    "internalType": "uint256",
                    "name": "requestId",
                    "type": "uint256"
                },
                {
                    "components": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "x",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "y",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct G1Point",
                            "name": "random",
                            "type": "tuple"
                        },
                        {
                            "internalType": "uint256",
                            "name": "cipher",
                            "type": "uint256"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "x",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "y",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct G1Point",
                            "name": "random2",
                            "type": "tuple"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "f",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "e",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct DleqProof",
                            "name": "dleq",
                            "type": "tuple"
                        }
                    ],
                    "internalType": "struct Ciphertext",
                    "name": "cipher",
                    "type": "tuple"
                }
            ],
            "name": "oracleResult",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "components": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "x",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "y",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct G1Point",
                            "name": "random",
                            "type": "tuple"
                        },
                        {
                            "internalType": "uint256",
                            "name": "cipher",
                            "type": "uint256"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "x",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "y",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct G1Point",
                            "name": "random2",
                            "type": "tuple"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "f",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "e",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct DleqProof",
                            "name": "dleq",
                            "type": "tuple"
                        }
                    ],
                    "internalType": "struct Ciphertext",
                    "name": "cipher",
                    "type": "tuple"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "submitEntry",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
)