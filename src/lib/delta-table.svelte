<script lang="ts">
	import { Color, Difference } from 'iroay/iroay';

	interface Props {
		colorL: Color;
		colorR: Color;
	}

	let { colorL, colorR }: Props = $props();

	let d_e : string = $derived(Difference.CIE76(colorL.asLab(), colorR.asLab()).toFixed(2));
	let d_ep: string = $derived(Difference.CIE76(colorL.toProtanopia().asLab(), colorR.toProtanopia().asLab()).toFixed(2));
	let d_ed: string = $derived(Difference.CIE76(colorL.toDeuteranopia().asLab(), colorR.toDeuteranopia().asLab()).toFixed(2));
</script>

<div class="delta grid grid-cols-[auto_3rem] gap-x-2 gap-y-0.5 items-baseline text-sm leading-tight">
	<div class="h-5">⊿E:</div>
	<output class="flex text-sm justify-self-end">{d_e}</output>

	<div class="h-5">⊿E<sub>P</sub>:</div>
	<output class="flex text-sm justify-self-end">{d_ep}</output>

	<div class="h-5">⊿E<sub>D</sub>:</div>
	<output class="flex text-sm justify-self-end">{d_ed}</output>
</div>
