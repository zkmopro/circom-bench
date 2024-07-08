pragma circom 2.0.0;

include "./poseidon-hash/circom/poseidon_bls12_381.circom";

// N = number of hashes to perform
template BenchBLS(N) {
    signal input inputs[2];
    signal output out;
    component hashers[N];
    for (var x = 0; x < N; x++) {
        hashers[x] = PoseidonBLS(2);
        if (x == 0) {
            hashers[x].inputs[0] <== inputs[0];
            hashers[x].inputs[1] <== inputs[1];
        } else {
            hashers[x].inputs[0] <== hashers[x-1].out;
            hashers[x].inputs[1] <== 0;
        }
    }
    out <== hashers[N-1].out;
}

component main = BenchBLS(10);