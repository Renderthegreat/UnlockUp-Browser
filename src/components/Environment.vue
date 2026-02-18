<template>
	<!-- The launcher loads here. -->
	<iframe id="launch-frame"></iframe>
</template>

<script lang="ts">
	import { ref, type Ref, } from 'vue';

	import { Chrome, } from '@/chrome';

	import $ from 'jquery';

	let chrome: Chrome;

	export default {
		methods: {
			async begin(key: string) {
				console.log(key);
				let url: string = `data://text/plain,ldb1:vb:0:[${key}]`;

				$('#launch-frame').attr('href', url);
			},
		},
	};
</script>

<style scoped>
#launch-frame {
	width: 100%;
	height: 100%;
};
</style>