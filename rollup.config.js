import { terser } from 'rollup-plugin-terser'
import multi from '@rollup/plugin-multi-entry'

export default [
    {
        input: {
            include: [
                'scripts/*.js'
            ]
        },
        output: {
            format: 'esm',
            file: 'dist/token-action-hud-dc20rpg.min.js'
        },
        plugins: [
            terser({ keep_classnames: true, keep_fnames: true }),
            multi()
        ]
    }
]
