import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import css from "rollup-plugin-css-only";
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import { wasm } from '@rollup/plugin-wasm';
import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			},
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			},
			preprocess: sveltePreprocess(),
		}),
		copy({
			targets: [{
				src: './src/lib/identity.rs/web/identity_wasm_bg.wasm',
				dest: 'public',
				rename: 'identity_wasm_bg.wasm'
			}]
		}),
		wasm({
		  	sync: ['./src/lib/identity.rs/web/identity_wasm_bg.wasm', 'identity_wasm_bg.wasm'],
		}),
    	// we'll extract any component CSS out into
    	// a separate file - better for performance
    	// css({ output: "bundle.css" }),
		css({output:'public/build/extra.css'}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),
		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
