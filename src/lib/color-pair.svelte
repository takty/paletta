<script lang="ts">
	import { Color } from 'iroay/iroay';
	import ButtonSwitch from '$lib/button-switch.svelte';
	import DeltaTable from '$lib/delta-table.svelte';

	interface Props {
		current?: number;
		values? : [Color, Color];
	}

	let {
		current = $bindable(0),
		values  = [new Color(), new Color()],
	} : Props = $props();
</script>

<div class="flex flex-row gap-x-4 items-center">
	<ButtonSwitch {values} bind:current></ButtonSwitch>
	<DeltaTable {values}></DeltaTable>
</div>
