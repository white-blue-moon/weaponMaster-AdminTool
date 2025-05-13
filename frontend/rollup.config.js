import { spawn } from 'child_process';
import { sveltePreprocess } from 'svelte-preprocess';

import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';
import deletePlugin from 'rollup-plugin-delete'; 

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: production ? false : true,
		format: 'iife',
		name: 'app',
		dir: 'public/admin-front/build',    // 디렉토리로 변경
		entryFileNames: 'bundle.[hash].js', // JS 번들에 해시 적용
	},
	plugins: [
		// 빌드 전에 이전 파일들 삭제
		deletePlugin({
			targets: 'public/admin-front/build/*', // 삭제할 대상 파일 설정
			verbose: true, // 삭제된 파일들 출력
		}),

		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},
			preprocess: sveltePreprocess({
                scss: {
                  prependData: `@use 'src/variables' as *;`
                }
            })
		}),

		css({ output: 'bundle.css' }),


		resolve({
			browser: true,
			dedupe: ['svelte'],
			exportConditions: ['svelte']
		}),
		commonjs(),


		!production && serve(),
		!production && livereload('public'),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
