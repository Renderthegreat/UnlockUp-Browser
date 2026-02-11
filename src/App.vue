<template>
	<div id="app">
		<template v-if="started">
			<template v-if="!ready">
				<h1 class="centered">Launching...</h1>
			</template>
			<Environment :extension="extension" ref="environment"/>
		</template>
		<template v-else>
			<el-form>  
				<el-form-item>
					<el-input id="key" type="id" v-model="key" required="true"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="default" @click="
						() => {
							started = true;
							$nextTick(() => {
								environment?.begin(key); 
							});
						}
					">Launch.</el-button>
				</el-form-item>
			</el-form>
		</template>
	</div>
</template>

<script lang="ts" setup>
	import { ref, type Ref, } from 'vue';

	import Environment from './Environment.vue';

	import { Chrome, } from './chrome';

	import mock from './mock';

	const extension: Ref<Chrome> = ref<Chrome>(mock) as Ref<Chrome>;
	const environment: Ref<typeof Environment | null> = ref<typeof Environment | null>(null);

	const key: Ref<string> = ref<string>('');
	
	const ready: Ref<boolean> = ref<boolean>(false);
	const started: Ref<boolean> = ref<boolean>(false);

	// IIFE.
	void async function() {
		key.value = await (await fetch('/test.txt')).text();
	}();

</script>

<style scoped>
	#app {
		color: white;
		display: block;
	};
</style>