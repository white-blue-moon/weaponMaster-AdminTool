import { spawn } from 'child_process';
import { sveltePreprocess } from 'svelte-preprocess';

import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
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
		dir: 'public/admin-front/build',    	  // 디렉토리 변경
		entryFileNames: 'bundle.[hash].js',       // JS 번들 해시 적용
		assetFileNames: 'bundle.[hash][extname]', // 정적 에셋 해시 적용
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

		postcss({
			extract: true,        // CSS 별도 파일로 추출 (기본 파일명에 해시 자동 적용)
			minimize: production, // 프로덕션일 때 CSS 압축 (ex. body{margin:0;padding:0})
			sourceMap: !production,
		}),

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
