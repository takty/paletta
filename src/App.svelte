<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Menubar from "$lib/components/ui/menubar/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import Slider from '$lib/components/slider.svelte';

	import ColorChart from '$lib/chart-canvas.svelte';
	import ButtonSwitch from '$lib/button-switch.svelte';
	import DeltaTable from '$lib/delta-table.svelte';

	import { onMount } from 'svelte';
	import { ColorSpace, Color } from 'iroay/iroay';

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

	let colorL: Color = ms[0];
	let colorR: Color = ms[1];

	let chart: 'lab' | 'yxy' | 'munsell' | 'pccs' | 'tone' = 'lab';
	let vision: '' | 'p' | 'd' = '';

	let isSaturationVisible = false;
	let isIsochromaticEllipsisVisible = false;

	let isUnsaturationMarkerVisible = false;
	let isProtanopiaMarkerVisible = false;
	let isDeuteranopiaMarkerVisible = false;

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

		ms[current] = ms[current];
		if (0 === current) colorL = ms[0];
		if (1 === current) colorR = ms[1];
	}

	function clickColorBtn(c: number): void {
		current = c;
		updateValues();
	}

	onMount(() => {
		updateValues();
	});
</script>

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger>Chart</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.RadioGroup bind:value={chart}>
				<Menubar.RadioItem value="lab">L*a*b*</Menubar.RadioItem>
				<Menubar.RadioItem value="yxy">Yxy</Menubar.RadioItem>
				<Menubar.RadioItem value="munsell">Munsell</Menubar.RadioItem>
				<Menubar.RadioItem value="pccs">PCCS</Menubar.RadioItem>
				<Menubar.RadioItem value="tone">PCCS Tone</Menubar.RadioItem>
			</Menubar.RadioGroup>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>Simulation</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.RadioGroup bind:value={vision}>
				<Menubar.RadioItem value="">None</Menubar.RadioItem>
				<Menubar.Separator />
				<Menubar.RadioItem value="p">Protanopia</Menubar.RadioItem>
				<Menubar.RadioItem value="d">Deuteranopia</Menubar.RadioItem>
			</Menubar.RadioGroup>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>Option</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.CheckboxItem bind:checked={isSaturationVisible}>Show Saturated Colors</Menubar.CheckboxItem>
			<Menubar.CheckboxItem bind:checked={isIsochromaticEllipsisVisible}>Show Isochromatic Ellipsis</Menubar.CheckboxItem>
			<Menubar.Separator />
			<Menubar.CheckboxItem bind:checked={isUnsaturationMarkerVisible}>Show Un-saturation Marker</Menubar.CheckboxItem>
			<Menubar.CheckboxItem bind:checked={isProtanopiaMarkerVisible}>Show Protanopia Marker</Menubar.CheckboxItem>
			<Menubar.CheckboxItem bind:checked={isDeuteranopiaMarkerVisible}>Show Deuteranopia Marker</Menubar.CheckboxItem>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>

