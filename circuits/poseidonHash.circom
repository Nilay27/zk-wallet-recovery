pragma circom 2.0.3;

include "../node_modules/circomlib/circuits/poseidon.circom";

template PoseidonHash16() {
  	signal input inputs[16];
    signal output hashOutput;

    component hash = Poseidon(16);
    for (var i = 0; i < 16; i++) {
        hash.inputs[i] <== inputs[i];
    }
    hashOutput <== hash.out;
}

template PoseidonHash128(numInputs) {
    numInputs === 128;
    signal input a[numInputs];
    signal intermediateHashes[8];

    component hashes[8];
    for (var i = 0; i < 8; i++) {
        hashes[i] = PoseidonHash16();
        for (var j = 0; j < 16; j++) {
            hashes[i].inputs[j] <== a[i * 16 + j];
        }
        intermediateHashes[i] <== hashes[i].hashOutput;
    }

    // Optional: Hash the intermediate hashes into a final single hash
    component finalHash = Poseidon(8);
    for (var i = 0; i < 8; i++) {
        finalHash.inputs[i] <== intermediateHashes[i];
    }

    log(finalHash.out);
}

component main { public [ a ] } = PoseidonHash128(128);
