import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';

const input = './index.ts';

const terserOptions = {
	timings: true,
	toplevel: true,
	compress: {
		arrows: false,
		passes: 2,
		typeofs: false,
	},
	mangle: true,
	format: {
		comments: false,
	},
};

const plugins = [nodeResolve({ extensions: ['.ts', '.js'] }), commonjs(), esbuild({})];

export default [
	{
		input,
		output: [{ name: pkg.name, file: pkg.main, format: 'cjs', sourcemap: false, exports: 'default' }],
		plugins: [
			...plugins,
			getBabelOutputPlugin({
				presets: [['@babel/preset-env', { modules: 'commonjs', targets: { browsers: ['defaults', 'last 3 version', 'IE 11'] } }]],
			}),
			terser(terserOptions),
		],
	},
	{
		input,
		output: [
			{ name: pkg.name, file: pkg.browser, format: 'umd', sourcemap: false, exports: 'default' },
			{ name: pkg.name, file: pkg.module, format: 'es', sourcemap: false, exports: 'default' },
		],
		plugins: [...plugins, terser(terserOptions)],
	},
].filter(Boolean);
