<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Menubar from "$lib/components/ui/menubar/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import Slider from '$lib/components/slider.svelte';
	import { ReactiveColor } from '$lib/reactive-color.svelte';

	import ChartCanvas from '$lib/chart-canvas.svelte';
	import ColorPair from '$lib/color-pair.svelte';

	import { Color } from 'iroay/iroay';

	let chart: 'lab' | 'xyy' | 'munsell' | 'pccs' | 'tone' = $state('lab');
	let vision: '' | 'p' | 'd' = $state('');

	let isSaturationVisible          : boolean = $state(false);
	let isIsochromaticEllipsisVisible: boolean = $state(false);

	let isUnsaturationMarkerVisible  : boolean = $state(false);
	let isProtanopiaMarkerVisible    : boolean = $state(false);
	let isDeuteranopiaMarkerVisible  : boolean = $state(false);

	let str: string = $state('');

	const rc = new ReactiveColor();

	function keyDown(e: KeyboardEvent): void {
		if (e.isComposing || e.key !== 'Enter') return;
		importString();
	}

	function importString(): void {
		const c: Color | null = Color.fromString(str);
		if (!c) return;
		str = '';
		rc.set(str);
	}
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

<div class="flex flex-col sm:flex-row gap-4 p-4">
	<div class="flex flex-col gap-4 p-1">
		<ColorPair bind:current={rc.current} values={rc.values}></ColorPair>

		<ChartCanvas
			width={256}
			height={256}
			bind:values={rc.values}
			current={rc.current}
			{chart}
			{vision}
			{isSaturationVisible}
			{isIsochromaticEllipsisVisible}
			{isUnsaturationMarkerVisible}
			{isProtanopiaMarkerVisible}
			{isDeuteranopiaMarkerVisible}
		></ChartCanvas>
	</div>

	<div class="columns-2xs">
		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>sRGB</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider bind:value={rc.rgb0} label={'R'} min={0} max={255} />
				<Slider bind:value={rc.rgb1} label={'G'} min={0} max={255} />
				<Slider bind:value={rc.rgb2} label={'B'} min={0} max={255} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>HSL</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider bind:value={rc.hsl0} label={'H'} min={0} max={360} />
				<Slider bind:value={rc.hsl1} label={'S'} min={0} max={100} />
				<Slider bind:value={rc.hsl2} label={'L'} min={0} max={100} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>CIELAB (L*a*b*)</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider bind:value={rc.lab0} label={'L*'} min={   0} max={100} />
				<Slider bind:value={rc.lab1} label={'a*'} min={-128} max={127} />
				<Slider bind:value={rc.lab2} label={'b*'} min={-128} max={127} />
				<Separator class="my-2"></Separator>
				<Slider bind:value={rc.lch1} label={'C*'} min={0} max={181} />
				<Slider bind:value={rc.lch2} label={'h'}  min={0} max={360} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>xyY</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider bind:value={rc.xyy0} label={'x'} min={0.0050} max={0.85} decimal={4} />
				<Slider bind:value={rc.xyy1} label={'y'} min={0.0050} max={0.85} decimal={4} />
				<Slider bind:value={rc.xyy2} label={'Y'} min={0     } max={1   } decimal={2} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>Munsell</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider bind:value={rc.mun0} label={'H'} min={0} max={ 100} decimal={1} />
				<Slider bind:value={rc.mun1} label={'V'} min={0} max={  10} decimal={1} />
				<Slider bind:value={rc.mun2} label={'C'} min={0} max={46.7} decimal={1} />
				<output class="flex text-sm mt-2 min-h-5">{rc.munStr}</output>
			</Card.Content>
		</Card.Root>

		<Card.Root class="inline-block w-full mb-4">
			<Card.Header class="p-4 pb-0">
				<Card.Title>PCCS</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-1 p-4">
				<Slider bind:value={rc.pccs0} label={'h'} min={0} max={24} decimal={1} />
				<Slider bind:value={rc.pccs1} label={'l'} min={0} max={10} decimal={1} />
				<Slider bind:value={rc.pccs2} label={'s'} min={0} max={10} decimal={1} />
				<Separator class="my-2"></Separator>
				<Slider bind:value={rc.tone0} label={'h'  } min={0} max={24} decimal={1} />
				<Slider bind:value={rc.tone1} label={'l\''} min={0} max={10} decimal={1} />
				<output class="flex text-sm mt-2 min-h-5">{rc.pccsStr}</output>
			</Card.Content>
		</Card.Root>
	</div>
</div>
