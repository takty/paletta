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
		value    = 0,
		onupdate = (v: number): void => {},
		min      = 0,
		max      = 255,
		decimal  = 0,
		'class': className = undefined,
	}: Props = $props();

	let err: boolean = $state(false);
	let coe: number  = $derived(Math.pow(10, decimal));

	function clamp(min: number, v: number, max: number): number {
		return Math.max(min, Math.min(v, max));
	}

	function checkValue(): void {
		const cv: number = clamp(min, value, max);

		err   = cv !== value;
		value = cv;
	}

	function oninput(e: Event, coe: number = 1): void {
		const nv: number = +(e.target as HTMLInputElement).value / coe;
		const cv: number = clamp(min, nv, max);

		err   = cv !== nv;
		value = cv;
		onupdate(nv);
	}

	function formatValue(v: number): string {
		return v.toFixed(decimal);
	}

	$effect((): void => {
		checkValue();
	});
</script>

<label class={className}>
	<span class="key">{label}</span>
	<input
		type    = "range"
		min     = {min * coe}
		max     = {max * coe}
		value   = {value * coe}
		oninput = {(e) => oninput(e, coe)}
	/>
	<span class="error-lamp {err ? 'active' : 'inactive'}"></span>
	<input
		type    = "number"
		{min}
		{max}
		step    = {Math.pow(10, -decimal)}
		value   = {formatValue(value)}
		oninput = {(e) => oninput(e)}
	/>
</label>

<style>
	label {
		display              : grid;
		grid-template-columns: auto 1fr auto auto;
		align-items          : center;
		gap                  : 0.25rem;
	}
	label > span:first-child {
		display: inline-block;
		width  : 1rem;
	}
	.error-lamp {
		width        : 8px;
		height       : 8px;
		border-radius: 50%;
		display      : inline-block;
		margin-inline: 0 2px;
	}
	.error-lamp.active {
		background-color: red;
	}
	.error-lamp.inactive {
		background-color: green;
	}
	input[type='number'] {
		width     : 4.5rem;
		text-align: end;
	}
</style>
