<script lang="ts">
	import { Color } from 'iroay/iroay';

	let btnL: HTMLElement;
	let btnR: HTMLElement;

	let current: number = 0;

	export let onClick: (c: number) => void;
	export let colorL: Color;
	export let colorR: Color;

	let colorLStr: string;
	let colorRStr: string;

	$: {
		const rgbL = colorL.asRGB();
		colorLStr = `rgb(${rgbL[0]}, ${rgbL[1]}, ${rgbL[2]})`;
		const rgbR = colorR.asRGB();
		colorRStr = `rgb(${rgbR[0]}, ${rgbR[1]}, ${rgbR[2]})`;
	}

	function click(e: Event) {
		if (e.target && (e.target as HTMLElement).classList.contains('selected')) {
			return;
		}
		if (btnL.classList.contains('selected')) {
			btnL.classList.remove('selected');
			btnR.classList.add('selected');
			current = 1;
		} else {
			btnL.classList.add('selected');
			btnR.classList.remove('selected');
			current = 0;
		}
		onClick(current);
	}
</script>

<div class="flex flex-row gap-x-4 items-center">
	<button bind:this={btnL} class="colorL selected" on:click={click} style="--color:{colorLStr}"></button>
	<button bind:this={btnR} class="colorR" on:click={click} style="--color:{colorRStr}"></button>
</div>

<style>
	button {
		width: 4rem;
		aspect-ratio: 1;

		appearance: none;
		border: 1px solid #fff;
		background-color: var(--color, #000);

		&.selected {
			outline: 2px solid #000;
		}
	}
</style>
