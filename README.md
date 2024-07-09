# circom-bench

Builds witness + zkeys for circuits of variable sizes. Meant to test prover performance.

Circuits are built as repeated poseidon invocations.

## Warning

Make sure you use a large enough ptau file! `snarkjs` will _not_ warn you and the proofs will be invalid.
