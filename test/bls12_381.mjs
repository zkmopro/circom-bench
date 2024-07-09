import { poseidonT3 } from 'poseidon-hash/src/bls12_381/t3.mjs'
import crypto from 'crypto'
import test, { registerCompletionHandler } from 'ava'
import fs from 'fs'
import * as snarkjs from 'snarkjs'

// As set in the circuit
const N = 10

// Needed because snarkjs causes the process to hang
registerCompletionHandler(() => {
	process.exit()
});

test('circom impl', async t => {
    const vkey = JSON.parse(fs.readFileSync('./build/hashbench_bls.vkey.json'));
    const count = 100
    for (let x = 0; x < count; x++) {
        // if (x % 10 === 0 && x > 0) console.log(x)
        const inputCount = 2
        const inputs = []
        for (let y = 0; y < inputCount; y++) {
            inputs.push(
                '0x' +
                crypto.randomBytes(Math.floor(1 + 10 * Math.random())).toString('hex')
            )
        }
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            { inputs },
            './build/hashbench_bls_js/hashbench_bls.wasm',
            './build/hashbench_bls_final.zkey'
        )
        
        let out = poseidonT3(inputs)
        for (let x = 0; x < N-1; x++) {
          out = poseidonT3([out, 0n])
        }
        t.is(publicSignals[0], out.toString())

        const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);
        t.is(res, true)
    }
})