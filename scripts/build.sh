#!/bin/sh

set -e

OUTDIR=build
PTAU_POW=13

mkdir $OUTDIR

circom --r1cs --wasm ./hashbench_bls.circom -p bls12381 -o $OUTDIR
circom --r1cs --wasm ./hashbench_bn.circom -p bn128 -o $OUTDIR

circom --r1cs --wasm ./multiplier2.circom -p bls12381 -o $OUTDIR

cd $OUTDIR

# Build a ptau for bls
snarkjs ptn bls12381 $PTAU_POW power_bls.ptau
snarkjs powersoftau prepare phase2 power_bls.ptau power_bls_final.ptau

snarkjs ptn bn128 $PTAU_POW power_bn.ptau
snarkjs powersoftau prepare phase2 power_bn.ptau power_bn_final.ptau

# Make the zkeys
snarkjs groth16 setup hashbench_bls.r1cs power_bls_final.ptau hashbench_bls_final.zkey
snarkjs zkey export verificationKey hashbench_bls_final.zkey hashbench_bls.vkey.json

snarkjs groth16 setup hashbench_bn.r1cs power_bn_final.ptau hashbench_bn_final.zkey
snarkjs zkey export verificationKey hashbench_bn_final.zkey hashbench_bn.vkey.json

snarkjs groth16 setup multiplier2.r1cs power_bls_final.ptau multiplier2_bls_final.zkey
snarkjs zkey export verificationKey multiplier2_bls_final.zkey multiplier2.vkey.json