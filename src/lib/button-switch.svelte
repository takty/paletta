<script lang="ts">
	import { Color } from 'iroay/iroay';

	type Triplet = [number, number, number];

	interface Props {
		current?: number;
		values?: [Color, Color];
	}

	let { current = $bindable(0), values = [new Color(), new Color()] }: Props = $props();

	let btnL: HTMLElement;

	let csL: string = $state('');
	let csR: string = $state('');

	$effect((): void => {
		const tl: Triplet = values[0].asRgb();
		const tr: Triplet = values[1].asRgb();
		csL = `rgb(${tl[0]}, ${tl[1]}, ${tl[2]})`;
		csR = `rgb(${tr[0]}, ${tr[1]}, ${tr[2]})`;
	});

	function onclick(e: Event): void {
		if (e.target === btnL) {
			current = 0;
		} else {
			current = 1;
		}
	}
</script>

<div class="flex flex-row gap-x-4 items-center">
	<button
		class={{
			'appearance-none border-2 border-white size-16 bg-(--c)': true,
			'pointer-events-none outline-2 selected': current === 0
		}}
		{onclick}
		style="--c:{csL}"
		aria-label="L-Color"
		bind:this={btnL}
	></button>
	<button
		class={{
			'appearance-none border-2 border-white size-16 bg-(--c)': true,
			'pointer-events-none outline-2 selected': current === 1
		}}
		{onclick}
		style="--c:{csR}"
		aria-label="R-Color"
	></button>
</div>
