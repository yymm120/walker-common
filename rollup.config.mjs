// import { rollup, RollupOptions } from 'rollup';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
const rollupConfig = [{
	input: ["index.js"],
	output: [
		{
			file: 'dist/esm/index.js',
			format: 'esm',
			plugins: [terser()]
		},
        {
            file: "dist/cjs/index.cjs",
            format: "cjs",
            plugins: [terser()]
        }
	],
	plugins: [commonjs(), resolve()]
}]


export default rollupConfig;