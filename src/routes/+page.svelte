<script lang="ts">
	import Slider from '$lib/Slider.svelte';
	import ColorChart from '$lib/ChartCanvas.svelte';
	import { onMount } from 'svelte';
	import { ColorSpace, Color, Evaluation } from 'colorjst/src/colorjst';

	type Triplet = [number, number, number];

	let rgb : Triplet = [0, 0, 0];
	let lab : Triplet = [0, 0, 0];
	let lch : Triplet = [0, 0, 0];
	let yxy : Triplet = [0, 0.0005, 0.0005];
	let mun : Triplet = [0, 0, 0];
	let pccs: Triplet = [0, 0, 0];
	let tone: Triplet = [0, 0, 0];

	let munStr  = '';
	let pccsStr = '';

	const ms = [new Color(), new Color()];
	let current: number = 0;

	let root: HTMLElement;
	let btnL: HTMLElement;
	let btnR: HTMLElement;

	let d_e = '0.00';
	let d_ep = '0.00';
	let d_ed = '0.00';

	function updatedAll(c: Color): void {
		ms[current] = c;
		updateValues();
	}

	function updated(cs: ColorSpace, idx: number, v: number): void {
		const t = ms[current].as(cs);
		t[idx] = v;
		ms[current].set(cs, t);
		updateValues();
	}

	function updateValues() {
		rgb = ms[current].asRGB();
		lab = ms[current].asLab();
		lch = ms[current].asLCh();
		yxy = ms[current].asYxy();

		mun  = ms[current].asMunsell();
		pccs = ms[current].asPCCS();
		tone = ms[current].asTone();

		munStr  = ms[current].asMunsellNotation();
		pccsStr = ms[current].asPCCSNotation();

		if (current === 0) root.style.setProperty('--colorL', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
		if (current === 1) root.style.setProperty('--colorR', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);

		d_e = Evaluation.differenceBetweenLab(ms[0].asLab(), ms[1].asLab()).toFixed(2);
		d_ep = Evaluation.differenceBetweenLab(ms[0].toProtanopia().asLab(), ms[1].toProtanopia().asLab()).toFixed(2);
		d_ed = Evaluation.differenceBetweenLab(ms[0].toDeuteranopia().asLab(), ms[1].toDeuteranopia().asLab()).toFixed(2);

		ms[current] = ms[current];
	}

	function clickColorBtn(e: Event) {
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
		updateValues();
	}

	onMount(() => {
		updateValues();
	});
</script>

<div bind:this={root} class="columns">
	<div class="indicator">
		<div class="rows">
			<button bind:this={btnL} class="colorL selected" on:click={clickColorBtn}></button>
			<button bind:this={btnR} class="colorR" on:click={clickColorBtn}></button>
			<div class="delta">
				<div>⊿E:</div><output>{d_e}</output>
				<div>⊿E<sub>P</sub>:</div><output>{d_ep}</output>
				<div>⊿E<sub>D</sub>:</div><output>{d_ed}</output>
			</div>
		</div>

		<ColorChart
			width={256}
			height={256}
			value={ms[current]}
			bind:current={current}
			onUpdate={updatedAll}
			chart="yxy"
		></ColorChart>
	</div>

	<div class="columns">
		<div>
			<fieldset>
				<legend>sRGB</legend>
				<Slider value={rgb[0]} label={'R'} min={0} max={255} onUpdate={v => updated(ColorSpace.RGB, 0, v)} />
				<Slider value={rgb[1]} label={'G'} min={0} max={255} onUpdate={v => updated(ColorSpace.RGB, 1, v)} />
				<Slider value={rgb[2]} label={'B'} min={0} max={255} onUpdate={v => updated(ColorSpace.RGB, 2, v)} />
			</fieldset>
			<fieldset>
				<legend>CIELAB (L*a*b*)</legend>
				<Slider value={lab[0]} label={'L*'} min={0} max={100} onUpdate={v => updated(ColorSpace.Lab, 0, v)} />
				<Slider value={lab[1]} label={'a*'} min={-128} max={127} onUpdate={v => updated(ColorSpace.Lab, 1, v)} />
				<Slider value={lab[2]} label={'b*'} min={-128} max={127} onUpdate={v => updated(ColorSpace.Lab, 2, v)} />
				<hr>
				<Slider value={lch[1]} label={'C*'} min={0} max={181} onUpdate={v => updated(ColorSpace.LCh, 1, v)} />
				<Slider value={lch[2]} label={'h'} min={0} max={360} onUpdate={v => updated(ColorSpace.LCh, 2, v)} />
			</fieldset>
			<fieldset>
				<legend>Yxy</legend>
				<Slider value={yxy[0]} label={'Y'} min={0} max={1} decimal={2} onUpdate={v => updated(ColorSpace.Yxy, 0, v)} />
				<Slider value={yxy[1]} label={'x'} min={0.0050} max={0.85} decimal={4} onUpdate={v => updated(ColorSpace.Yxy, 1, v)} />
				<Slider value={yxy[2]} label={'y'} min={0.0050} max={0.85} decimal={4} onUpdate={v => updated(ColorSpace.Yxy, 2, v)} />
			</fieldset>
		</div>
		<div>
			<fieldset>
				<legend>Munsell</legend>
				<Slider value={mun[0]} label={'H'} min={0} max={100} decimal={1} onUpdate={v => updated(ColorSpace.Munsell, 0, v)} />
				<Slider value={mun[1]} label={'V'} min={0} max={10} decimal={1} onUpdate={v => updated(ColorSpace.Munsell, 1, v)} />
				<Slider value={mun[2]} label={'C'} min={0} max={46.7} decimal={1} onUpdate={v => updated(ColorSpace.Munsell, 2, v)} />
				<output>{munStr}</output>
			</fieldset>
			<fieldset>
				<legend>PCCS</legend>
				<Slider value={pccs[0]} label={'h'} min={0} max={24} decimal={1} onUpdate={v => updated(ColorSpace.PCCS, 0, v)} />
				<Slider value={pccs[1]} label={'l'} min={0} max={10} decimal={1} onUpdate={v => updated(ColorSpace.PCCS, 1, v)} />
				<Slider value={pccs[2]} label={'s'} min={0} max={10} decimal={1} onUpdate={v => updated(ColorSpace.PCCS, 2, v)} />
				<hr>
				<Slider value={tone[0]} label={'h'} min={0} max={24} decimal={1} onUpdate={v => updated(ColorSpace.Tone, 0, v)} />
				<Slider value={tone[1]} label={'l\''} min={0} max={10} decimal={1} onUpdate={v => updated(ColorSpace.Tone, 1, v)} />
				<output>{pccsStr}</output>
			</fieldset>
		</div>
	</div>
</div>

<style>
	:is(.colorL, .colorR) {
		width: 4rem;
		aspect-ratio: 1;
		appearance: none;
		border: 1px solid #fff;

		&.selected {
			outline: 2px solid #000;
		}
	}
	.colorL {
		background-color: var(--colorL, #000);
	}
	.colorR {
		background-color: var(--colorR, #000);
	}
	.delta {
		display: grid;
		grid-template-columns: auto 3rem;
		align-items: baseline;
		gap: 0 0.5rem;
		line-height: 1.25;
		padding-block-start: 0.15rem;
		font-size: 0.85rem;
		& > * {
			height: 1.25rem;
		}

		& output {
			justify-self: end;
		}
	}

	.columns {
		display: flex;
		flex-direction: row;
		gap: 0 1rem;

		& > div:not([class]) {
			display: flex;
			flex-direction: column;
		}
	}

	.rows {
		display: flex;
		flex-direction: row;
		gap: 0 1rem;
		align-items: center;
	}

	.indicator {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	fieldset {
		width: fit-content;
	}

	output {
		display: flex;
		font-size: 0.85rem;
	}

	fieldset output {
		margin-block-start: 0.5rem;
		min-height: 1.35rem;
	}
</style>
