export const VerifierGoerli = '0x0b0262f3928C8A895CD3d324a952567F5fb5145a';
export const WalletGoerli = '0x1aC472423AE7508b8E0D54A54120782ab4D5D550';
export const VerifierArbitrum = '0xA5bDD9eC5E0d3dAd528C496a09FeD0f91a6bBf29'
export const WalletArbitrum = '0xafca85162b0aBdd3CC59418b447E2cc7605Bd89f';
export const VerifierScroll = '0xafca85162b0aBdd3CC59418b447E2cc7605Bd89f';
export const WalletScroll = '0x61B6F8136edd8Ac5782d8aFBD5b5D098D9B50B50';
export const VerifierZKEVM = '0xe89ed8d166c043Cc7753Da7eAcC87a07281cb057'
export const WalletZKEVM = '0xA5bDD9eC5E0d3dAd528C496a09FeD0f91a6bBf29';
export const VerifierFilecoin = '0x61B6F8136edd8Ac5782d8aFBD5b5D098D9B50B50'
export const WalletFilecoin = '0x6bb5BCD9fd3fc63E97742f051f00d40Af5a10e96';
export const VerifierABI = [
    {
      "inputs": [
        {
          "internalType": "uint256[2]",
          "name": "_pA",
          "type": "uint256[2]"
        },
        {
          "internalType": "uint256[2][2]",
          "name": "_pB",
          "type": "uint256[2][2]"
        },
        {
          "internalType": "uint256[2]",
          "name": "_pC",
          "type": "uint256[2]"
        },
        {
          "internalType": "uint256[3]",
          "name": "_pubSignals",
          "type": "uint256[3]"
        }
      ],
      "name": "verifyProof",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
export const WalletABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_verifierAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "featureVectorHash",
        "type": "uint256"
      }
    ],
    "name": "RecoveryRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nullifierHash",
        "type": "uint256"
      }
    ],
    "name": "WalletRecovered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getCommitment",
    "outputs": [
      {
        "internalType": "uint256[128]",
        "name": "",
        "type": "uint256[128]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFeatureVectorHash",
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
    "name": "getHashOfPersonalInfoHash",
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
    "name": "getOwner",
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
    "inputs": [],
    "name": "getVerifierAddress",
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
        "internalType": "uint256[2]",
        "name": "_a",
        "type": "uint256[2]"
      },
      {
        "internalType": "uint256[2][2]",
        "name": "_b",
        "type": "uint256[2][2]"
      },
      {
        "internalType": "uint256[2]",
        "name": "_c",
        "type": "uint256[2]"
      },
      {
        "internalType": "uint256[3]",
        "name": "_input",
        "type": "uint256[3]"
      }
    ],
    "name": "recoverWallet",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_featureVectorHash",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_hashOfPersonalInfoHash",
        "type": "uint256"
      },
      {
        "internalType": "uint256[128]",
        "name": "_commitment",
        "type": "uint256[128]"
      }
    ],
    "name": "registerForRecovery",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[128]",
        "name": "_zeroCommitment",
        "type": "uint256[128]"
      }
    ],
    "name": "removeRecovery",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_verifierAddress",
        "type": "address"
      }
    ],
    "name": "setVerifierAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

  // older goerli address: 0x50d8D4E934Aa517DD7d21b2C38E5C3DC57F9B9ED