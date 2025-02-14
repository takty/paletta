<!-- chart-canvas.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Color, ColorSpace } from 'iroay/iroay';
	import { Chart } from '$lib/chart';
	import { ChartLab } from '$lib/chart-lab';
	import { ChartXyy } from '$lib/chart-xyy';
	import { ChartMunsell } from '$lib/chart-munsell';
	import { ChartPCCS } from '$lib/chart-pccs';
	import { ChartTone } from '$lib/chart-tone';

	interface Props {
		width? : number;
		height?: number;

		vision?             : '' | 'p' | 'd';
		isSaturationVisible?: boolean;

		isProtanopiaMarkerVisible?    : boolean;
		isDeuteranopiaMarkerVisible?  : boolean;
		isUnsaturationMarkerVisible?  : boolean;
		isIsochromaticEllipsisVisible?: boolean;

		chart?  : 'lab' | 'xyy' | 'munsell' | 'pccs' | 'tone';
		current?: number;
		values? : [Color, Color];
	}

	let {
		width  = 256,
		height = 256,

		vision              = '',
		isSaturationVisible = false,

		isProtanopiaMarkerVisible     = false,
		isDeuteranopiaMarkerVisible   = false,
		isUnsaturationMarkerVisible   = true,
		isIsochromaticEllipsisVisible = true,

		chart   = 'lab',
		current = 0,
		values  = $bindable([new Color(), new Color()]),
	} : Props = $props();

	const chartToObj = {
		'lab'    : new ChartLab(),
		'xyy'    : new ChartXyy(),
		'munsell': new ChartMunsell(),
		'pccs'   : new ChartPCCS(),
		'tone'   : new ChartTone(),
	};

	let cc: Chart = $derived(chartToObj[chart]);
	const ls: [string, string] = ['L', 'R'];

	let can: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	onMount((): void => {
		ctx = can.getContext('2d') as CanvasRenderingContext2D;
	});

	$effect((): void => {
		if (ctx) update(current);
	});

	function pointMap({ offsetX: x, offsetY: y }: { offsetX: number, offsetY: number }): void {
		const temp: Color = new Color();
		cc.xyToC(values[current], x / width, y / height, temp);
		values[current] = temp;
		update(current);
	}

	function wheelMap({ deltaY: d }: { deltaY: number }): void {
		const temp: Color = new Color();
		cc.dToC(values[current], d, values[current]);
		values[current] = temp;
		update(current);
	}

	function update(idx: number): void {
		cc.drawMap(ctx, values[idx], isSaturationVisible, isIsochromaticEllipsisVisible, vision);

		let doUsMarker: boolean = false;

		for (let i: number = 0; i < values.length; ++i) {
			const sat: boolean = values[i].isRGBSaturated(true);
			const stroke = idx === i ? '#000' : '#777';
			cc.drawMarker(ctx, values[i], values[idx], sat ? '#f00' : '#fff', stroke, ls[i]);

			if(isProtanopiaMarkerVisible) {
				cc.drawMarker(ctx, values[i].toProtanopia(), values[idx], '#fff', stroke, ls[i] + ' p');
			}
			if(isDeuteranopiaMarkerVisible) {
				cc.drawMarker(ctx, values[i].toDeuteranopia(), values[idx], '#fff', stroke, ls[i] + ' d');
			}
			if (idx === i && sat) doUsMarker = true;
		}
		if(isUnsaturationMarkerVisible && doUsMarker) {
			const c = new Color(ColorSpace.Rgb, values[idx].asRgb());
			cc.drawMarker(ctx, c, values[idx], '#fff', '#000', `s (${cc.getMapZ(c)})`);
		}
	}
</script>

<canvas bind:this={can} {width} {height} onclick={pointMap} onwheel={wheelMap}></canvas>
