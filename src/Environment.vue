<template>
	<!-- The launcher loads here. -->
	<iframe id="launch-frame"></iframe>
</template>

<script lang="ts">
	import { ref, type Ref, } from 'vue';

	import { Chrome, } from './chrome';

	import $ from 'jquery';

	let chrome: Chrome;

	export default {
		props: {
			extension: {
				type: Chrome,
				required: true,
			},
		},

		methods: {
			async begin(key: string) {
				console.clear();

				// let url: string = `ldb1:vb:0:[${key}]`

				let script: string = await (await fetch('/ldb/background.js')).text();

				let modules: any[];

				let generator: (chrome: Chrome) => any = eval(script);

				try {
					// Register everything.
					generator(this.extension);
				} catch (error: any) {
					console.error(error);
				};

				// this.extension.runtime.onInstalled.emit({});

				// this.extension.webNavigation.onBeforeNavigate.emit({ url: url, });
				// this.extension.webRequest.onCompleted.emit({ url: url, });

				(window as any).poison = this.extension;

				let launcher: JQuery<HTMLIFrameElement> = $('#launch-frame');

				launcher.attr('src', `./ldb/security.html?a=${encodeURIComponent(key)}&d=1`);

				let contentWindow: Window | null | undefined = launcher.get()[0]?.contentWindow;
			},
		},
	};
</script>