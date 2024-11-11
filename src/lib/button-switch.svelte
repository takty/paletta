<script lang="ts">
	import { Color } from 'iroay/iroay';

	type Triplet = [number, number, number];

	interface Props {
		onclick: (c: number) => void;
		colorL : Color;
		colorR : Color;
	}

	let {
		onclick = (c: number): void => {},
		colorL  = new Color(),
		colorR  = new Color()
	}: Props = $props();

	let btnL: HTMLElement;
	let btnR: HTMLElement;

	let colorLStr: string = $state('');
	let colorRStr: string = $state('');

	$effect((): void => {
		const tl: Triplet = colorL.asRgb();
		const tr: Triplet = colorR.asRgb();
		colorLStr = `rgb(${tl[0]}, ${tl[1]}, ${tl[2]})`;
		colorRStr = `rgb(${tr[0]}, ${tr[1]}, ${tr[2]})`;
	});

	function click(e: Event): void {
		if (e.target && (e.target as HTMLElement).classList.contains('selected')) {
			return;
		}
		btnL.classList.toggle('selected');
		btnR.classList.toggle('selected');
		if (btnL.classList.contains('selected')) {
			onclick(0);
		} else {
			onclick(1);
		}
	}
</script>

<div class="flex flex-row gap-x-4 items-center">
	<button bind:this={btnL} class="colorL selected" onclick={click} style="--color:{colorLStr}" aria-label="L-Color"></button>
	<button bind:this={btnR} class="colorR" onclick={click} style="--color:{colorRStr}" aria-label="R-Color"></button>
</div>

<style>
	button {
		width       : 4rem;
		aspect-ratio: 1;

		appearance      : none;
		border          : 1px solid #fff;
		background-color: var(--color, #000);

		&.selected {
			outline: 2px solid #000;
		}
	}
</style>
