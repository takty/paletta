<!-- Slider.svelte -->
<script lang="ts" type="module">
	import { onMount, afterUpdate } from 'svelte';

	export let label: string;
	export let value: number;
	export let onUpdate: (v: number) => void;
	export let min: number = 0;
	export let max: number = 255;
	export let decimal: number = 0;

	let err: boolean = false;
	let f: number = Math.pow(10, decimal);
	$: value_f = value * f;

	function clamp(v: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, v));
	}

	function checkValue() {
		const cv = clamp(value, min, max);
		err = cv !== value;
		value = cv;
	}

	function handleInput(e: Event) {
		const nv = +(e.target as HTMLInputElement).value;
		const cv = clamp(nv, min, max);
		err = cv !== nv;
		value = cv;
		onUpdate(nv);
	}

	function handleSlider(e: Event) {
		const nv = +(e.target as HTMLInputElement).value / f;
		const cv = clamp(nv, min, max);
		err = cv !== nv;
		value = cv;
		onUpdate(nv);
	}

	function formatValue(v: number): string {
		return v.toFixed(decimal);
	}

	afterUpdate(() => {
		checkValue();
	});

	onMount(() => {
		checkValue();
	});
</script>

<label>
	<span class="key">{label}</span>
	<input
		type="range"
		min="{min * f}"
		max="{max * f}"
		bind:value={value_f}
		on:input={(e) => handleSlider(e)}
	/>
	<span class="error-lamp {err ? 'active' : 'inactive'}"></span>
	<input
		type="number"
		{min}
		{max}
		value={formatValue(value)}
		on:input={(e) => handleInput(e)}
		step={Math.pow(10, -decimal)}
	/>
</label>

<style>
	label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	label > span:first-child {
		display: inline-block;
		width: 1rem;
	}
	.error-lamp {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
		margin-inline: 0 2px;
	}
	.error-lamp.active {
		background-color: red;
	}
	.error-lamp.inactive {
		background-color: green;
	}
	input[type='number'] {
		width: 4rem;
		text-align: end;
	}
</style>