<div class="flex flex-row gap-x-4 p-4">
	<div class="flex flex-col gap-4 p-1">
		<div class="flex flex-row gap-x-4 items-center">
			<ButtonSwitch {colorL} {colorR} onclick={clickColorBtn}></ButtonSwitch>
			<DeltaTable {colorL} {colorR}></DeltaTable>
		</div>

		<ColorChart
			width={256}
			height={256}
			value={ms[current]}
			{current}
			onupdate={updatedAll}
			{chart}
			{vision}
			{isSaturationVisible}
			{isIsochromaticEllipsisVisible}
			{isUnsaturationMarkerVisible}
			{isProtanopiaMarkerVisible}
			{isDeuteranopiaMarkerVisible}
		></ColorChart>
	</div>

	<div class="flex flex-col gap-y-4 h-fit">
		<Card.Root class="">
			<Card.Header>
				<Card.Title>sRGB</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1">
				<Slider value={rgb[0]} label={'R'} min={0} max={255} onupdate={v => updated(ColorSpace.RGB, 0, v)} />
				<Slider value={rgb[1]} label={'G'} min={0} max={255} onupdate={v => updated(ColorSpace.RGB, 1, v)} />
				<Slider value={rgb[2]} label={'B'} min={0} max={255} onupdate={v => updated(ColorSpace.RGB, 2, v)} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="">
			<Card.Header>
				<Card.Title>CIELAB (L*a*b*)</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1">
				<Slider value={lab[0]} label={'L*'} min={0} max={100} onupdate={v => updated(ColorSpace.Lab, 0, v)} />
				<Slider value={lab[1]} label={'a*'} min={-128} max={127} onupdate={v => updated(ColorSpace.Lab, 1, v)} />
				<Slider value={lab[2]} label={'b*'} min={-128} max={127} onupdate={v => updated(ColorSpace.Lab, 2, v)} />
				<Separator class="my-2"></Separator>
				<Slider value={lch[1]} label={'C*'} min={0} max={181} onupdate={v => updated(ColorSpace.LCh, 1, v)} />
				<Slider value={lch[2]} label={'h'} min={0} max={360} onupdate={v => updated(ColorSpace.LCh, 2, v)} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="">
			<Card.Header>
				<Card.Title>Yxy</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1">
				<Slider value={yxy[0]} label={'Y'} min={0} max={1} decimal={2} onupdate={v => updated(ColorSpace.Yxy, 0, v)} />
				<Slider value={yxy[1]} label={'x'} min={0.0050} max={0.85} decimal={4} onupdate={v => updated(ColorSpace.Yxy, 1, v)} />
				<Slider value={yxy[2]} label={'y'} min={0.0050} max={0.85} decimal={4} onupdate={v => updated(ColorSpace.Yxy, 2, v)} />
			</Card.Content>
		</Card.Root>
	</div>

	<div class="flex flex-col gap-y-4 h-fit">
		<Card.Root class="">
			<Card.Header>
				<Card.Title>Munsell</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1">
				<Slider value={mun[0]} label={'H'} min={0} max={100} decimal={1} onupdate={v => updated(ColorSpace.Munsell, 0, v)} />
				<Slider value={mun[1]} label={'V'} min={0} max={10} decimal={1} onupdate={v => updated(ColorSpace.Munsell, 1, v)} />
				<Slider value={mun[2]} label={'C'} min={0} max={46.7} decimal={1} onupdate={v => updated(ColorSpace.Munsell, 2, v)} />
				<output class="flex text-sm mt-2 min-h-5">{munStr}</output>
			</Card.Content>
		</Card.Root>

		<Card.Root class="">
			<Card.Header>
				<Card.Title>PCCS</Card.Title>
				<!-- <Card.Description></Card.Description> -->
			</Card.Header>
			<Card.Content class="flex flex-col gap-1">
				<Slider value={pccs[0]} label={'h'} min={0} max={24} decimal={1} onupdate={v => updated(ColorSpace.PCCS, 0, v)} />
				<Slider value={pccs[1]} label={'l'} min={0} max={10} decimal={1} onupdate={v => updated(ColorSpace.PCCS, 1, v)} />
				<Slider value={pccs[2]} label={'s'} min={0} max={10} decimal={1} onupdate={v => updated(ColorSpace.PCCS, 2, v)} />
				<Separator class="my-2"></Separator>
				<Slider value={tone[0]} label={'h'} min={0} max={24} decimal={1} onupdate={v => updated(ColorSpace.Tone, 0, v)} />
				<Slider value={tone[1]} label={'l\''} min={0} max={10} decimal={1} onupdate={v => updated(ColorSpace.Tone, 1, v)} />
				<output class="flex text-sm mt-2 min-h-5">{pccsStr}</output>
			</Card.Content>
		</Card.Root>
	</div>
</div>
