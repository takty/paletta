<script lang="ts">
	import { Color, Difference } from 'iroay/iroay';

	interface Props {
		values?: [Color, Color];
	}

	let { values = [new Color(), new Color()] }: Props = $props();

	const d_e: string = $derived(
		Difference.CIE76(
			values[0].asLab(),
			values[1].asLab()
		).toFixed(2)
	);
	const d_ep: string = $derived(
		Difference.CIE76(
			values[0].toProtanopia().asLab(),
			values[1].toProtanopia().asLab()
		).toFixed(2)
	);
	const d_ed: string = $derived(
		Difference.CIE76(
			values[0].toDeuteranopia().asLab(),
			values[1].toDeuteranopia().asLab()
		).toFixed(2)
	);
</script>

<div
	class="delta grid grid-cols-[auto_3rem] gap-x-2 gap-y-0.5 items-baseline text-sm leading-tight"
>
	<div class="h-5">⊿E:</div>
	<output class="flex text-sm justify-self-end">{d_e}</output>

	<div class="h-5">⊿E<sub>P</sub>:</div>
	<output class="flex text-sm justify-self-end">{d_ep}</output>

	<div class="h-5">⊿E<sub>D</sub>:</div>
	<output class="flex text-sm justify-self-end">{d_ed}</output>
</div>
