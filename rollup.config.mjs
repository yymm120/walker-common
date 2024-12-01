import { defineConfig } from "rollup";
// import { rollup, RollupOptions } from 'rollup';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import path from 'path';

/** @type {import('rollup').RollupOptions} */
export default defineConfig([{
	input: [ "src/index.js" ],
	
	output: [
		{
			dir: "dist/esm",
			entryFileNames: "[name].js",
			format: 'esm',
		},
        {
			dir: "dist/cjs",
			entryFileNames: "[name].cjs",
            format: "cjs",
        }
	],
	plugins: [ nodeResolve({
		rootDir: path.join(process.cwd(), '..')
	}), commonjs(), terser() ],
	watch: {
		clearScreen: true
	}
}]);
