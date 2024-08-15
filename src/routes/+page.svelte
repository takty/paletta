<script lang="ts">
	import Slider from '$lib/Slider.svelte';
	import { MultipleColor } from '$lib/MultipleColor';
	import ColorChart from '$lib/ColorChart.svelte';
	import { onMount } from 'svelte';
	import { Evaluation } from 'colorjst/src/colorjst';

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

	const mcL = new MultipleColor();
	const mcR = new MultipleColor();
	let curMc: MultipleColor = mcL;

	let root: HTMLElement;
	let btnL: HTMLElement;
	let btnR: HTMLElement;

	let d_e = '0.00';
	let d_ep = '0.00';
	let d_ed = '0.00';

	$: curTriplet = mun;
	$: curChart = 'munsell';

	function updatedAll(cs: string, vs: Triplet): void {
		updated(cs, 0, vs[0]);
		updated(cs, 1, vs[1]);
		updated(cs, 2, vs[2]);
	}

	function updated(cs: string, idx: number, v: number): void {
		// console.log('updated');
		switch (cs) {
			case 'rgb'    : curMc.setRgb(idx, v); break;
			case 'lab'    : curMc.setLab(idx, v); break;
			case 'lch'    : curMc.setLch(idx, v); break;
			case 'yxy'    : curMc.setYxy(idx, v); break;
			case 'munsell': curMc.setMunsell(idx, v); break;
			case 'pccs'   : curMc.setPccs(idx, v); break;
			case 'tone'   : curMc.setTone(idx, v); break;
		}
		updateValues();
	}

	function updateValues() {
		rgb = curMc.getRgb();
		lab = curMc.getLab();
		lch = curMc.getLch();
		yxy = curMc.getYxy();

		mun  = curMc.getMunsell();
		pccs = curMc.getPccs();
		tone = curMc.getTone();

		munStr  = curMc.getMunsellNotation();
		pccsStr = curMc.getPccsNotation();

		if (curMc === mcL) {
			root.style.setProperty('--colorL', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
		}
		if (curMc === mcR) {
			root.style.setProperty('--colorR', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
		}

		const lab0 = mcL.getLab(), lab1 = mcR.getLab()
		d_e = Evaluation.differenceBetweenLab(lab0, lab1).toFixed(2);
		const lab0p = mcL.getLabP(), lab1p = mcR.getLabP();
		d_ep = Evaluation.differenceBetweenLab(lab0p, lab1p).toFixed(2);
		const lab0d = mcL.getLabD(), lab1d = mcR.getLabD();
		d_ed = Evaluation.differenceBetweenLab(lab0d, lab1d).toFixed(2);
	}

	function clickColorBtn(e: Event) {
		if (e.target && (e.target as HTMLElement).classList.contains('selected')) {
			return;
		}
		if (btnL.classList.contains('selected')) {
			btnL.classList.remove('selected');
			btnR.classList.add('selected');

			curMc = mcR;
		} else {
			btnL.classList.add('selected');
			btnR.classList.remove('selected');

			curMc = mcL;
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

		<ColorChart width={256} height={256} value={curTriplet} current={curMc === mcL ? 0 : 1} onUpdate={vs => updatedAll(curChart, vs) }></ColorChart>
	</div>

	<div class="columns">
		<div>
			<fieldset>
				<legend>sRGB</legend>
				<Slider value={rgb[0]} label={'R'} min={0} max={255} onUpdate={v => updated('rgb', 0, v)} />
				<Slider value={rgb[1]} label={'G'} min={0} max={255} onUpdate={v => updated('rgb', 1, v)} />
				<Slider value={rgb[2]} label={'B'} min={0} max={255} onUpdate={v => updated('rgb', 2, v)} />
			</fieldset>
			<fieldset>
				<legend>CIELAB (L*a*b*)</legend>
				<Slider value={lab[0]} label={'L*'} min={0} max={100} onUpdate={v => updated('lab', 0, v)} />
				<Slider value={lab[1]} label={'a*'} min={-128} max={127} onUpdate={v => updated('lab', 1, v)} />
				<Slider value={lab[2]} label={'b*'} min={-128} max={127} onUpdate={v => updated('lab', 2, v)} />
				<hr>
				<Slider value={lch[1]} label={'C*'} min={0} max={181} onUpdate={v => updated('lch', 1, v)} />
				<Slider value={lch[2]} label={'h'} min={0} max={360} onUpdate={v => updated('lch', 2, v)} />
			</fieldset>
			<fieldset>
				<legend>Yxy</legend>
				<Slider value={yxy[0]} label={'Y'} min={0} max={1} decimal={2} onUpdate={v => updated('yxy', 0, v)} />
				<Slider value={yxy[1]} label={'x'} min={0.0050} max={0.85} decimal={4} onUpdate={v => updated('yxy', 1, v)} />
				<Slider value={yxy[2]} label={'y'} min={0.0050} max={0.85} decimal={4} onUpdate={v => updated('yxy', 2, v)} />
			</fieldset>
		</div>
		<div>
			<fieldset>
				<legend>Munsell</legend>
				<Slider value={mun[0]} label={'H'} min={0} max={100} decimal={1} onUpdate={v => updated('munsell', 0, v)} />
				<Slider value={mun[1]} label={'V'} min={0} max={10} decimal={1} onUpdate={v => updated('munsell', 1, v)} />
				<Slider value={mun[2]} label={'C'} min={0} max={46.7} decimal={1} onUpdate={v => updated('munsell', 2, v)} />
				<output>{munStr}</output>
			</fieldset>
			<fieldset>
				<legend>PCCS</legend>
				<Slider value={pccs[0]} label={'h'} min={0} max={24} decimal={1} onUpdate={v => updated('pccs', 0, v)} />
				<Slider value={pccs[1]} label={'l'} min={0} max={10} decimal={1} onUpdate={v => updated('pccs', 1, v)} />
				<Slider value={pccs[2]} label={'s'} min={0} max={10} decimal={1} onUpdate={v => updated('pccs', 2, v)} />
				<hr>
				<Slider value={tone[0]} label={'h'} min={0} max={24} decimal={1} onUpdate={v => updated('tone', 0, v)} />
				<Slider value={tone[1]} label={'l\''} min={0} max={10} decimal={1} onUpdate={v => updated('tone', 1, v)} />
				<output>{pccsStr}</output>
			</fieldset>
		</div>
	</div>
</div>

<style>
	:is(.colorL, .colorR) {
		width: 4rem;
		aspect-ratio: 1;

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
