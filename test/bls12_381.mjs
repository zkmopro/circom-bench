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
        // const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        //     { inputs },
        //     './build/hashbench_bls_js/hashbench_bls.wasm',
        //     './build/hashbench_bls_final.zkey'
        // )
        // console.log(proof)
        const proof = {
            pi_a: [
                '3580608125394968357970688378660950427562082424067236946220687773043419264576428778962414569705112872205874587758668',
                '3338899948174717645267312953813931771248860239039078031025243629946019696529377179609590386547967697481328222476413',
                '1'
            ],
            pi_b: [
                [
                '672885156821578183225286826294540016497038427153452019974584439756620298923064647806187542631598286277715340175574',
                '3869517396496472466027881156600204885355586550802877957715718261044316933407181775954358943623591139915255901400787'
                ],
                [
                    '2246572863339618113913387068043623042772979608716020427851956075049986113344565963209156159429108226481407992021971',
                    '2702650723708897467445280977720075742435235343660943705458301518417425926607562402452551399655024186179893757889437'
                ],
                ['1','0']

            ],
            pi_c: [
                '944680559212213656324010191532118192518787640973649077184202392559321510750353661238457580065913894358855188358794',
                '3267126999684104219855112398585039596847848863853010746034120149921257225780346182076935333912355747214863953401020'
            ],
            protocol: 'groth16',
            curve: 'bls12381'
        }
        const publicSignals = ['30695856561167821618075419048973910422865797477786596477999317197379707456163']
        
        // let out = poseidonT3(inputs)
        // for (let x = 0; x < N-1; x++) {
        //   out = poseidonT3([out, 0n])
        // }
        // t.is(publicSignals[0], out.toString())

        const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);
        t.is(res, true)
        return
    }
})