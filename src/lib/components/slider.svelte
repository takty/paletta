<!-- slider.svelte -->
<script lang="ts">
	interface Props {
		label?   : string;
		value?   : number;
		onupdate?: (v: number) => void;
		min?     : number;
		max?     : number;
		decimal? : number;
		class?   : string;
	}

	let {
		label    = '',
		value    = $bindable(0),
		onupdate = (v: number): void => {},
		min      = 0,
		max      = 255,
		decimal  = 0,
		'class': className = undefined,
	}: Props = $props();

	let err: boolean = $state(false);
	let coe: number  = $derived(Math.pow(10, decimal));

	let min_sl: number = $derived(min * coe);
	let max_sl: number = $derived(max * coe);
	let step  : number = $derived(Math.pow(10, -decimal));

	function checkValue(v: number): number {
		const cv: number = Math.max(min, Math.min(v, max));
		err = cv !== v;
		return cv;
	}

	$effect((): void => {
		value = checkValue(value);
	});

	class SliderIo {
		get io(): number {
			return value * coe;
		}
		set io(v: number) {
			value = checkValue(v / coe);
			onupdate(value);
		}
	}
	class SpinnerIo {
		get io(): string {
			return value.toFixed(decimal);
		}
		set io(v: string) {
			value = checkValue(Number.parseFloat(v));
			onupdate(value);
		}
	}

	const slIo = new SliderIo();
	const spIo = new SpinnerIo();
</script>

<label class={`${className} grid grid-cols-[auto_1fr_auto_auto] items-center gap-1`}>
	<span class="text-sm w-4 inline-block">{label}</span>
	<input type="range" min={min_sl} max={max_sl} bind:value={slIo.io} />
	<span class="size-2 inline-block rounded-full me-0.5 bg-green-500" class:bg-red-500={err}></span>
	<input class="text-sm w-16 text-end" type="number" {min} {max} {step} bind:value={spIo.io} />
</label>
