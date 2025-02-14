<!-- slider.svelte -->
<script lang="ts">
	import { tick } from 'svelte';
	import { Slider } from "$lib/components/ui/slider/index.js";

	interface Props {
		label?  : string;
		value?  : number;
		min?    : number;
		max?    : number;
		decimal?: number;
		class?  : string;
	}

	let {
		label   = '',
		value   = $bindable(0),
		min     = 0,
		max     = 255,
		decimal = 0,
		'class': className = undefined,
	}: Props = $props();

	let err: boolean = $state(false);
	let coe: number  = $derived(Math.pow(10, decimal));

	let min_sl: number = $derived(min * coe);
	let max_sl: number = $derived(max * coe);
	let step  : number = $derived(Math.pow(10, -decimal));

	let valSl: number = $state(value * Math.pow(10, decimal));
	let valSp: string = $state(value.toFixed(decimal));

	let internalUpdate: boolean = false;

	async function update(v: number, force: boolean = false): Promise<void> {
		if (internalUpdate) return;
		v = checkValue(v);
		if (force || v !== value) {
			internalUpdate = true;

			if (!force) value = v;
			valSl = v * coe;
			valSp = v.toFixed(decimal);

			await tick();
			internalUpdate = false;
		}
	}

	function checkValue(v: number): number {
		const cv: number = Math.max(min, Math.min(v, max));
		err = cv !== v;
		return cv;
	}

	$effect((): void => {
		update(value, true);
	});

	$effect((): void => {
		update(valSl / coe);
	});

	$effect((): void => {
		update(Number.parseFloat(valSp));
	});
</script>

<label class={`${className} grid grid-cols-[auto_1fr_auto_auto] items-center gap-2`}>
	<span class="text-sm w-4 inline-block">{label}</span>
	<!-- <input type="range" min={min_sl} max={max_sl} bind:value={valSl} /> -->
	<Slider type="single" min={min_sl} max={max_sl} bind:value={valSl} />
	<span class="size-2 inline-block rounded-full m-1.5 bg-green-500" class:bg-red-500={err}></span>
	<input class="text-sm w-16 text-end" type="number" {min} {max} {step} bind:value={valSp} />
</label>
