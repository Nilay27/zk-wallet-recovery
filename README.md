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