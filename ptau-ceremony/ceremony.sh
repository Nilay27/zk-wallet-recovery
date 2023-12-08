#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if a circuit name is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <circuit_name>"
    exit 1
fi

# Assign the first argument to a variable
CIRCUIT_NAME=$1

echo "Using circuit: $CIRCUIT_NAME"

# Powers of Tau - Phase 1
snarkjs powersoftau new bn128 13 pot13_0000.ptau -v

# Contribute to the Powers of Tau
snarkjs powersoftau contribute pot13_0000.ptau pot13_0001.ptau --name="First contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"

# Prepare for Phase 2
snarkjs powersoftau prepare phase2 pot13_0001.ptau pot13_final.ptau -v

# Groth16 Setup
snarkjs groth16 setup ../output/${CIRCUIT_NAME}.r1cs pot13_final.ptau ${CIRCUIT_NAME}_0000.zkey

# Contribute to the ZKey
snarkjs zkey contribute ${CIRCUIT_NAME}_0000.zkey ${CIRCUIT_NAME}_0001.zkey --name="1st Contributor Name" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"

# Export the verification key
snarkjs zkey export verificationkey ${CIRCUIT_NAME}_0001.zkey verification_key.json

# Export the Solidity verifier
snarkjs zkey export solidityverifier ${CIRCUIT_NAME}_0001.zkey ../contracts/${CIRCUIT_NAME}Verifier.sol
