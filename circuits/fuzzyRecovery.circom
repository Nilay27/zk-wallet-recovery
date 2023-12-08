pragma circom 2.0.3;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/gates.circom";
include "../node_modules/circomlib/circuits/bitify.circom";


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
    signal input array[numInputs];
    signal intermediateHashes[8];
    signal output out;

    component hashes[8];
    for (var i = 0; i < 8; i++) {
        hashes[i] = PoseidonHash16();
        for (var j = 0; j < 16; j++) {
            hashes[i].inputs[j] <== array[i * 16 + j];
        }
        intermediateHashes[i] <== hashes[i].hashOutput;
    }

    // Optional: Hash the intermediate hashes into a final single hash
    component finalHash = Poseidon(8);
    for (var i = 0; i < 8; i++) {
        finalHash.inputs[i] <== intermediateHashes[i];
    }

    out <== finalHash.out;
}

template CustomXOR() {
    signal input a; // a can be 0 or 1
    signal input b; // b can be any integer
    signal  out_intermediate;
  	signal output out;

    component isEqualToOne = IsEqual();
    isEqualToOne.in[0] <== a;
    isEqualToOne.in[1] <== 1;

    // Check if b is odd (b % 2 == 1)
    signal isBOdd;
    isBOdd <-- b % 2;

    // If a is 1 and b is odd, subtract 1. If a is 1 and b is even, add 1. Otherwise, keep b as is.
    out_intermediate <-- isEqualToOne.out * (isBOdd * (b - 1) + (1 - isBOdd) * (b + 1)) +  (1-isEqualToOne.out) * b;
    out <==out_intermediate;
}

template XOR128() {
    signal input a[128];
    signal input b[128];
    signal output c[128];

    component CustomXORs[128];
    for (var i = 0; i < 128; i++) {
        CustomXORs[i] = CustomXOR();
        CustomXORs[i].a <== a[i];
        CustomXORs[i].b <== b[i];
        c[i] <== CustomXORs[i].out;
    }
}


template Main(numInputs) {
    signal input feat_vec_prime[numInputs];
    signal input err_code[numInputs];
    signal input hash_feat_vec;
    signal input nullifier;
    signal input nullifierHash;
    signal input personalInfoHash;
    signal input hashOfPersonalInfoHash;


    signal original_feat_vec[numInputs];
    component xors1 = XOR128();
    for (var i = 0; i < numInputs; i++) {
        xors1.a[i] <== feat_vec_prime[i];
        xors1.b[i] <== err_code[i];
    }

    for(var i = 0; i < numInputs; i++) {
        original_feat_vec[i] <== xors1.c[i];
    }
    
    component hasher2 = PoseidonHash128(numInputs);
    for(var i = 0; i < numInputs; i++) {
        hasher2.array[i] <== original_feat_vec[i];
    }

    // constraint recovered feat_vector hash to input hash_feat_vec
    hasher2.out === hash_feat_vec;

    // constraint nullifier hash to input nullifierHash
    component hasher3 = Poseidon(1);
    hasher3.inputs[0] <== nullifier;
    hasher3.out === nullifierHash;

    // constraint hash of personal info hash to input hashOfPersonalInfoHash
    component hasher4 = Poseidon(1);
    hasher4.inputs[0] <== personalInfoHash;
    hasher4.out === hashOfPersonalInfoHash;
}

component main {public [hash_feat_vec, nullifierHash, hashOfPersonalInfoHash]} = Main(128);