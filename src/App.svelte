<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Menubar from "$lib/components/ui/menubar/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import Slider from '$lib/components/slider.svelte';

	import ColorChart from '$lib/chart-canvas.svelte';
	import ButtonSwitch from '$lib/button-switch.svelte';
	import DeltaTable from '$lib/delta-table.svelte';

	import { onMount } from 'svelte';
	import { ColorSpace, Color } from 'iroay/iroay';

	type Triplet = [number, number, number];

	let rgb    : Triplet = $state([0, 0, 0]);
	let hsl    : Triplet = $state([0, 0, 0]);
	let lab    : Triplet = $state([0, 0, 0]);
	let lch    : Triplet = $state([0, 0, 0]);
	let xyy    : Triplet = $state([0.0005, 0.0005, 0]);
	let mun    : Triplet = $state([0, 0, 0]);
	let pccs   : Triplet = $state([0, 0, 0]);
	let tone   : Triplet = $state([0, 0, 0]);
	let munStr : string  = $state('');
	let pccsStr: string  = $state('');

	let current : number = $state(0);
	let colorCur: Color  = $state(new Color());
	let colorL  : Color  = $state(new Color());
	let colorR  : Color  = $state(new Color());

	let chart: 'lab' | 'xyy' | 'munsell' | 'pccs' | 'tone' = $state('lab');
	let vision: '' | 'p' | 'd' = $state('');

	let isSaturationVisible          : boolean = $state(false);
	let isIsochromaticEllipsisVisible: boolean = $state(false);

	let isUnsaturationMarkerVisible  : boolean = $state(false);
	let isProtanopiaMarkerVisible    : boolean = $state(false);
	let isDeuteranopiaMarkerVisible  : boolean = $state(false);

	let str: string = $state('');

	function updatedAll(c: Color): void {
		colorCur = c;
		updateValues();
	}

	function updated(cs: ColorSpace, idx: number, v: number): void {
		const t: Triplet = colorCur.as(cs);
		t[idx] = v;
		colorCur = new Color(cs, t);
		updateValues();
	}

	function updateValues(): void {
		rgb     = colorCur.asRgb();
		hsl     = colorCur.asHsl();
		lab     = colorCur.asLab();
		lch     = colorCur.asLch();
		xyy     = colorCur.asXyy();
		mun     = colorCur.asMunsell();
		pccs    = colorCur.asPccs();
		tone    = colorCur.asTone();
		munStr  = colorCur.asMunsellNotation();
		pccsStr = colorCur.asPCCSNotation();

		colorCur = colorCur;
		if (0 === current) colorL = colorCur;
		if (1 === current) colorR = colorCur;
	}

	function clickColorBtn(c: number): void {
		current = c;
		if (0 === current) colorCur = colorL;
		if (1 === current) colorCur = colorR;
		updateValues();
	}

	function importString(): void {
		const c: Color | null = Color.fromString(str);
		if (c) {
			str = '';
			updatedAll(c);
		}
	}

	function keyDown(e: KeyboardEvent): void {
		if (e.isComposing || e.key !== 'Enter') return;
		importString();
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
				<Menubar.RadioItem value="xyy">xyY</Menubar.RadioItem>
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

<div class="flex items-center pt-4 px-4 gap-3 pb-1">
	<Label for="color-str" class="whitespace-nowrap">CSS-Like Color</Label>
	<Input type="text" id="color-str" placeholder="Color String" bind:value={str} onkeydown={keyDown} />
	<Button variant="secondary" onclick={importString}>Import</Button>
</div>

<div class="flex flex-col sm:flex-row gap-x-4 p-4">
	<div class="flex flex-col gap-4 p-1">
		<div class="flex flex-row gap-x-4 items-center">
			<ButtonSwitch {colorL} {colorR} onclick={clickColorBtn}></ButtonSwitch>
			<DeltaTable {colorL} {colorR}></DeltaTable>
		</div>

		<ColorChart
			width={256}
			height={256}
			value={colorCur}
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

	<div class="columns-2xs">
		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>sRGB</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider value={rgb[0]} label={'R'} min={0} max={255} onupdate={v => updated(ColorSpace.Rgb, 0, v)} />
				<Slider value={rgb[1]} label={'G'} min={0} max={255} onupdate={v => updated(ColorSpace.Rgb, 1, v)} />
				<Slider value={rgb[2]} label={'B'} min={0} max={255} onupdate={v => updated(ColorSpace.Rgb, 2, v)} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>HSL</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider value={hsl[0]} label={'H'} min={0} max={360} onupdate={v => updated(ColorSpace.Hsl, 0, v)} />
				<Slider value={hsl[1]} label={'S'} min={0} max={100} onupdate={v => updated(ColorSpace.Hsl, 1, v)} />
				<Slider value={hsl[2]} label={'L'} min={0} max={100} onupdate={v => updated(ColorSpace.Hsl, 2, v)} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>CIELAB (L*a*b*)</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider value={lab[0]} label={'L*'} min={0} max={100} onupdate={v => updated(ColorSpace.Lab, 0, v)} />
				<Slider value={lab[1]} label={'a*'} min={-128} max={127} onupdate={v => updated(ColorSpace.Lab, 1, v)} />
				<Slider value={lab[2]} label={'b*'} min={-128} max={127} onupdate={v => updated(ColorSpace.Lab, 2, v)} />
				<Separator class="my-2"></Separator>
				<Slider value={lch[1]} label={'C*'} min={0} max={181} onupdate={v => updated(ColorSpace.Lch, 1, v)} />
				<Slider value={lch[2]} label={'h'} min={0} max={360} onupdate={v => updated(ColorSpace.Lch, 2, v)} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>xyY</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider value={xyy[0]} label={'x'} min={0.0050} max={0.85} decimal={4} onupdate={v => updated(ColorSpace.Xyy, 0, v)} />
				<Slider value={xyy[1]} label={'y'} min={0.0050} max={0.85} decimal={4} onupdate={v => updated(ColorSpace.Xyy, 1, v)} />
				<Slider value={xyy[2]} label={'Y'} min={0} max={1} decimal={2} onupdate={v => updated(ColorSpace.Xyy, 2, v)} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>Munsell</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider value={mun[0]} label={'H'} min={0} max={100} decimal={1} onupdate={v => updated(ColorSpace.Munsell, 0, v)} />
				<Slider value={mun[1]} label={'V'} min={0} max={10} decimal={1} onupdate={v => updated(ColorSpace.Munsell, 1, v)} />
				<Slider value={mun[2]} label={'C'} min={0} max={46.7} decimal={1} onupdate={v => updated(ColorSpace.Munsell, 2, v)} />
				<output class="flex text-sm mt-2 min-h-5">{munStr}</output>
			</Card.Content>
		</Card.Root>

		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>PCCS</Card.Title>
				<!-- <Card.Description></Card.Description> -->
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider value={pccs[0]} label={'h'} min={0} max={24} decimal={1} onupdate={v => updated(ColorSpace.Pccs, 0, v)} />
				<Slider value={pccs[1]} label={'l'} min={0} max={10} decimal={1} onupdate={v => updated(ColorSpace.Pccs, 1, v)} />
				<Slider value={pccs[2]} label={'s'} min={0} max={10} decimal={1} onupdate={v => updated(ColorSpace.Pccs, 2, v)} />
				<Separator class="my-2"></Separator>
				<Slider value={tone[0]} label={'h'} min={0} max={24} decimal={1} onupdate={v => updated(ColorSpace.Tone, 0, v)} />
				<Slider value={tone[1]} label={'l\''} min={0} max={10} decimal={1} onupdate={v => updated(ColorSpace.Tone, 1, v)} />
				<output class="flex text-sm mt-2 min-h-5">{pccsStr}</output>
			</Card.Content>
		</Card.Root>
	</div>
</div>
