# zk-face-recovery
Recover your Wallet using just your face and and trivia about yourself

## Setup

1. Run npm install to setup circomlib

```bash
npm install && mkdir output
```

2. Compile circuit

```bash
circom circuits/poseidonHash.circom --r1cs --wasm --sym -o output/
```

3. Change to `ptau-ceremony` directory

```bash
cd output/ptau-ceremony/
```

4. To prove the circuit in one go, run:
```bash
bash ceremony.sh {circuit_name}
```

5. Alternatively you can perform step by step, the trusted setup is done in two parts

    1. The powers of tau, which is independent of the circuit
    2. The phase 2, which depends on the circuit

6. Start a new `powers of tau` ceremony

```bash
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
```

7. Contribute to the ceremony

```bash
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
```

8. Begin circuit dependent phase

```bash
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
```

9. Generate proving and verification keys

```bash
snarkjs groth16 setup output/circuit.r1cs pot12_final.ptau circuit_0000.zkey
```

10. Contribute to phase 2

```bash
snarkjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```

11. Export verification key

```bash
snarkjs zkey export verificationkey circuit_0001.zkey verification_key.json
```

## Deployed Contracts Readme
---

### Goerli Testnet
- **Verifier Contract**: `0x0b0262f3928C8A895CD3d324a952567F5fb5145a`
- **Wallet Contract**: `0x1aC472423AE7508b8E0D54A54120782ab4D5D550` - [Verified Code](https://goerli.etherscan.io/address/0x1aC472423AE7508b8E0D54A54120782ab4D5D550#code)

### Arbitrum
- **Verifier Contract**: `0xA5bDD9eC5E0d3dAd528C496a09FeD0f91a6bBf29` - [Verified Code](https://goerli.arbiscan.io/address/0xA5bDD9eC5E0d3dAd528C496a09FeD0f91a6bBf29#code)
- **Wallet Contract**: `0xafca85162b0aBdd3CC59418b447E2cc7605Bd89f` - [Verified Code](https://goerli.arbiscan.io/address/0xafca85162b0aBdd3CC59418b447E2cc7605Bd89f#code)

### Scroll
- **Verifier Contract**: `0xafca85162b0aBdd3CC59418b447E2cc7605Bd89f` - [Verified Code](https://sepolia-blockscout.scroll.io/address/0xafca85162b0aBdd3CC59418b447E2cc7605Bd89f/contracts#address-tabs)
- **Wallet Contract**: `0x61B6F8136edd8Ac5782d8aFBD5b5D098D9B50B50` - [Verified Code](https://sepolia-blockscout.scroll.io/address/0x61B6F8136edd8Ac5782d8aFBD5b5D098D9B50B50/contracts#address-tabs)

### ZKEVM
- **Verifier Contract**: `0xe89ed8d166c043Cc7753Da7eAcC87a07281cb057` - [Verified Code](https://testnet-zkevm.polygonscan.com/address/0xe89ed8d166c043Cc7753Da7eAcC87a07281cb057#code)
- **Wallet Contract**: `0xA5bDD9eC5E0d3dAd528C496a09FeD0f91a6bBf29` - [Verified Code](https://testnet-zkevm.polygonscan.com/address/0xA5bDD9eC5E0d3dAd528C496a09FeD0f91a6bBf29#code)

### Filecoin
- **Verifier Contract**: `0x61B6F8136edd8Ac5782d8aFBD5b5D098D9B50B50` - [Verified Code](https://calibration.filfox.info/en/address/0x61B6F8136edd8Ac5782d8aFBD5b5D098D9B50B50?t=3)
- **Wallet Contract**: `0x6bb5BCD9fd3fc63E97742f051f00d40Af5a10e96` - [Verified Code](https://calibration.filfox.info/en/address/0x6bb5BCD9fd3fc63E97742f051f00d40Af5a10e96?t=3)

### Base
- **Verifier Contract**: `0xafca85162b0aBdd3CC59418b447E2cc7605Bd89f` - [Verified Code](https://base-sepolia.blockscout.com/address/0xafca85162b0aBdd3CC59418b447E2cc7605Bd89f?tab=contract)
- **Wallet Contract**: `0x2243675c0c854F68B3a89867Aa6347816909fE36` - [Verified Code](https://base-sepolia.blockscout.com/address/0x2243675c0c854F68B3a89867Aa6347816909fE36?tab=contract)

---