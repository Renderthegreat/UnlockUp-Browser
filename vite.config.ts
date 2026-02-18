import { fileURLToPath, URL, } from 'node:url';

import { defineConfig, loadEnv, } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/.
export default defineConfig((config) => {
	const env = loadEnv(config.mode, process.cwd(), '');

	// console.log(env);

	return {
		build: {
			sourcemap: false,
			rollupOptions: {
				output: {
					manualChunks: (id) => {
						if (id.includes('node_modules')) {
							return 'vendor';
						};
					},
				},
			},
		},
		server: {
			host: '0.0.0.0',
			allowedHosts: [env.HOSTNAME], // Remove in production?
			proxy: {
				'/ws': {
					target: `ws://${env.HOSTNAME}:${env.WS_PORT}`,
					ws: true,
				},
			},
		},
		plugins: [
			vue(),
			vueDevTools(),
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		base: './',
	};
});
